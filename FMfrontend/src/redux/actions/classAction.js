import axios from "axios";
import { ADD_CLASS_ERROR, ADD_CLASS_SUCCESS, PARTICULAR_CLASS_ERROR, PARTICULAR_CLASS_SUCCESS } from "../ActionType";

import {BaseUrl} from '../../Base'
axios.defaults.baseURL = BaseUrl;
axios.defaults.withCredentials=true

// axios.defaults.
export const addClass = (class1) => async (dispatch) => {
    try {
      const { data } = await axios.post("/class/addClass", class1);
      // console.log(data)
      await dispatch({ type: ADD_CLASS_SUCCESS, payload: data });
      return { ...data, success: true };
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      await dispatch({ type: ADD_CLASS_ERROR, paylaod: errorStr });
      return { err: errorStr, success: false };
    }
  };
  export const editClass = (class1) => async (dispatch) => {
    try {
      const { data } = await axios.put("/class/addClass", class1);
      // console.log(data)
      // await dispatch({ type: ADD_CLASS_SUCCESS, payload: data });
      return { ...data, success: true };
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      // await dispatch({ type: ADD_CLASS_ERROR, paylaod: errorStr });
      return { err: errorStr, success: false };
    }
  };
  export const deleteClass = (class1) => async (dispatch) => {
    try {
      // console.log(class1)
      const { data } = await axios.post("/class/deleteClass", class1);
      // console.log(data)
      // await dispatch({ type: ADD_CLASS_SUCCESS, payload: data });
      return { ...data, success: true };
    } catch (error) {
      const errorStr =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      // await dispatch({ type: ADD_CLASS_ERROR, paylaod: errorStr });
      return { err: errorStr, success: false };
    }
  };
  export const dropDown=(param)=>async (dispatch)=>{
    try {
      const {data}=await axios.get('/class/get_data',{params:param})
      // console.log(data)
      return {success:true,class:data}
    } catch (error) {
      const errorStr=error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      console.log(errorStr)
      return {success:false,error:errorStr}
    }
  }
  export const viewClass=(param)=>async (dispatch)=>{
    try {
      const {data}=await axios.get('/class/addClass',{params:param})
      await dispatch({type:PARTICULAR_CLASS_SUCCESS,payload:data})
      return {success:true,class:data}
    } catch (error) {
      const errorStr=error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      await dispatch({type:PARTICULAR_CLASS_ERROR,payload:errorStr})
      return {success:false,error:errorStr}
    }
  }