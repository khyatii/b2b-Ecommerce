// import { ITodo } from './todo';
import {SET_USER} from './action';
import{ IS_STEPPER } from './action'
// import { cartItems } from './cartItems';

export interface IAppState {
    userType:any;
    isStepper: boolean;
}

export const INITIAL_STATE: IAppState = {
    userType :{},
    isStepper:false,
}

export function rootReducer(state, action){
    switch(action.type){
       
        case SET_USER: 
            return Object.assign({}, state, {
               
                userType: state.userType = action.item
            } )
        
        case IS_STEPPER:
            return Object.assign({}, state, {
                isStepper: state.isStepper = action.item
            })
    } 
    return state;
}