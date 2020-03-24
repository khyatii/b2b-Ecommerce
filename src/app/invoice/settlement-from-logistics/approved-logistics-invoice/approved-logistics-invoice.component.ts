import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-approved-logistics-invoice',
  templateUrl: './approved-logistics-invoice.component.html',
  styleUrls: ['./approved-logistics-invoice.component.css']
})
export class ApprovedLogisticsInvoiceComponent implements OnInit {
  completedLogisticsArray: Array<any>;


  constructor(private invoiceService:InvoiceService) { }

  ngOnInit() {
    this.invoiceService.completedFromLogistics().subscribe(res=>{
      this.completedLogisticsArray=res;},
    (err)=>{
      if(err instanceof AppError){
        
      }
    })
  }  
}

