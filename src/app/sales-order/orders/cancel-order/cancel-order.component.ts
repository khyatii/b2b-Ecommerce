import { NotificationService } from './../../../services/notification.service';

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../../services/sales-order.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.css']
})
export class CancelOrderComponent implements OnInit {
  productArray: Array<object>;
  value: { _id: any; };
  statusOrder: { _id: any; status: any; email: any };
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  total;
  tax;
  orderNumber;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;

  constructor(private route: Router, private salesOrderService: SalesOrderService,
    private router: ActivatedRoute, private NotificationService: NotificationService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;

    this.salesOrderService.getAllPoProduct(this.value).subscribe(res => {
      this.productArray = res;
      localThis.BuyerName = res[0]['buyerId'].company_name;
      localThis.BuyerEmail = res[0]['buyerId'].email;
      localThis.BuyerContact = res[0]['buyerId'].phone_number;
      localThis.SupplierName = res[0]['supplierId'].company_name;
      localThis.SupplierEmail = res[0]['supplierId'].email;
      localThis.SupplierConatct = res[0]['supplierId'].phone_number;
      localThis.orderNumber = res[0]['issuePoId'].orderNumber
      localThis.createdAt = res[0].createdAt;

      let sum = 0;
      for (let i = 0; i < localThis.productArray.length; i++) {
        let subTotal = localThis.productArray[i]['txtTotalPrice'];
        sum += subTotal;
      }
      this.total = sum;

      this.tax = this.total * 10 / 100
    })
  }

  cancelOrder() {
    let notification = {};
    notification['recieverId'] = this.SupplierEmail;
    notification['notificationMessage'] = 'Your Order is Cancelled by Buyer.';
    notification['pageLink'] = 'app/salesorders/purchaseorder';
    this.statusOrder = { _id: this.router.snapshot.params['id'], status: "cancel", email: this.SupplierEmail }
    this.salesOrderService.postBuyerPoStatus(this.statusOrder).subscribe(res => {
      this.NotificationService.sendUserNotification(notification);
      this.showSuccess();
      this.successMsg = 'Order is Cancelled';
      setTimeout(() => {
        this.route.navigate(['app/salesorders/orders/view']);
      }, 2000);
    }, err => {
      if (err instanceof AppError) {
        this.errorMsg = "Some error occured"
        this.showError();
      }
    })
  }
  print(): void {
    window.print();
  };
  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
    }, 2000);
  }
  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }
}
