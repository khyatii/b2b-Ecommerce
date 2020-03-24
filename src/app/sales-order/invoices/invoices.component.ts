import { SalesOrderService } from './../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  isHide: boolean = false;
  dateValue: any;
  testDate: any = '';
  showSearch: Array<object> = [];
  invoiceArray: Array<object>;

  constructor(private salesOrderService: SalesOrderService, private route: Router) { }

  ngOnInit() {
    this.salesOrderService.getAllInvoice().subscribe(res => {
      this.invoiceArray = res;
      this.showSearch = res;
    })
  }

  viewInvoices(objData) {
    let id = objData._id;
    this.route.navigate(['/app/inventory/invoice', { id }]);
  }

  showInvoice() {
    this.isHide = true;
  }
  viewInvoiceTable() {
    this.isHide = false;
  }

  Searchandler(e) {
    this.showSearch = [];
    this.testDate = String(e.target.value);
    if (this.testDate !== null) {
      var DateTosearch = this.convert(this.testDate);
      this.invoiceArray.forEach(resp => {
        let Createdon = resp['createdAt'].split('T');
        if (DateTosearch == Createdon[0]) this.showSearch.push(resp);
      })
    }
    if (this.testDate == 'null') {
      this.showSearch = this.invoiceArray;
    }
  }

  public convert(str) {
    var mnths = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = str.split(" ");
    return [date[3], mnths[date[1]], date[2]].join("-");
  }
}


