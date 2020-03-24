import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { AppError } from '../../../apperrors/apperror';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pending-logistics-invoice',
  templateUrl: './pending-logistics-invoice.component.html',
  styleUrls: ['./pending-logistics-invoice.component.css']
})
export class PendingLogisticsInvoiceComponent implements OnInit {
  pendingLogisticsArray: Array<object>;
  demoArr = [];

  constructor(private invoiceService: InvoiceService, private route: Router) { }

  ngOnInit() {
    this.invoiceService.pendingFromLogistics().subscribe(res => {
      this.pendingLogisticsArray = res;
      this.demoArr = res;
    },

      (err) => {
        if (err instanceof AppError) {
        }
      })
  }

  invoice(objData) {
    var id = objData._id;
    this.route.navigate(['/app/invoices/invoice-details', { id }]);
  }

  searchVendor(e) {
    this.pendingLogisticsArray = [];
    var InputTerm = e.target.value.toLowerCase();
    this.demoArr.forEach(resp => {
      let str = resp["logisticsId"]["company_name"].toLowerCase();
      let strfoundIndex = str.indexOf(InputTerm);
      if (strfoundIndex >= 0) {
        this.pendingLogisticsArray.push(resp);
      }
    })
  }
}
