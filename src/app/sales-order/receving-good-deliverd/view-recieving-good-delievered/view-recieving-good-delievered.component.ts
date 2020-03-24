import { NotificationService } from './../../../services/notification.service';
import { SalesOrderService } from './../../../services/sales-order.service';

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { InputOutputService } from '../../../services/inputOutput.service';

@Component({
  selector: 'app-view-recieving-good-delievered',
  templateUrl: './view-recieving-good-delievered.component.html',
  styleUrls: ['./view-recieving-good-delievered.component.css']
})
export class ViewRecievingGoodDelieveredComponent implements OnInit {

  viewRecievingGoodsNoteDate: FormGroup;
  value: { _id: any; };
  productArray: Array<object>;
  orderDate;
  SupplierEmail;
  maxDate = new Date();
  constructor(private fb: FormBuilder, private route: Router, private router: ActivatedRoute,
    private salesOrderService: SalesOrderService, private NotificationService: NotificationService) { }

  ngOnInit() {
    this.viewRecievingGoodsNoteDate = this.fb.group({
      "txtLocation": ['', Validators.required],
      "txtxDelieveredDate": ['', Validators.required],
      "txtComments": ['', Validators.required],
      "items": this.fb.array([])
    })
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;
    this.salesOrderService.getAllPoProduct(this.value).subscribe(res => {
      this.productArray = res;
      localThis.orderDate = res[0].createdAt;
      localThis.SupplierEmail = res[0]['supplierId'].email;
      this.bindProduct();
    });

  }
  download(evnt) {
    window.open(evnt, "_blank");
  }

  bindProduct() {
    const local = this;
    this.productArray.forEach(function (v, i) {
      (<FormArray>local.viewRecievingGoodsNoteDate.controls['items']).push(local.buildItem());
      local.viewRecievingGoodsNoteDate.controls.items['controls'][i].controls.hiddenId['value'] = v['_id'];
      local.viewRecievingGoodsNoteDate.controls.items['controls'][i].controls.hiddenId['status'] = 'VALID';
    })
  }

  buildItem() {
    return this.fb.group({
      "hiddenId": [''],
      "qty": ['', Validators.required],
    })
  }
  submit(formvalue) {
    formvalue._id = this.router.snapshot.params['id'];
    formvalue.email = this.SupplierEmail;
    let notification = {};
    notification['recieverId'] = this.SupplierEmail;
    notification['notificationMessage'] = 'Your Order is Received by Buyer.';
    notification['pageLink'] = 'app/salesorders/purchaseorder';
    this.salesOrderService.postRecievingGoodsData(formvalue).subscribe(res => {
      this.NotificationService.sendUserNotification(notification);
      this.route.navigate(['app/salesorders/recievingGoods']);
    })
  }

  issueGrn() {
    let id = this.router.snapshot.params['id'];
    this.route.navigate(['app/inventory/deliverynote', { id }]);
  }
  pay() {
    this.salesOrderService.getInvoicePage(this.value).subscribe(res => {
      let id = res[0]._id;
      this.route.navigate(['app/inventory/invoice', { id }]);
    })
  }

  deliverQty(e, val) {
    var el = e.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.textContent;
    var qty = e.currentTarget.value;
    if (qty != "") {
      if (parseInt(qty) <= parseInt(el)) { }
      else {
        e.currentTarget.value = '';
        this.viewRecievingGoodsNoteDate.controls.items['controls'][val].controls.qty['value'] = '';
        this.viewRecievingGoodsNoteDate.controls.items['controls'][val].controls.qty['status'] = 'INVALID';
        this.viewRecievingGoodsNoteDate.controls.items['controls'][val].controls.qty.updateValueAndValidity()
      }
    }
  }

  get qty() {
    return this.viewRecievingGoodsNoteDate.controls.txtQuantityDelievered
  }
  get txtLocation() {
    return this.viewRecievingGoodsNoteDate.controls.txtLocation
  }
  get txtxDelieveredDate() {
    return this.viewRecievingGoodsNoteDate.controls.txtxDelieveredDate
  }
  get txtComments() {
    return this.viewRecievingGoodsNoteDate.controls.txtComments
  }

}
