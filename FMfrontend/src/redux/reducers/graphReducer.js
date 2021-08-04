import { SEE_ATTENDANCE,SEE_ATTENDANCE_LOADING,SEE_ATTENDANCE_ERROR } from "../ActionType"

export const graphReducer=(state={ loading:false,error:null,attendance:null},action)=>{
    switch(action.type){
        case SEE_ATTENDANCE_LOADING:
            return {...state,loading:true,error:null}
        case SEE_ATTENDANCE:
            return {...state,loading:false,error:null,attendance:action.payload}
        case SEE_ATTENDANCE_ERROR:
            return {...state,loading:false,attendance:null,error:action.payload}      
        default:
            return state
    }
}