import { SalesOrderService } from './../../../services/sales-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-invoicing-buyer',
  templateUrl: './invoicing-buyer.component.html',
  styleUrls: ['./invoicing-buyer.component.css']
})
export class InvoicingBuyerComponent implements OnInit {
  BuyerInvoiceForm:FormGroup;
  pendingPoProductArray:Array<object>;
  value: { _id: any; };
  orderDate;
	successMsg:string;
	isSuccess:boolean = true;
	errorMsg:string;
	isError:boolean = true;
  constructor(private fb:FormBuilder,private router:ActivatedRoute,private route:Router,
    private salesOrderService:SalesOrderService) { }

  ngOnInit() {
    this.BuyerInvoiceForm = this.fb.group({
      'txtInvoiceAmount':['',Validators.required],
      'txtDate':['',Validators.required],
      'txtPaymentTerms':['',Validators.required]
    })

    this.value = {_id:this.router.snapshot.params['id']}
    const localThis = this;
    this.salesOrderService.getPendingPOdetails(this.value).subscribe(res=>{
        this.pendingPoProductArray=res;
        localThis.orderDate = res[0].createdAt;
    })
}

submit(formvalue){
    // formvalue.issuePoId = this.value._id;
    // this.route.navigate(['app/salesorders/orders']);
    // this.salesOrderService.postReturnOrder(formvalue).subscribe(res=>{
    //     this.successMsg = 'Invoice Sent.';
    //     this.showSuccess();
    // },
    // (err)=>{
    // if(err instanceof AppError){
    //   this.errorMsg = "Some Error Occured";
    //   this.showError();
    // }
    // })
}


  get txtInvoiceAmount(){
    return this.BuyerInvoiceForm.controls.txtInvoiceAmount
  }
  get txtDate(){
    return this.BuyerInvoiceForm.controls.txtDate
  }
  get txtPaymentTerms(){
    return this.BuyerInvoiceForm.controls.txtPaymentTerms
  }

	showSuccess(){
	  window.scrollTo(500, 0);
	  this.isSuccess =  false;
	  setTimeout(() => {
		this.isSuccess = true;
		this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
	  }, 2000);
	}
  
	showError(){
	  window.scrollTo(500, 0);
	  this.isError =  false;
	  setTimeout(() => {
		this.isError = true; 
	  }, 2000);
	}


}
