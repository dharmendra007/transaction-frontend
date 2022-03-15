import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Transaction } from "../models/transaction.model";

@Injectable({
    providedIn:'root',
})
export class TransactionService{
    constructor(private http:HttpClient){}

    getTransaction():Observable<Transaction[]> {
        return this.http
          .get<Transaction[]>(`/getTransaction`)
          .pipe(
            map((data) => {
              return data;
            })
          );
      }

      addTransaction(transaction:Transaction):Observable<{msg:string}> {
        return this.http.post<{msg:string}>(`/addTransaction`,transaction);
      }

      updateTransaction(transaction:Transaction):Observable<{msg:string}> {
        return this.http.put<{msg:string}>(`/editTransaction/${transaction.tid}`,transaction);
      }

      deleteTransaction(tid:string):Observable<{msg:string}> {
        return this.http.delete<{msg:string}>(`/deleteTransaction/${tid}`);
      }
}