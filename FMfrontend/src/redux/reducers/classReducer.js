import {PARTICULAR_CLASS_SUCCESS, PARTICULAR_CLASS_ERROR } from "../ActionType"

export const particularClass=(state={ error:null,class:null},action)=>{
    switch(action.type){
        case PARTICULAR_CLASS_SUCCESS:
            return {...state,error:null,class:action.payload}
        case PARTICULAR_CLASS_ERROR:
            return {...state,class:null,error:action.payload}      
        default:
            return state
    }
}