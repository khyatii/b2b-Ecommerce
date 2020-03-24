import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-settelment-invoice',
  templateUrl: './settelment-invoice.component.html',
  styleUrls: ['./settelment-invoice.component.css']
})
export class SettelmentInvoiceComponent implements OnInit {
  pendingSellerArray: any;

  isHide:boolean=false;
  constructor(private invoiceService:InvoiceService) { }

  ngOnInit() {
    this.invoiceService.completedFromSeller().subscribe(res=>{
      this.pendingSellerArray=res
    },
    (err)=>{
      if(err instanceof AppError){
        
      }
    })
  }
 
  showInvoice(){
    this.isHide = true;
  }
  viewInvoiceTable(){
    this.isHide = false;
  }

}
