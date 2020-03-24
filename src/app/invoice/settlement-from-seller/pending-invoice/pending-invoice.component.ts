import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-pending-invoice',
  templateUrl: './pending-invoice.component.html',
  styleUrls: ['./pending-invoice.component.css']
})
export class PendingInvoiceComponent implements OnInit {
  pendingSellerArray: any;

  isHide:boolean=false;
  constructor(private invoiceService:InvoiceService) { }

  ngOnInit() {
    this.invoiceService.pendingFromSeller().subscribe(res=>{
      this.pendingSellerArray=res;},
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
