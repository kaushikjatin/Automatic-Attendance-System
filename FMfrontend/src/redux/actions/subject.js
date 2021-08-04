import axios from "axios";
import { ADD_SUBJECT, DELETE_SUBJECT, EDIT_SUBJECT, ERROR_SUBJECT, GET_SUBJECT } from "../ActionType";

import {BaseUrl} from '../../Base'
axios.defaults.baseURL = BaseUrl;
axios.defaults.withCredentials=true
export const addSubject = (subject) => async (dispatch) => {
    try {
      const { data } = await axios.post("/subject/", subject);
      // console.log(data)
      await dispatch({ type: ADD_SUBJECT, payload: data });
      return { ...data, success: true };
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      await dispatch({ type: ERROR_SUBJECT, paylaod: errorStr });
      return { err: errorStr, success: false };
    }
  };
  export const editSubject = (subject) => async (dispatch) => {
    try {
      const { data } = await axios.put("/subject", subject);
      await dispatch({ type: EDIT_SUBJECT, payload: data });
      return { ...data, success: true };
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      await dispatch({ type: ERROR_SUBJECT, paylaod: errorStr });
      return { err: errorStr, success: false };
    }
  };
  export const deleteSubject = (subject) => async (dispatch) => {
    try {
      console.log(subject)
      const { data } = await axios.delete("/subject", {params:subject});
      // console.log(data)
      await dispatch({ type: DELETE_SUBJECT, payload: data });
      return { ...data, success: true };
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
          await dispatch({ type: ERROR_SUBJECT, paylaod: errorStr });
      return { err: errorStr, success: false };
    }
  };
  export const viewSubject=(param)=>async (dispatch)=>{
    try {
      const {data}=await axios.get('/subject',{params:param})
      await dispatch({type:GET_SUBJECT,payload:data})
      return {success:true,subject:data}
    } catch (error) {
      const errorStr=error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          await dispatch({ type: ERROR_SUBJECT, paylaod: errorStr });
      return {success:false,error:errorStr}
    }
  }