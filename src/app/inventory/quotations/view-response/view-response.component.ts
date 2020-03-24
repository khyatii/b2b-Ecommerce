import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { AppError } from '../../../apperrors/apperror';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-view-response',
  templateUrl: './view-response.component.html',
  styleUrls: ['./view-response.component.css']
})
export class ViewResponseComponent implements OnInit {

  productArray: Array<object>;
  responseQuotationArray: Array<object>;
  value: { _id: any; };
  _id: any;
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  total;
  tax;
  searchType;
  shipping;
  isReceived = false;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  delarr = [];
  rejectMessage;
  issuePoForm: FormGroup;

  constructor(private inventoryService: InventoryService, private route: Router,
    private router: ActivatedRoute, private fb: FormBuilder,
    public dialog: MatDialog, private salesOrderService: SalesOrderService,
    private NotificationService: NotificationService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;
    this.issuePoForm = this.fb.group({
      "selectItem": ['', Validators.required]
    })
    this.inventoryService.viewResponseQuotationProducts(this.value).subscribe(res => {
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
      // else{
      //   alert("You have Already Issue Po for this Quotation.");
      //   setTimeout(function () {
      //     this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
      //   }.bind(this), 1000);
      // }
    })

    this.inventoryService.getSingleResponseData(this.value).subscribe(res => {
      this.responseQuotationArray = res;
      if (res[0] != undefined) localThis.shipping = res[0].shipping;
    })
  }

  //pop-up for Issuing PO
  openDialog(): void {
    let dialogRef = this.dialog.open(PopUpComponent, {
      width: '700px',
      data: { responseQuotationArray: this.delarr }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  issuePoDirect() {
    var objValues = {
      "txtClearing": "",
      "txtFrightRate": "",
      "txtInsurance": "",
      "txtTransportation": "",
      "txtWarehouse": "",
      "data": this.delarr
    }

    let notification = {};
    notification['recieverId'] = this.SupplierEmail;
    notification['notificationMessage'] = 'buyer have issued purchase order for your products';
    notification['pageLink'] = 'app/salesorders/purchaseorder';
    this.salesOrderService.postIssuePo(objValues).subscribe(res => {
      this.successMsg = 'Issue Po sent sucessfully.';
      this.showSuccess();
      setTimeout(function () {
        this.NotificationService.sendUserNotification(notification);
        this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
      }.bind(this), 2000);
    }, (err) => {
      if (err instanceof AppError) {
        this.errorMsg = "Some error occured"
        this.showError();
      }
    })
  }

  rejectPo(message) {
    let notification = {};
    notification['recieverId'] = this.SupplierEmail;
    notification['notificationMessage'] = 'buyer have rejected purchase order for your product';
    notification['pageLink'] = 'app/salesorders/purchaseorder';
    let data = {};
    var isdeleteOrder = false;
    if (this.delarr.length === this.productArray.length) isdeleteOrder = true;
    data['toupdate'] = this.delarr;
    data['rejectMessage'] = message;
    data['deleteOrder'] = isdeleteOrder;
    this.salesOrderService.postRejectPurchaseOrder(data).subscribe(res => {
      this.delarr.forEach(prod => {
        if (isdeleteOrder) {
          this.NotificationService.sendUserNotification(notification);
          this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
        }
        let index = this.productArray.indexOf(prod);
        if (index > -1) this.productArray.splice(index, 1);
      })
    })

  }
  checkbox(objData) {
    if (this.delarr.find(x => x == objData)) {
      this.delarr.splice(this.delarr.indexOf(objData), 1);
    } else {
      this.delarr.push(objData);
    }
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

  selectSearchtype(eve) {
    this.searchType = eve.value;
    if (this.searchType == 'seller')
      if (this.searchType == 'product') {
      }
  }
  get selectItem() {
    return this.issuePoForm.controls.selectItem
  }

}
