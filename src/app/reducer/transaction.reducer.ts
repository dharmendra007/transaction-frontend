import {initialState} from '../state/transaction.state';
import {addTrans, updateTrans,deleteTrans, loadTransSuccess, addTransSuccess, updateTransSuccess, deleteTransSuccess} from '../actions/transaction.action';
import {createReducer,on} from '@ngrx/store';
import { state } from '@angular/animations';


const transactionReducer=createReducer(initialState,
    on(addTransSuccess,(state:any,action:any)=>{
        let transaction = {...action.transaction};
        return{
            ...state,
            transaction:[...state.transaction,transaction]
        }
    }),
    on(updateTransSuccess,(state:any,action:any)=>{
        const updatedTrans = state.transaction.map((trans: { tid: any; }) => {
            return action.transaction.tid == trans.tid?action.transaction:trans
        });
        return{
            ...state,
            transaction:updatedTrans
        }
    }),
    on(deleteTransSuccess,(state:any,{tid})=>{
       const updatedTrans = state.transaction.filter((trans: { tid: any; })=>{
           return trans.tid != tid
       })      
        return{
            ...state,
            transaction:updatedTrans
        }
    }),
    on(loadTransSuccess,(state:any,action)=>{   
         return{
             ...state,
             transaction:action.transaction
         }
     })             
);

export function transReducer(state:any,action:any){
    return transactionReducer(state,action);
}