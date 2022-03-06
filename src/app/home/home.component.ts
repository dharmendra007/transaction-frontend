import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorService} from 'angular-iban';
import { ToastrService } from 'ngx-toastr';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

export interface dataSet {
  id:string,
  account_holder:string,
  iban:string,
  tdate:string,
  amount:string,
  note:string
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('modulePaginator') modulePaginator!: MatPaginator;

  constructor(private http: HttpClient,private modalService: NgbModal,private formBuilder: FormBuilder,
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
            Validators.pattern('^[0-9.,]+$')
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

      this.dataSource=new MatTableDataSource(this.transactionData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  // Get All Transaction
  getAllTransaction(){
      this.http.get("/getTransaction").subscribe(data => {
      this.transactionData=data;
      this.dataSource=new MatTableDataSource(this.transactionData.transData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error => {
        console.log(error); 
      })
  }

  chnageToDate(date:any){
    let dateVal=date.split('T')[0];
    let chnageToDateSplit=dateVal.split("-").reverse().join("-");
    return chnageToDateSplit;
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

    if (this.form.invalid) {
      console.log(this.f);
      return;
    }
    // Add transaction
    if(this.isEditBox==0){
      this.http.post("/addTransaction", this.form.value).subscribe(data => {
        this.resp=data;
        this.getAllTransaction();
        this.modalService.dismissAll();
        this.toastr.success(this.resp.msg);
        this.onReset();
      },error => {
          console.log(error); 
      });
    }else{
      // Edit transaction
      this.http.put("/editTransaction/"+this.transId, this.form.value).subscribe(data => {
        this.resp=data;
        this.getAllTransaction();
        this.modalService.dismissAll();
        this.toastr.success(this.resp.msg);
        this.onReset();
      },error => {
          console.log(error); 
      });
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
    this.http.delete(`/deleteTransaction/${this.transId}`).subscribe(data => {
      this.resp=data;
      this.getAllTransaction();
      this.modalService.dismissAll();
      this.toastr.success(this.resp.msg);
    },
      error => {
        console.log(error); 
      })
  }

  // Get Single transaction details
  getSingleTransaction(id:Number){
    this.transId=id;
    this.isEdit = true;
    this.isEditBox=1;

    this.http.get(`/getTransaction/${this.transId}`).subscribe(data => {
      this.resp=data;
      this.accountholder = this.resp.data.accountholder;
      this.iban = this.resp.data.iban;
      this.amount = this.resp.data.amount;
      this.notes = this.resp.data.notes;
    },
      error => {
        console.log(error); 
      })
  }

}
