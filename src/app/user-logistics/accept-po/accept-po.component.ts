import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LogisticsService } from '../../services/logistics.service';
import { AppError } from '../../apperrors/apperror';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-accept-po',
  templateUrl: './accept-po.component.html',
  styleUrls: ['./accept-po.component.css']
})
export class AcceptPoComponent implements OnInit {
  value: { _id: any; };
  statusPo: { _id: any; status: any, email: any, supplierEmail: any };
  pendingPoProductArray: Array<object>;
  servicesArray: Array<object>;
  TraderName;
  TraderEmail;
  TraderContact;
  LogisticsName;
  LogisticsEmail;
  LogisticsContact;
  createdAt;
  total;
  tax;
  orderNumber;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isShow: boolean = true;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private route: Router, private router: ActivatedRoute,
    private NotificationService: NotificationService, private logisticsService: LogisticsService) { }

  ngOnInit() {
    this.spinnerService.show()
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;

    this.logisticsService.getPendingWarehouseProduct(this.value).subscribe(res => {
      this.pendingPoProductArray = res;
      localThis.TraderName = res[0]['traderId'].company_name;
      localThis.TraderEmail = res[0]['traderId'].email;
      localThis.TraderContact = res[0]['traderId'].phone_number;
      localThis.LogisticsName = res[0]['warehousePoId']['warehouseId'].company_name;
      localThis.LogisticsEmail = res[0]['warehousePoId']['warehouseId'].email;
      localThis.LogisticsContact = res[0]['warehousePoId']['warehouseId'].phone_number;
      localThis.orderNumber = res[0]['issuePoId'].orderNumber;
      localThis.createdAt = res[0].createdAt;
    })

    this.logisticsService.getSingleWarehousePo(this.value).subscribe(res => {
      this.servicesArray = res;
      this.spinnerService.hide()
      let sum = 0;
      for (let i = 0; i < localThis.servicesArray.length; i++) {
        let subTotal = localThis.servicesArray[i]['PricePerUnit'];
        sum += parseInt(subTotal);
      }
      this.total = sum;
      this.tax = this.total * 10 / 100
    })
  }

  Accepted() {
    let notification = {};
    notification['recieverId'] = this.pendingPoProductArray[0]['traderId']['email'];
    notification['notificationMessage'] = 'Your Product is Ready to Dispatch';
    notification['pageLink'] = 'app/inventory/quotations/request-quotation-table';
    this.spinnerService.show()
    this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.TraderEmail, supplierEmail: this.LogisticsEmail }
    this.logisticsService.postWarehousePoStatus(this.statusPo).subscribe(res => {
      this.successMsg = 'PO Accepted.';
      this.spinnerService.hide()
      this.showSuccess();
      setTimeout(() => {
        this.NotificationService.sendUserNotification(notification);
        this.sendTransportNotification();
        this.sendInsuranceNotification();
        this.route.navigate(['logistic/logisticsUser/logistics-po']);
      }, 2000);
    }, (err) => {
      if (err instanceof AppError) {
        this.errorMsg = "Some error occured"
        this.showError();
      }
    })

  }

  public sendTransportNotification() {
    let notification = {};
    notification['recieverId'] = this.pendingPoProductArray[0]['issuePoId']['txtTransportation']['email'];
    notification['notificationMessage'] = 'This message is for the trader and transport that warehouse is processed';
    notification['pageLink'] = 'logistic/logisticsUser/transport-po';
    if (this.pendingPoProductArray[0]['issuePoId']['txtTransportation'] !== null) {
      this.NotificationService.sendUserNotification(notification);
    }
  }
  public sendInsuranceNotification() {
    let notification = {};
    if (this.pendingPoProductArray[0]['issuePoId']['txtInsurance'] != null || this.pendingPoProductArray[0]['issuePoId']['txtInsurance'] != undefined) {
      notification['recieverId'] = this.pendingPoProductArray[0]['issuePoId']['txtInsurance']['email'];
      notification['notificationMessage'] = 'This message is for the trader and insurance that warehouse is processed';
      notification['pageLink'] = 'logistic/logisticsUser/insuranceAgent-po';
      if (this.pendingPoProductArray[0]['issuePoId']['txtInsurance'] !== null) {
        this.NotificationService.sendUserNotification(notification);
      }
    }

  }

  rejected() {
    let notification = {};
    notification['recieverId'] = this.pendingPoProductArray[0]['traderId'].email;
    notification['notificationMessage'] = 'Your Request is Rejected by Warehouse.';
    notification['pageLink'] = '#';
    this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.TraderEmail, supplierEmail: this.LogisticsEmail }
    this.logisticsService.postWarehousePoStatus(this.statusPo).subscribe(res => {
      this.successMsg = 'PO Rejected.';
      this.NotificationService.sendUserNotification(notification);
      this.showSuccess();
      setTimeout(() => {
        this.route.navigate(['logistic/logisticsUser/logistics-po']);
      }, 2000);
    }, (err) => {
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
