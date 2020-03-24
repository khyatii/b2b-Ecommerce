import { Router } from '@angular/router';
import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-completed-purchase',
  templateUrl: './completed-purchase.component.html',
  styleUrls: ['./completed-purchase.component.css']
})
export class CompletedPurchaseComponent implements OnInit {
  completedPurchaseArray: Array<object>
  constructor(private salesOrderService: SalesOrderService, private route: Router) { }

  ngOnInit() {
    this.salesOrderService.getCompletedPo().subscribe(res => {
      this.completedPurchaseArray = res;
    });
  }

  completedPO(objData) {
    let id = objData._id;
    this.route.navigate(['/app/inventory/invoice-po', { id }]);
  }

}
