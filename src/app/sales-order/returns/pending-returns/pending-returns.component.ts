import { Router } from '@angular/router';
import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pending-returns',
  templateUrl: './pending-returns.component.html',
  styleUrls: ['./pending-returns.component.css']
})
export class PendingReturnsComponent implements OnInit {
  pendingReturnArray: any;

  constructor(public snackBar: MatSnackBar, private salesOrderService: SalesOrderService, private route: Router) { }

  ngOnInit() {

    this.salesOrderService.getReturnsPending().subscribe(res => {
      this.pendingReturnArray = res;
    })
  }

  issueCN(objData) {
    let id = objData._id;
    this.route.navigate(['/app/inventory/invoice-creditnote', { id }]);
  }

  refund(objData) {
    let id = objData._id;
    this.route.navigate(['/app/salesorders/view-returns', { id }]);
  }

}
