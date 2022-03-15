import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TransactionState } from "./transaction.state";

const getTransactionState = createFeatureSelector<TransactionState>('transaction');

export const getTransaction = createSelector(getTransactionState,state=>{
    return state.transaction;
})

export const getTransactionById = createSelector(getTransactionState,(state:any,props:any)=>{
    return state.transaction.find((trans: { tid: any; }) => trans.tid==props.tid);
})