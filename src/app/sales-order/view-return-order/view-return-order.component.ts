import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../services/sales-order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-return-order',
  templateUrl: './view-return-order.component.html',
  styleUrls: ['./view-return-order.component.css']
})
export class ViewReturnOrderComponent implements OnInit {

  productArray: Array<object>;
  statusArray: Array<object>;
  value: { _id: any; };
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  total;
  tax;
  isPacked = false;
  isShipped = false;
  isDelievered = false;
  isReceived = false;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;

  constructor(private router: ActivatedRoute, private route: Router, private NotificationService: NotificationService,
    private salesOrderService: SalesOrderService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;

    this.salesOrderService.getAllReturnsProduct(this.value).subscribe(res => {
      this.productArray = res;

      localThis.BuyerName = res[0]['buyerId'].company_name;
      localThis.BuyerEmail = res[0]['buyerId'].email;
      localThis.BuyerContact = res[0]['buyerId'].phone_number;
      localThis.SupplierName = res[0]['supplierId'].company_name;
      localThis.SupplierEmail = res[0]['supplierId'].email;
      localThis.SupplierConatct = res[0]['supplierId'].phone_number;
      localThis.createdAt = res[0].createdAt;

      let sum = 0;
      for (let i = 0; i < localThis.productArray.length; i++) {
        let subTotal = localThis.productArray[i]['txtTotalPrice'];
        sum += subTotal;
      }
      this.total = sum;

      this.tax = this.total * 10 / 100
    })

    this.salesOrderService.getReturnOrderTrackingStatus(this.value).subscribe(res => {
      this.statusArray = res;
      if (res[0].orderPacked == "accept") {
        this.isPacked = true;
      }
      if (res[0].orderShipped == "received") {
        this.isShipped = true;
      }
      if (res[0].orderDelivered == "received") {
        this.isDelievered = true;
      }
      if (res[0].orderReceived == "received") {
        this.isReceived = true;
      }
    })

  }

  received() {
    let notification = {};
    notification['recieverId'] = this.BuyerEmail;
    notification['notificationMessage'] = 'Your Returned Order is Received by Seller';
    notification['pageLink'] = 'app/salesorders/orders/view';
    this.salesOrderService.postSupplierReturnStatus(this.value).subscribe(res => {
      this.isReceived != this.isReceived;
      this.successMsg = "Return recieving is confirmed";
      this.NotificationService.sendUserNotification(notification);
      this.showSuccess();
    }, err => {
      this.showError();
    })
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
      this.route.navigate(['/app/salesorders/returns']);
    }, 2000);
  }
  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
      this.errorMsg = "Some Error Occured";
    }, 2000);
  }


}
