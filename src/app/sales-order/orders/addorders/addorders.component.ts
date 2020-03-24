
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule  } from '@angular/material';
import { InputOutputService } from '../../../services/inputOutput.service';
import { SalesOrderService } from '../../../services/sales-order.service';
import { EmailValidation } from '../../../validators/emailValid';
import { AppError } from '../../../apperrors/apperror';



@Component({
  selector: 'app-addorders',
  templateUrl: './addorders.component.html',
  styleUrls: ['./addorders.component.css']
})
export class AddordersComponent implements OnInit {
  isShow: boolean;

  addOrderData:FormGroup;
  array:Array<number>=[];
  count:number=0;

  constructor(private fb:FormBuilder,private route: Router,
    private inputOutputService:InputOutputService,private salesOrderService:SalesOrderService) { }

  ngOnInit() {
    this.addOrderData = this.fb.group({
      "txtCustomerName":['',Validators.required],
      "txtOrderNo":['',Validators.required],
      "txtIssueDate":['',Validators.required],
      "txtPriceList":['',Validators.required],
      "txtCurrency":['',Validators.required],
      "txtTotalAre":['',Validators.required],
      "txtEmail":['',[Validators.required,EmailValidation.emailValid]],
      "txtPhoneNumber":['',Validators.required],
      "items": this.fb.array(
        [this.buildItem()]
      )
    })
  }
  buildItem() {
    return  this.fb.group({
      name: ['aaa'],
      quantity: [''],
      Price:[''],
      Discount:[''],
      Tax:[''],
      Total:[''],
    })
  }

  get txtCustomerName()  {
    return this.addOrderData.controls.txtCustomerName
  }

  get txtOrderNo()  {
    return this.addOrderData.controls.txtOrderNo
  }

  get txtIssueDate()  {
    return this.addOrderData.controls.txtIssueDate
  }

  get txtPriceList()  {
    return this.addOrderData.controls.txtPriceList
  }

   get txtCurrency()  {
    return this.addOrderData.controls.txtCurrency
  }

  get txtTotalAre()  {
    return this.addOrderData.controls.txtTotalAre
  }

  get txtEmail()  {
    return this.addOrderData.controls.txtEmail
  }

  get txtPhoneNumber()  {
    return this.addOrderData.controls.txtPhoneNumber
  }

  submit(formvalue){
    // localStorage.setItem('issueDate',this.txtIssueDate.value);
    // localStorage.setItem('orderNo',this.txtOrderNo.value);
    // localStorage.setItem('priceList',this.txtPriceList.value);
    // localStorage.setItem('customerName',this.txtCustomerName.value);
    // this.inputOutputService.orderArray.push(formvalue);
    // // this.salesOrderService.postOrder(formvalue).subscribe((res=>{}),
    // (err)=>{
    //   if(err instanceof AppError){

    //   }
    // })

    this.isShow =  true;

    setTimeout(function() { this.isShow = false;this.route.navigate(['app/salesorders/orders']); }.bind(this), 2000);
  }

  addItem(){
    (<FormArray>this.addOrderData.controls['items']).push(this.buildItem());
  }

}
