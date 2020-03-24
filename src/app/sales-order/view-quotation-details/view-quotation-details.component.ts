import { SalesOrderService } from './../../services/sales-order.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../../services/notification.service'

@Component({
	selector: 'app-view-quotation-details',
	templateUrl: './view-quotation-details.component.html',
	styleUrls: ['./view-quotation-details.component.css']
})
export class ViewQuotationDetailsComponent implements OnInit {
	value: { _id: any; };
	requestQuotationArray: Array<object>;
	showSuccessMessage: boolean;
	BuyerName = '';
	BuyerContact;
	paymentTerms;
	closingDate;
	locationName;
	shipping;
	createdAt;
	itemSize;
	itemWeight;
	BuyerEmail;
	discount;
	minorder;
	finaltotal;
	final;
	viewQuotationDetailsData: FormGroup;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	discountarray = [];
	productDiscount;

	constructor(private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder, private route: Router, private router: ActivatedRoute, private inputOutputService: InputOutputService
		, private salesOrderService: SalesOrderService, private purchaseOrderService: PurchaseOrderService,
		private NotificationService: NotificationService) { }


	buildItem() {
		return this.fb.group({
			"txtTotalPrice": ['', Validators.required],
			"txtUnitPrice": ['', Validators.required],
			"txtNoOfItems": ['', Validators.required],
			"txtItemPerPackage": [''],
			"txtPackagingWeight": [''],
			"txtPackaging": [''],
			"hiddenId": [''],
			"txtPaymentModeWithDiscount": [''],
			"txtPaymentModeDiscount": [''],
			"txtEarlyPaymentTermDiscount": [''],
			"txtDiscountForEarlyPayment": [''],
		})
	}

	bindProduct() {
		const local = this;
		this.requestQuotationArray.forEach(function (v, i) {
			(<FormArray>local.viewQuotationDetailsData.controls['items']).push(local.buildItem());

			local.viewQuotationDetailsData.controls.items['controls'][i].controls.hiddenId['value'] = v['_id'];
			local.viewQuotationDetailsData.controls.items['controls'][i].controls.hiddenId['status'] = 'VALID';

		})
	}

	ngOnInit() {
		this.spinnerService.show()
		this.viewQuotationDetailsData = this.fb.group({
			"quotationSupplierId": [''],
			"items": this.fb.array(
				[]
			)
		})
		const localThis = this;
		this.value = { _id: this.router.snapshot.params['id'] }

		this.salesOrderService.getRqstQuotation(this.value).subscribe(res => {
			this.requestQuotationArray = res;
			localThis.viewQuotationDetailsData.controls.quotationSupplierId['_value'] = res[0].requestQuotationSupplierId;
			localThis.viewQuotationDetailsData.controls.quotationSupplierId['_status'] = 'VALID';

			localThis.BuyerName = res[0]['buyerId'].company_name;
			localThis.BuyerContact = res[0]['buyerId'].phone_number;
			localThis.BuyerEmail = res[0]['buyerId'].email;
			localThis.paymentTerms = res[0]['requestQuotationId'].paymentTerms;
			localThis.closingDate = res[0]['requestQuotationId'].closingDate;
			localThis.shipping = res[0]['requestQuotationId'].shipping;
			localThis.createdAt = res[0]['createdAt'];
			localThis.itemSize = res[0]['productId'].txtItemSize;
			localThis.itemWeight = res[0]['productId'].txtItemWeight;


			this.bindProduct();
			let data = { customerId: res[0].buyerId._id }

			this.purchaseOrderService.getDiscountSuppliers(data).subscribe(resp => {
				this.spinnerService.hide()
				if (resp.length == 0) {
					for (var i = 0; i < localThis.requestQuotationArray.length; i++) {
						localThis.finaltotal = parseFloat(res[i]['productId'].txtPrice) * parseFloat(res[i].txtNoOfItems);
						this.discountarray.push(localThis.finaltotal);
					}
				}
				if (resp[0] != null) {
					for (let i = 0; i < res.length; i++) {
						this.purchaseOrderService.getProductDiscountGroup(data).subscribe(response => {
							this.productDiscount = response;
							if (response[0].discount != undefined && response[0].productId._id == res[i]['productId']['productId']._id) {

								localThis.discount = (parseFloat(response[0].discount))
								localThis.minorder = (parseFloat(response[0].minimumOrder))

								var total = parseFloat(res[i]['productId'].txtPrice) * parseFloat(res[i].txtNoOfItems);
								localThis.finaltotal = total - (total * localThis.discount) / 100;
								this.discountarray.push(localThis.finaltotal);
							}
							else {
								localThis.finaltotal = parseFloat(res[i]['productId'].txtPrice) * parseFloat(res[i].txtNoOfItems);
								this.discountarray.push(localThis.finaltotal)
							}
						});
					}
				}
			});
			setTimeout(() => {
				for (let i = 0; i < localThis.requestQuotationArray.length; i++) {
					localThis.viewQuotationDetailsData.controls.items['controls'][i].controls.txtUnitPrice['value'] = res[i]['productId'].txtPrice;
					localThis.viewQuotationDetailsData.controls.items['controls'][i].controls.txtNoOfItems['value'] = res[i].txtNoOfItems;
					localThis.viewQuotationDetailsData.controls.items['controls'][i].controls.txtTotalPrice['value'] = this.discountarray[i];


					localThis.viewQuotationDetailsData.controls.items['controls'][i].controls.txtUnitPrice['status'] = "VALID";
					localThis.viewQuotationDetailsData.controls.items['controls'][i].controls.txtNoOfItems['status'] = "VALID";
					localThis.viewQuotationDetailsData.controls.items['controls'][i].controls.txtTotalPrice['status'] = "VALID";
				}
			}, 5000);

		})
	}


	submit(formvalue) {
		this.spinnerService.show()
		let notification = {};
		notification['recieverId'] = this.BuyerEmail;
		notification['notificationMessage'] = 'A seller have updated request quotation';
		notification['pageLink'] = 'app/inventory/quotations/request-quotation-table';
		formvalue.buyerEmail = this.BuyerEmail;
		formvalue.quotationSupplierIds = this.value._id;
		this.salesOrderService.postQuotationData(formvalue).subscribe((res) => {
			this.spinnerService.hide()
			this.successMsg = 'Quotations updated';
			this.showSuccess();
			setTimeout(function () {
				this.NotificationService.sendUserNotification(notification);
				this.route.navigate(['app/salesorders/quotationDetails']);
			}.bind(this), 2000);
		},
			(err) => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})

	}

	removeProduct(index) {
		this.requestQuotationArray.splice(index, 1);
		const arrayControl = <FormArray>this.viewQuotationDetailsData.controls['items'];
		arrayControl.removeAt(index);
	}


	get quotationSupplierId() {
		return this.viewQuotationDetailsData.controls.quotationSupplierId
	}
	get hiddenId() {
		return this.viewQuotationDetailsData.controls.hiddenId
	}
	get txtItemPerPackage() {
		return this.viewQuotationDetailsData.controls.txtItemPerPackage
	}
	get txtPackagingWeight() {
		return this.viewQuotationDetailsData.controls.txtPackagingWeight
	}
	get txtPackaging() {
		return this.viewQuotationDetailsData.controls.txtPackaging
	}
	get txtTotalPrice() {
		return this.viewQuotationDetailsData.controls.txtTotalPrice
	}
	get txtUnitPrice() {
		return this.viewQuotationDetailsData.controls.txtUnitPrice
	}
	get txtNoOfItems() {
		return this.viewQuotationDetailsData.controls.txtNoOfItems
	}
	// get txtPaymentModeWithDiscount() {
	// 	return this.viewQuotationDetailsData.controls.txtPaymentModeWithDiscount
	// }
	// get txtPaymentModeDiscount() {
	// 	return this.viewQuotationDetailsData.controls.txtPaymentModeDiscount
	// }
	// get txtEarlyPaymentTermDiscount() {
	// 	return this.viewQuotationDetailsData.controls.txtEarlyPaymentTermDiscount
	// }
	// get txtDiscountForEarlyPayment() {
	// 	return this.viewQuotationDetailsData.controls.txtDiscountForEarlyPayment
	// }

	calculateTotal(e, val, array) {
		// var final;
		var el = e.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
		var qty = this.viewQuotationDetailsData.controls.items['controls'][val].controls.txtNoOfItems['value'];
		var unitPrice = this.viewQuotationDetailsData.controls.items['controls'][val].controls.txtUnitPrice['value'];

		if (qty != "" && unitPrice != "") {
			var total = parseInt(qty) * parseInt(unitPrice);
			if (array.productId.discountId != undefined) {
				if (array.productId.discountId.minimumOrder <= qty) {
					this.final = total - (total * this.discount) / 100;
				}
				else {
					this.final = parseInt(qty) * parseInt(unitPrice);
				}
			} else {
				this.final = parseInt(qty) * parseInt(unitPrice);

			}
			this.viewQuotationDetailsData.controls.items['controls'][val].controls.txtTotalPrice['value'] = this.final;
			this.viewQuotationDetailsData.controls.items['controls'][val].controls.txtTotalPrice['status'] = 'VALID';

			this.viewQuotationDetailsData.controls.items['controls'][val].controls.txtTotalPrice.setValue(this.final);

			// this.viewQuotationDetailsData.controls.items['controls'][val].controls.txtTotalPrice.value = total;
		}
	}

	keyPress(evt: any) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
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
