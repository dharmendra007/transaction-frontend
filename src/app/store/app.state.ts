import { TransactionState } from "../state/transaction.state";
import {transReducer} from '../reducer/transaction.reducer';

export interface AppState{
    transaction:TransactionState;
}

export const appReducer={
    transaction:transReducer  
}