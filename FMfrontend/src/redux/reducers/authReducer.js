import {
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_PROFILE,
} from "../ActionType";
var initState = {
  loading: false,
  user:
    Object.keys(localStorage).indexOf("user") != -1
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  error: null,
};
// console.log(cookie.loadAll())
export const authReducer = (state = initState, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE:
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, error: null };

    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case USER_LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload, user: null };
    case USER_LOGOUT:
      return { ...state, loading: false, user: null, error: null };
    default:
      return state;
  }
};
