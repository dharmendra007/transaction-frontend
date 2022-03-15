import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { TransactionService } from "../service/transaction.service";
import { addTrans, addTransSuccess, deleteTrans, deleteTransSuccess, loadTrans, loadTransSuccess, updateTrans, updateTransSuccess } from "../actions/transaction.action";
import { map, mergeMap, switchMap } from "rxjs";
// import {} from '../models/transaction.model'

@Injectable()

export class TransactionEffects{
    constructor(private action$:Actions, private transactionService:TransactionService){}

    loadTransaction$=createEffect(()=>{
        return this.action$.pipe(ofType(loadTrans),
        mergeMap((action)=>{
            return this.transactionService.getTransaction().pipe(
                map((transaction)=>{
                    return loadTransSuccess({transaction})
                })
            )
        })
    )});

    addTransaction$=createEffect(()=>{
        return this.action$.pipe(ofType(addTrans),mergeMap(action=>{
            return this.transactionService.addTransaction(action.transaction).pipe(map(data=>{
                const transaction = {...action.transaction,msg:data.msg}
                return addTransSuccess({transaction})
            }))
        }))
    });

    updateTransaction$=createEffect(()=>{
        return this.action$.pipe(ofType(updateTrans),switchMap(action=>{
            return this.transactionService.updateTransaction(action.transaction).pipe(map(data=>{
                return updateTransSuccess({transaction:action.transaction});
            }))
        }))
    });

    deleteTransaction$=createEffect(()=>{
        return this.action$.pipe(ofType(deleteTrans),switchMap(action=>{
            return this.transactionService.deleteTransaction(action.tid).pipe(map(data=>{
                return deleteTransSuccess({tid:action.tid});
            }))
        }))
    });
}