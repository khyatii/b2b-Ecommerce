import { NotificationService } from './../../../services/notification.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppError } from '../../../apperrors/apperror';
import { LogisticsService } from '../../../services/logistics.service';

@Component({
  selector: 'app-insurance-po',
  templateUrl: './insurance-po.component.html',
  styleUrls: ['./insurance-po.component.css']
})
export class InsurancePoComponent implements OnInit {
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
    private route: Router,private NotificationService:NotificationService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;
    this.logisticsService.getInsuranceProduct(this.value).subscribe(res => {
      this.pendingPoProductArray = res;
      localThis.TraderName = res[0]['traderId'].company_name;
      localThis.TraderEmail = res[0]['traderId'].email;
      localThis.TraderContact = res[0]['traderId'].phone_number;
      localThis.LogisticsName = res[0]['insurancePoId']['insuranceId'].company_name;
      localThis.LogisticsEmail = res[0]['insurancePoId']['insuranceId'].email;
      localThis.LogisticsContact = res[0]['insurancePoId']['insuranceId'].phone_number;
      localThis.orderNumber = res[0]['issuePoId'].orderNumber;
      localThis.createdAt = res[0].createdAt;
    })

    this.logisticsService.getSingleInsurancePo(this.value).subscribe(res => {
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
    notification['notificationMessage'] = 'Your Order is Insured by Insurance Agent.';
    notification['pageLink'] = '#';
    this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.TraderEmail, LogisticsEmail: this.LogisticsEmail }
    this.logisticsService.postInsurancePoStatus(this.statusPo).subscribe(res => {
      this.successMsg = 'PO Accepted.';
      this.NotificationService.sendUserNotification(notification);
      this.showSuccess();
      setTimeout(() => {
        this.route.navigate(['logistic/logisticsUser/insuranceAgent-po']);
      }, 2000);
    },
      (err) => {
        if (err instanceof AppError) {
          this.errorMsg = "Some error occured"
          this.showError();
        }
      })

  }

  rejected() {
    let notification = {};
    notification['recieverId'] = this.pendingPoProductArray[0]['traderId'].email;
    notification['notificationMessage'] = 'Your Request is Rejected by Insurance Agent.';
    notification['pageLink'] = '#';
    this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.TraderEmail, LogisticsEmail: this.LogisticsEmail }
    this.logisticsService.postInsurancePoStatus(this.statusPo).subscribe(res => {
      this.successMsg = 'PO Rejected.';
      this.NotificationService.sendUserNotification(notification);
      this.showSuccess();
      setTimeout(() => {
        this.route.navigate(['logistic/logisticsUser/insuranceAgent-po']);
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