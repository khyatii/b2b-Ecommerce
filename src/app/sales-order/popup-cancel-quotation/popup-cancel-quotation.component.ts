import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SalesOrderService } from '../../services/sales-order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-cancel-quotation',
  templateUrl: './popup-cancel-quotation.component.html',
  styleUrls: ['./popup-cancel-quotation.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupCancelQuotationComponent implements OnInit {
  productArray = [];
  value;
  status;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isShow: boolean = true;
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  delarr = [];
  btnValue;
  rejectQuotationForm: FormGroup;
  mydata = true;
  statusSelect;

  constructor(public dialogRef: MatDialogRef<PopupCancelQuotationComponent>,
    private route: Router, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private salesOrderService: SalesOrderService) { }

  ngOnInit() {
    this.value = { _id: this.data.id };
    const localThis = this;
    this.rejectQuotationForm = this.fb.group({
      "selectItem": ['', Validators.required]
    })
    this.salesOrderService.getRqstQuotation(this.value).subscribe(res => {
      this.productArray = res;
      if (res[0] != undefined) {
        localThis.BuyerName = res[0]['buyerId'].company_name;
        localThis.BuyerEmail = res[0]['buyerId'].email;
        localThis.BuyerContact = res[0]['buyerId'].phone_number;
        localThis.SupplierName = res[0]['supplierId'].company_name;
        localThis.SupplierEmail = res[0]['supplierId'].email;
        localThis.SupplierConatct = res[0]['supplierId'].phone_number;
        localThis.createdAt = res[0].createdAt;
      }
    });
  }
  cancelQuotation() {
    this.status = {
      status: this.statusSelect, buyerEmail: this.BuyerEmail,
      quotationSupplierId: this.data.id,
      rejectArray: this.delarr
    }
    this.salesOrderService.supplierQuotationCancel(this.status).subscribe(res => {
      this.successMsg = 'Quotation is Rejected';
      this.showSuccess();
    })
  }

  checkbox(objData) {
    if (this.delarr.find(x => x == objData)) {
      this.delarr.splice(this.delarr.indexOf(objData), 1);
    } else {
      this.delarr.push(objData);
    }
  }

  // checkbox(objData) {
  //   if (this.delarr.find(x => x == objData)) {
  //     this.delarr.splice(this.delarr.indexOf(objData), 1);
  //     if (this.delarr.length === 0) {
  //       this.mydata = false;
  //     }
  //   }
  //   else {
  //     this.mydata = true;
  //     this.delarr.push(objData);
  //   }
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }
  get selectItem() {
    return this.rejectQuotationForm.controls.selectItem
  }
  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.dialogRef.close();
      this.route.navigate(['/app/salesorders/quotationDetails']);
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
