import axios from "axios";
import {
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_PROFILE,
} from "../ActionType";
import cookie from "react-cookies";
import { BaseUrl } from "../../Base";
// axios.defaults.baseURL = BaseUrl;
axios.defaults.withCredentials = true;
// function to convert base64 image to image
function b64toBlob(b64image) {
  var block = b64image.split(";");
  // Get the content type of the image
  var contentType = block[0].split(":")[1]; // In this case "image/gif"
  // get the real base64 content of the file
  var b64Data = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

  // Convert it to a blob to upload
  var sliceSize = 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
export const userRegister =
  (user = {}) =>
  async (dispatch, getState) => {
    try {
      let fd = new FormData();
      for (var it in user) {
        if (Array.isArray(user[it]))
          for (var item of user[it]) fd.append(`${it}[]`, item);
        else if (it != "profilePic") fd.append(it, user[it]);
        else if (user.profilePic) {
          fd.append("profilePic", b64toBlob(user.profilePic));
        }
      }
      if (user.role === 0)
        user.images.forEach((image, idx) => {
          fd.append(`image${idx}`, b64toBlob(image));
        });

      const { data } = await axios.post("/users/register/" + user.role, fd);
      user = data.User;
      return null;
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log(errorStr);
      return errorStr;
    }
  };
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    console.log(user);
    let fd = new FormData();
    for (var it in user) {
      if (Array.isArray(user[it]))
        for (var item of user[it]) fd.append(`${it}[]`, item);
      else if (it != "profilePic") fd.append(it, user[it]);
      else if (user.profilePic)
        fd.append("profilePic", b64toBlob(user.profilePic));
    }
    const { data } = await axios.put("/users/" + user.role, fd);
    const newuser = data;
    newuser.role = user.role;
    localStorage.setItem("user", JSON.stringify(newuser));
    await dispatch({ type: USER_UPDATE_PROFILE, payload: newuser });
    return null;
  } catch (error) {
    const errorStr =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return errorStr;
  }
};
export const userLogin =
  (email, password, role) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
      const { data } = await axios.post("/users/login/" + role, {
        email,
        password,
      });
      const user = data.User;
      user.role = role;
      //breaking profile pic and storing it in cookie
      dispatch({ type: USER_LOGIN_SUCCESS, payload: user });
      localStorage.setItem("user", JSON.stringify(user));
      cookie.save("token", data.accesstoken);
      // return true
    } catch (error) {
      dispatch({
        type: USER_LOGIN_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      // return false
    }
  };
// localStorage.removeItem('user')
// console.log(Object.keys(localStorage))
export const userLogout =
  ({ role }) =>
  async (dispatch) => {
    dispatch({ type: USER_LOGOUT });
    localStorage.removeItem("user");
    cookie.remove("token");
    try {
      return await axios.post(`/users/logout/${role}`);
    } catch (err) {
      console.log(err);
    }
  };
export const sendOTP = (val) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/users/sendOTP`, val);
    return data;
  } catch (error) {
    const errormsg =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    console.log(errormsg);
    return { success: false, err: errormsg };
  }
};
export const verifyAccount =
  (val, removeUser = false) =>
  async (dispatch) => {
    try {
      const { data } = await axios.post(`/users/verifyAccount`, val);
      data.user.role = val.role;
      if (!removeUser)
        await dispatch({ type: USER_UPDATE_PROFILE, payload: data.user });
      return data;
    } catch (error) {
      const errormsg =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log(errormsg);
      return { success: false, err: errormsg };
    }
  };
