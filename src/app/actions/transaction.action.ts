import {createAction, props} from '@ngrx/store';
import {Transaction} from '../models/transaction.model';

export const ADD_TRANS_ACTION = '[trans page] add trans';
export const ADD_TRANS_SUCCESS = '[trans page] add trans success';
export const UPDATE_TRANS_ACTION = '[trans page] update trans';
export const UPDATE_TRANS_SUCCESS = '[trans page] update trans success';
export const DELETE_TRANS_ACTION = '[trans page] delete trans';
export const DELETE_TRANS_SUCCESS = '[trans page] delete trans success';
export const LOAD_TRANS_ACTION = '[trans page] load trans';
export const LOAD_TRANS_SUCCESS = '[trans page] load trans success';

export const addTrans = createAction(ADD_TRANS_ACTION, props<{transaction: Transaction}>());
export const addTransSuccess = createAction(ADD_TRANS_SUCCESS,props<{transaction: Transaction}>());
export const updateTrans = createAction(UPDATE_TRANS_ACTION, props<{transaction: Transaction}>());
export const updateTransSuccess = createAction(UPDATE_TRANS_SUCCESS,props<{transaction: Transaction}>());
export const deleteTrans = createAction(DELETE_TRANS_ACTION, props<{tid: any}>());
export const deleteTransSuccess = createAction(DELETE_TRANS_SUCCESS,props<{tid:any}>());
export const loadTrans = createAction(LOAD_TRANS_ACTION);
export const loadTransSuccess = createAction(LOAD_TRANS_SUCCESS,props<{transaction:Transaction[]}>());