import { NotificationService } from './../../../services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SalesOrderService } from '../../../services/sales-order.service';

@Component({
	selector: 'app-return-order',
	templateUrl: './return-order.component.html',
	styleUrls: ['./return-order.component.css']
})
export class ReturnOrderComponent implements OnInit {

	returnOrderData: FormGroup;
	value: { _id: any; };
	productArray: Array<object>;
	orderDate;
	deliveredDate;
	location;
	BuyerEmail;
	SupplierEmail;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	//zoomedImageSrc : any = "http://www.bbspot.com/reviews/wp-content/uploads/2011/02/Dell-Inspiron-I14R-1296TMR-Laptop-with-an-Intel-Core-i3-Processor.jpg";

	constructor(private fb: FormBuilder, private route: Router,
		private salesOrderService: SalesOrderService, private router: ActivatedRoute,
		private NotificationService: NotificationService) { }

	ngOnInit() {
		this.returnOrderData = this.fb.group({
			"txtReasonForReturn": ['', Validators.required],
			"txtComment": ['', Validators.required],
			"txtCreditNote": ['', Validators.required],
			"items": this.fb.array([])
		})
		this.value = { _id: this.router.snapshot.params['id'] }
		const localThis = this;
		this.salesOrderService.getAllPoProduct(this.value).subscribe(res => {
			this.productArray = res;
			localThis.orderDate = res[0].createdAt;
			localThis.BuyerEmail = res[0]['buyerId'].email;
			localThis.SupplierEmail = res[0]['supplierId'].email;
			localThis.deliveredDate = res[0]['issuePoId'].deliveryDate;
			this.bindProduct();
		})
	}

	bindProduct() {
		const local = this;
		this.productArray.forEach(function (v, i) {
			(<FormArray>local.returnOrderData.controls['items']).push(local.buildItem());
			local.returnOrderData.controls.items['controls'][i].controls.hiddenId['value'] = v['productId'];
			local.returnOrderData.controls.items['controls'][i].controls.hiddenId['status'] = 'VALID';
		})
	}
	buildItem() {
		return this.fb.group({
			"hiddenId": [''],
			"txtQunatityToBeReturned": ['', Validators.required],
		})
	}
	removeProduct(index) {
		this.productArray.splice(index, 1);
		(<FormArray>this.returnOrderData.controls['items']).removeAt(index);
	}

	submit(formvalue) {
		formvalue.issuePoId = this.value._id;
		formvalue.BuyerEmail = this.BuyerEmail;
		formvalue.SupplierEmail = this.SupplierEmail;
		let notification = {};
		notification['recieverId'] = this.SupplierEmail;
		notification['notificationMessage'] = 'Return is initiated by Buyer';
		notification['pageLink'] = 'app/salesorders/returns';
		this.salesOrderService.postReturnOrder(formvalue).subscribe(res => {
			this.successMsg = "Return is initiated.";
			this.showSuccess();
			setTimeout(() => {
				this.NotificationService.sendUserNotification(notification);
				this.route.navigate(['app/salesorders/orders']);
			}, 2000)
		},
			(err) => {
				this.errorMsg = "Some Error Occured.";
				this.showError();
			})
	}

	returnQty(e, val) {
		var el = e.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.textContent;
		var qty = e.currentTarget.value;
		if (qty != "") {
			if (parseInt(qty) <= parseInt(el)) { }
			else {
				e.currentTarget.value = '';
				this.returnOrderData.controls.items['controls'][val].controls.txtQunatityToBeReturned['value'] = '';
				this.returnOrderData.controls.items['controls'][val].controls.txtQunatityToBeReturned['status'] = 'INVALID';
				this.returnOrderData.controls.items['controls'][val].controls.txtQunatityToBeReturned.updateValueAndValidity();
				this.errorMsg = "Quantity exceeded the delievered Quantity.";
				this.showError();
			}
		}
	}

	get txtQunatityToBeReturned() {
		return this.returnOrderData.controls.txtQunatityToBeReturned
	}
	get txtReasonForReturn() {
		return this.returnOrderData.controls.txtReasonForReturn
	}
	get txtComment() {
		return this.returnOrderData.controls.txtComment
	}
	get txtCreditNote() {
		return this.returnOrderData.controls.txtCreditNote
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
