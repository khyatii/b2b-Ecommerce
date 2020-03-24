import { SalesOrderService } from './../../services/sales-order.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LogisticsService } from '../../services/logistics.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  showCard: boolean = false;
  paymentForm: FormGroup;
  paymentTotal;
  paymentLeft;
  minDate = new Date();
  // paymentArray: Array<object>;
  paymentArray = [];
  progressValue = 2;
  progressColor = 'warn';
  value: { _id: any; };
  productArray: Array<object>;
  servicesArray: Array<object>;
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
  invoiceNumber;
  shipping;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  currency;

  constructor(private fb: FormBuilder, private router: ActivatedRoute,
    private salesOrderService: SalesOrderService, private logisticsService: LogisticsService) { }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      'paymentTerms': ['', Validators.required],
      'paidAmount': ['', Validators.required],
      'paymentDate': ['', Validators.required],
      'refrenceNo': ['',]
    })

    this.value = { _id: this.router.snapshot.params['id'] };
    const localThis = this;
    this.salesOrderService.getAllInvoiceProduct(this.value).subscribe(res => {
      this.productArray = res;

      if (res[0] != undefined) {
        this.shipping = res[0].invoiceId.shipping;
        if (res[0].invoiceId.shipping == "FOB") {
          localThis.BuyerName = res[0]['buyerId'].company_name;
          localThis.BuyerEmail = res[0]['buyerId'].email;
          localThis.BuyerContact = res[0]['buyerId'].phone_number;
          localThis.SupplierName = res[0]['supplierId'].company_name;
          localThis.SupplierEmail = res[0]['supplierId'].email;
          localThis.SupplierConatct = res[0]['supplierId'].phone_number;
          localThis.createdAt = res[0].createdAt;
          localThis.orderNumber = res[0].orderNumber;
          localThis.invoiceNumber = res[0].invoiceNumber;
          localThis.currency = res[0].productId.txtCurrency.iso3;

          let sum = 0;
          for (let i = 0; i < localThis.productArray.length; i++) {
            let subTotal = localThis.productArray[i]['txtTotalPrice'];
            sum += subTotal;
          }
          this.total = sum;

          this.tax = this.total * 10 / 100;
          this.paymentTotal = this.total + this.tax;
          if (this.paymentLeft == null) {
            this.paymentLeft = this.total + this.tax;
          }
        }
        else {
          localThis.BuyerName = res[0]['buyerId'].company_name;
          localThis.BuyerEmail = res[0]['buyerId'].email;
          localThis.BuyerContact = res[0]['buyerId'].phone_number;
          localThis.SupplierName = res[0]['supplierId'].company_name;
          localThis.SupplierEmail = res[0]['supplierId'].email;
          localThis.SupplierConatct = res[0]['supplierId'].phone_number;
          localThis.createdAt = res[0].createdAt;
          localThis.orderNumber = res[0].orderNumber;
          localThis.invoiceNumber = res[0].invoiceNumber;
          localThis.currency = res[0].productId.txtCurrency.iso3;

          this.logisticsService.getLogisticsServices(this.value).subscribe(response => {
            this.servicesArray = response;
            let sum = 0;
            let sum1 = 0;
            for (let i = 0; i < localThis.productArray.length; i++) {
              let subTotal = localThis.productArray[i]['txtTotalPrice'];
              sum += subTotal;
            }
            for (let i = 0; i < localThis.servicesArray.length; i++) {
              let subTotal = localThis.servicesArray[i]['PricePerUnit'];
              sum1 += subTotal;
            }
            this.total = sum + sum1;
            this.tax = this.total * 10 / 100;
            this.paymentTotal = this.total + this.tax;
            if (this.paymentLeft == null) {
              this.paymentLeft = this.total + this.tax;
            }
          })
        }
      }

      this.salesOrderService.getPartialPaymentDetails(this.value).subscribe(
        resp => {
          if (resp != "") {
            let index = resp.length - 1;
            this.paymentTotal = parseInt(resp[index].totalAmount);
            this.paymentLeft = parseInt(resp[index].dueAmount);
            this.paymentArray = resp;
            (<FormControl>this.paymentForm.controls['paidAmount'])
              .setValue(this.paymentLeft, { onlySelf: true });
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
      formValues.BuyerEmail = this.BuyerEmail;
      formValues.SupplierEmail = this.SupplierEmail;
      formValues.totalAmount = this.paymentTotal;
      formValues.dueAmount = this.paymentLeft - formValues.paidAmount;


      this.salesOrderService.postPartialPayment(formValues).subscribe(
        res => {
          this.successMsg = "Payment is Done Succesfully";
          this.showSuccess();
          this.showCard = !this.showCard;
          this.paymentForm.reset();
          this.paymentLeft = this.paymentLeft - formValues.paidAmount;
          this.paymentArray.push(formValues)
          this.progressValue = ((this.paymentTotal - this.paymentLeft) / this.paymentTotal) * 100;
          if (this.progressValue > 50) {
            this.progressColor = 'accent'
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
