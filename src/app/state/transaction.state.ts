import {Transaction} from '../models/transaction.model';

export interface TransactionState {
    transaction: Transaction[];
}
export const initialState:TransactionState ={
    transaction:[]
}