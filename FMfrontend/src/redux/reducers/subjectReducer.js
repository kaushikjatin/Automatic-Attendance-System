import { ADD_SUBJECT, DELETE_SUBJECT, EDIT_SUBJECT, ERROR_SUBJECT, GET_SUBJECT } from "../ActionType"

export const subject=(state={ error:null,subject:null},action)=>{
    switch(action.type){
        case ADD_SUBJECT:
        case DELETE_SUBJECT:
        case EDIT_SUBJECT:
        case GET_SUBJECT:
            return {error:null,subject:action.payload}
        case ERROR_SUBJECT:
            return {error:action.payload,subject:null}
        default:
            return state
    }
}