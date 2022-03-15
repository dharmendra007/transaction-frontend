import { Component, OnInit,ViewChild,Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorService} from 'angular-iban';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { getTransaction, getTransactionById } from '../state/transaction.selector';
import { addTrans, deleteTrans, loadTrans, updateTrans } from '../actions/transaction.action';

export interface dataSet {
  id:string,
  account_holder:string,
  iban:string,
  tdate:string,
  amount:string,
  note:string
}

export interface Post {
  tid: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['accountholder', 'iban','tdate',"amount","notes","op"];
  dataSource = new MatTableDataSource([]);

  transactionData: any=[]
  postId=0;
  displayNotification=false;
  displayMessage="";
  closeModal: string | undefined;
  action:string ="Add";
  form!: FormGroup;
  submitted = false;
  accountholder:String="";
  iban:String="";
  notes:String="";
  amount:String="";
  isEditBox:Number=0;
  ibanReactive!: FormControl;
  amountError = false;
  amountErrorMsg = "";
  resp:any={};
  transId:Number=0;
  isEdit=false;
  tdate="";
  editData:any

  transaction:Observable<Transaction[]> | undefined

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('modulePaginator') modulePaginator!: MatPaginator;

  constructor(private store:Store<AppState>, private http: HttpClient,private modalService: NgbModal,private formBuilder: FormBuilder,
    private toastr: ToastrService) { 
  }

  ngAfterViewInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.ibanReactive = new FormControl(
      null,
        [
          Validators.required,
          ValidatorService.validateIban
        ]
    );

    this.form = this.formBuilder.group(
      {
        accountholder: [
          '',
          [
            Validators.required
          ]
        ],
        iban:this.ibanReactive,
        amount: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9.,]*$')
          ]
        ],
        notes: [
          '',
          [
            Validators.required
          ]
        ],
      }
    );

    
  this.getAllTransaction(); 

  // this.dataSource=new MatTableDataSource(this.transactionData);
  // this.dataSource.paginator = this.paginator;
  // this.dataSource.sort = this.sort;
  }

  // Get All Transaction
  getAllTransaction(){
    this.store.select(getTransaction).pipe().subscribe(
      data=> {
        this.transactionData=data
        console.log("this.transactionData",this.transactionData);
        this.dataSource=new MatTableDataSource(this.transactionData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );

    this.store.dispatch(loadTrans());
    console.log(this.transactionData);
  }

  chnageToDate(date:any){
      if(date.includes("T")){
        let dateVal=date.split('T')[0];
        let chnageToDateSplit=dateVal.split("-").reverse().join("-");
        return chnageToDateSplit;
      }else{
        return date;
      }
  }
  
  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  triggerDeleteModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-delete'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid || this.amountError==true) {
      console.log(this.f);
      return;
    }
    // Add transaction
    if(this.isEditBox==0){
      this.form.value.tid="";
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      let todayDate = dd + '-' + mm + '-' + yyyy;

      this.form.value.tdate=todayDate;
      const transaction:Transaction = this.form.value;
      this.store.dispatch(addTrans({transaction}));
      this.modalService.dismissAll();
      this.toastr.success("Transaction Added Successfully...");
      this.onReset();

    }else{
      this.editData = this.form.value;
      this.editData.tid = this.transId;
      this.editData.tdate = this.tdate;
      const transaction:Transaction = this.editData;
      this.store.dispatch(updateTrans({transaction}));
      this.modalService.dismissAll();
      this.toastr.success("Transaction Updated Successfully...");
      this.onReset();
      
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  changeIsEdit(){
    this.isEdit = false;
    this.isEditBox=0;
  }

  amountValidation(event: any){
    this.amountError=false;
    this.amountErrorMsg="";
    let amount = event.target.value;
    let dotSplitAmount = amount.split(".");

    if(dotSplitAmount.length>2){
        this.amountError = true;
        this.amountErrorMsg="Amount is invalid";
    }else{
      if(dotSplitAmount[1]){
        if(dotSplitAmount[1].includes(',')){
          this.amountError = true;
          this.amountErrorMsg="Amount is invalid";
        }
      }
      let newAmount = amount.split(",").join("");
      amount = +newAmount;
      console.log(amount);
      if(amount>=50 && amount<=20000000){
        return true;
      }else{
        this.amountError = true;
        this.amountErrorMsg="Amount should be in between 50 and 20000000";
      }
    }

    if(this.amountError==true){
      return false;
    }else{
      return true;
    }
  }

  // Apply filter for mat table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  storeId(id:number){
    this.transId=id;
  }
  
  // Delete Transaction Method
  deleteTtansaction(){
    this.store.dispatch(deleteTrans({tid:this.transId}));
    
    this.modalService.dismissAll();
    this.toastr.success("Transaction Deleted Successfully...");
  }

  // Get Single transaction details
  getSingleTransaction(id:Number){
    this.transId=id;
    this.isEdit = true;
    this.isEditBox=1;

    this.store.select(getTransactionById,{"tid":this.transId}).pipe().subscribe(
      data=> {
        console.log(data);
        this.resp=data;
        this.accountholder = this.resp.accountholder;
        this.iban = this.resp.iban;
        this.amount = this.resp.amount;
        this.notes = this.resp.notes;
        this.tdate = this.resp.tdate;
      }
    );
  }


  getAllTransactionTest():Observable<Post[]>{
    // console.log(this.http.get<Post[]>("/getTransaction"));
    let data = this.http.get<Post[]>('/getTransaction');
    console.log(data);
    return data;
  }

}
