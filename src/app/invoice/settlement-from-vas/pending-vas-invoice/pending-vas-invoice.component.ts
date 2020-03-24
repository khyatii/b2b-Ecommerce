import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-pending-vas-invoice',
  templateUrl: './pending-vas-invoice.component.html',
  styleUrls: ['./pending-vas-invoice.component.css']
})
export class PendingVasInvoiceComponent implements OnInit {
  pendingVasArray: Array<object>

  constructor(private invoiceService:InvoiceService) { }

  ngOnInit() {
    this.invoiceService.pendingValueAdded().subscribe(res=>{this.pendingVasArray=res;},
  (err)=>{
    if(err instanceof AppError){
      
    }
  })
  }

}
