import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-approved-vas-invoice',
  templateUrl: './approved-vas-invoice.component.html',
  styleUrls: ['./approved-vas-invoice.component.css']
})
export class ApprovedVasInvoiceComponent implements OnInit {
  completedVasArray:Array<object>;

  constructor(private invoiceService:InvoiceService) { }

  ngOnInit() {
    this.invoiceService.completedValueAdded().subscribe(res=>{this.completedVasArray=res},
    (err)=>{
      if(err instanceof AppError){
        
      }
    })
  }

}
