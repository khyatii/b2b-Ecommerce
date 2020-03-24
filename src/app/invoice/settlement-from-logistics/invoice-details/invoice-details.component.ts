import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {

  showCard: boolean = false;
  paymentForm: FormGroup;
  paymentTotal;
  paymentLeft;
  minDate = new Date();
  paymentArray = [];
  progressValue = 2;
  progressColor = 'warn';
  value: { _id: any; };
  serviceArray: Array<object>;
  todayDate;
  TraderName;
  TraderEmail;
  TraderContact;
  LogisticsName;
  LogisticsEmail;
  LogisticsContact;
  createdAt;
  invoiceNumber;
  orderNumber;
  total;
  tax;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;

  constructor(private fb: FormBuilder, private router: ActivatedRoute, private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      'paymentTerms': ['', Validators.required],
      'paidAmount': ['', Validators.required],
      'paymentDate': ['', Validators.required],
      'refrenceNo': ['',]
    })

    this.value = { _id: this.router.snapshot.params['id'] };

    const localThis = this;
    this.invoiceService.getLogisticsInvoicesDetails(this.value).subscribe(res => {
      this.serviceArray = res;
      if (res[0] != undefined) {
        localThis.TraderName = res[0]['traderId'].company_name;
        localThis.TraderEmail = res[0]['traderId'].email;
        localThis.TraderContact = res[0]['traderId'].phone_number;
        localThis.LogisticsName = res[0]['logisticsId'].company_name;
        localThis.LogisticsEmail = res[0]['logisticsId'].email;
        localThis.LogisticsContact = res[0]['logisticsId'].phone_number;
        localThis.invoiceNumber = res[0].invoiceNumber;
        localThis.orderNumber = res[0].orderNumber;
        localThis.createdAt = res[0].createdAt;

        let sum = 0;
        for (let i = 0; i < localThis.serviceArray.length; i++) {
          let subTotal = localThis.serviceArray[i]['pricePerUnits'];
          sum += parseInt(subTotal);
        }
        this.total = sum;

        this.tax = this.total * 10 / 100;
        this.paymentTotal = this.total + this.tax;
        if (this.paymentLeft == null) {
          this.paymentLeft = this.total + this.tax;
        }
      }

      this.invoiceService.getPartialPaymentDetails(this.value).subscribe(
        resp => {
          if (resp != "") {
            let index = resp.length - 1;
            this.paymentTotal = parseInt(resp[index].totalAmount);
            this.paymentLeft = parseInt(resp[index].dueAmount);
            this.paymentArray = resp;

            (<FormControl>this.paymentForm.controls['paidAmount'])
              .setValue(this.paymentLeft, { onlySelf: true });

            // let Fulldate = new Date(this.minDate);
            // let month = Fulldate.getMonth() + 1;
            // let date = Fulldate.getDate();
            // let year = Fulldate.getFullYear();
            // this.todayDate = month + "/" + date + "/" + year;

            (<FormControl>this.paymentForm.controls['paymentDate'])
              .setValue(this.minDate, { onlySelf: true });
            this.progressValue = ((this.paymentTotal - this.paymentLeft) / this.paymentTotal) * 100;
            if (this.progressValue > 50) {
              this.progressColor = 'accent'
            }
          }
        })
    })
  }

  get paymentTerms() {
    return this.paymentForm.controls.paymentTerms
  }
  get paidAmount() {
    return this.paymentForm.controls.paidAmount
  }
  get paymentDate() {
    return this.paymentForm.controls.paymentDate
  }
  get refrenceNo() {
    return this.paymentForm.controls.refrenceNo
  }

  print(): void {
    window.print();
  };

  submit(formValues) {
    if (this.paymentLeft > 0 && formValues.paidAmount <= this.paymentLeft) {
      formValues._id = this.value._id;
      formValues.TraderEmail = this.TraderEmail;
      formValues.LogisticsEmail = this.LogisticsEmail;
      formValues.totalAmount = this.paymentTotal;
      formValues.dueAmount = this.paymentLeft - formValues.paidAmount;

      this.invoiceService.postPartialPayment(formValues).subscribe(
        res => {

          this.successMsg = "Payment is Done Succesfully";
          this.showSuccess();
          this.showCard = !this.showCard;
          this.paymentForm.reset();
          this.paymentLeft = this.paymentLeft - formValues.paidAmount
          this.paymentArray.push(formValues)
          this.progressValue = ((this.paymentTotal - this.paymentLeft) / this.paymentTotal) * 100;
          if (this.progressValue > 50) {
            this.progressColor = 'accent'
          }
          if (this.paymentLeft == 0) {
            this.invoiceService.postPaymentStatusBuyer(this.value).subscribe(res => {
            })
          }
        },
        err => {
          this.errorMsg = "Some Error Occured.";
          this.showError();
        }
      )
    }
    else {
      this.errorMsg = "You can't pay more than payment left.";
      this.showError();
    }
  }
  deletePayment(index) {
    let deletedPayment: Array<any> = this.paymentArray.splice(index, 1);
    this.paymentLeft = this.paymentLeft + parseInt(deletedPayment[0].paidAmount);
    this.progressValue = ((this.paymentTotal - this.paymentLeft) / this.paymentTotal) * 100;
    if (this.progressValue < 50) {
      this.progressColor = 'warn'
    }
  }
  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_c29NZnsJP69N1GamgRwCBRi6',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: 2000
    });

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
