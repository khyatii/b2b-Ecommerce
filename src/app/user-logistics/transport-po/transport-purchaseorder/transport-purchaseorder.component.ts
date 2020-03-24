import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogisticsService } from '../../../services/logistics.service';
import { AppError } from '../../../apperrors/apperror';
import { NotificationService } from '../../../services/notification.service'

@Component({
  selector: 'app-transport-purchaseorder',
  templateUrl: './transport-purchaseorder.component.html',
  styleUrls: ['./transport-purchaseorder.component.css']
})
export class TransportPurchaseorderComponent implements OnInit {
  value: { _id: any; };
  statusPo: { _id: any; status: any, email: any, LogisticsEmail: any };
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

  constructor(private router: ActivatedRoute, private logisticsService: LogisticsService,
    private route: Router, private NotificationService: NotificationService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;
    this.logisticsService.getTransportProduct(this.value).subscribe(res => {
      this.pendingPoProductArray = res;
      localThis.TraderName = res[0]['traderId'].company_name;
      localThis.TraderEmail = res[0]['traderId'].email;
      localThis.TraderContact = res[0]['traderId'].phone_number;
      localThis.LogisticsName = res[0]['transportPoId']['transportId'].company_name;
      localThis.LogisticsEmail = res[0]['transportPoId']['transportId'].email;
      localThis.LogisticsContact = res[0]['transportPoId']['transportId'].phone_number;
      localThis.orderNumber = res[0]['issuePoId'].orderNumber;
      localThis.createdAt = res[0].createdAt;
    })

    this.logisticsService.getSingleTransportPo(this.value).subscribe(res => {
      this.servicesArray = res;
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
    notification['recieverId'] = this.pendingPoProductArray[0]['traderId'].email;
    notification['notificationMessage'] = 'Your order is shipped';
    notification['pageLink'] = '#';
    this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.TraderEmail, LogisticsEmail: this.LogisticsEmail }
    this.logisticsService.postTransportPoStatus(this.statusPo).subscribe(res => {
      this.successMsg = 'PO Accepted.';
      this.showSuccess();
      setTimeout(() => {
        this.NotificationService.sendUserNotification(notification);
        this.sendClearingNotification();
        this.route.navigate(['logistic/logisticsUser/transport-po']);
      }, 2000);
    },
      (err) => {
        if (err instanceof AppError) {
          this.errorMsg = "Some error occured"
          this.showError();
        }
      })
  }

  public sendClearingNotification() {
    let notification = {};
    notification['notificationMessage'] = 'Request for Clearing and Forwarding.';
    notification['pageLink'] = 'logistic/logisticsUser/clearingAgent-po';
    if (this.pendingPoProductArray[0]['issuePoId']['txtClearing'] !== null) {
      notification['recieverId'] = this.pendingPoProductArray[0]['issuePoId']['txtClearing']['email'];
      this.NotificationService.sendUserNotification(notification);
    }
  }

  rejected() {
    let notification = {};
    notification['recieverId'] = this.pendingPoProductArray[0]['traderId'].email;
    notification['notificationMessage'] = 'Your Request is Rejected by Transporter.';
    notification['pageLink'] = '#';
    this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.TraderEmail, LogisticsEmail: this.LogisticsEmail }
    this.logisticsService.postTransportPoStatus(this.statusPo).subscribe(res => {
      this.successMsg = 'PO Rejected.';
      this.NotificationService.sendUserNotification(notification);
      this.showSuccess();
      setTimeout(() => {
        this.route.navigate(['logistic/logisticsUser/transport-po']);
      }, 2000);
    },
      (err) => {
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
