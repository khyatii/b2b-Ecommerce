import { Component, OnInit } from '@angular/core';
import { AppError } from '../../apperrors/apperror';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-issue-purchase-order',
  templateUrl: './issue-purchase-order.component.html',
  styleUrls: ['./issue-purchase-order.component.css']
})
export class IssuePurchaseOrderComponent implements OnInit {

  value: { _id: any; };
  productArray: Array<object>;
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  total;
  tax;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isShow: boolean = true;
  shipping;

  constructor(private spinnerService: Ng4LoadingSpinnerService, private router: ActivatedRoute, private route: Router,
    private purchaseOrderService: PurchaseOrderService, private NotificationService: NotificationService) { }

  ngOnInit() {
    this.spinnerService.show()
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;
    this.purchaseOrderService.getRequestedProduct(this.value).subscribe(res => {
      this.spinnerService.hide();
      this.productArray = res;
      localThis.BuyerName = res[0]['buyerId'].company_name;
      localThis.BuyerEmail = res[0]['buyerId'].email;
      localThis.BuyerContact = res[0]['buyerId'].phone_number;
      localThis.SupplierName = res[0]['supplierId'].company_name;
      localThis.SupplierEmail = res[0]['supplierId'].email;
      localThis.SupplierConatct = res[0]['supplierId'].phone_number;
      localThis.shipping = res[0]['crowdSourcingId'].shipping;
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

  request() {
    let notification = {};
    notification['recieverId'] = this.SupplierEmail;
    notification['notificationMessage'] = this.BuyerName + ' have requested for product approval';
    notification['pageLink'] = 'app/salesorders/quotationDetails';
    this.spinnerService.show()
    this.purchaseOrderService.requestCrowdSourcing(this.value).subscribe(res => {
      this.spinnerService.hide()
      this.successMsg = 'Your Request has been sent';
      this.showSuccess();
      setTimeout(() => {
        this.NotificationService.sendUserNotification(notification);
        this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
      }, 2000);
    }, (err) => {
      if (err instanceof AppError) {
        this.errorMsg = "Some error occured"
        this.showError();
      }
    })
  }
  cancel() {
    this.route.navigate(['/app/salesorders/crowdsourcing']);
  }

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
