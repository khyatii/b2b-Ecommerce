import { Router } from '@angular/router';
import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-pending-purchase',
    templateUrl: './pending-purchase.component.html',
    styleUrls: ['./pending-purchase.component.css']
})
export class PendingPurchaseComponent implements OnInit {

    pendingPoArray: Array<object>;

    constructor(private salesOrderService: SalesOrderService, private route: Router) { }

    ngOnInit() {
        this.salesOrderService.getPendingPo().subscribe(res => {
            this.pendingPoArray = res;
        })
    }

    pendingPO(objData) {
        let id = objData._id;
        this.route.navigate(['/app/salesorders/pendingPurchaseOrder', { id }]);
    }

    buyerInvoice(objData) {
        let id = objData._id;
        this.route.navigate(['/app/salesorders/buyerInvoice', { id }]);
    }

}
