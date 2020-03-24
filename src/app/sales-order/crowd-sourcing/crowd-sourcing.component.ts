import { SalesOrderService } from './../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupUser } from '../../signup-user/signup-user.service';
import { ConfigurationService } from '../../services/configuration.service';
import { CompanyDetailService } from '../../services/company-details.services';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-crowd-sourcing',
	templateUrl: './crowd-sourcing.component.html',
	styleUrls: ['./crowd-sourcing.component.css']
})
export class CrowdSourcingComponent implements OnInit {
	currencyArray: any;
	citiesArray: any;
	countryName: any;
	countryArray: any;
	LocationArray: any;
	isHide: boolean = true;
	max = 100;
	min = 0;
	minDate = new Date();
	minValue = 0;
	maxValue = 100;
	thumbLabel = true;
	productarray = [];
	discountarray: any;
	discountdata = []
	shipping;
	crowdSourcingForm: FormGroup;
	options;
	filteredOptions: Observable<string[]>;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	mailText;
	value;
	closingDateVal: any;
	qty: any;
	step = 1;

	unitsArray = ['Kilogram', 'Nos', 'Pieces', 'Tons', 'Units', '20’ Container', '40’Container',
		'Bags', 'Bag', 'Barrel', 'Barrels', 'Bottles', 'Boxes',
		'Bushel', 'Bushels', 'Cartons', 'Dozen', 'Foot', 'Gallon', 'Grams',
		'Hectare', 'Kilometer', 'Kilowatt', 'Litre', 'Litres', 'Long Ton',
		'Meter', 'Metric Ton', 'Metric Tons', 'Ounce', 'Packets', 'Pack',
		'Packs', 'Piece', 'Pounds', 'Reams', 'Rolls', 'Sets', 'Sheets', 'ShortTon',
		'Square Feet', 'Square Metres', 'Watt', 'Bales'
	];

	constructor(private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder,
		private route: Router, private salesOrderService: SalesOrderService,
		private signupUser: SignupUser, private configurationService: ConfigurationService,
		private companyDetailService: CompanyDetailService,
		private purchaseOrderService: PurchaseOrderService, ) { }

	ngOnInit() {
		this.crowdSourcingForm = this.fb.group({
			"txtProduct": ['', Validators.required],
			"txtOrderQuantity": ['', Validators.required],
			"txtPurchaseUnitOfMeasure": [''],
			"txtUrgency": ['', Validators.required],
			"txtClosingDate": ['', Validators.required],
			"txtPaymentTerms": ['', Validators.required],
			"txtShipping": ['', Validators.required],
			"txtItemSize": [''],
			"txtItemWeight": [''],
			"txtSourceCountry": [''],
			"txtSourceCity": [''],
			"txtDeliveryLocation": ['', Validators.required],
			"txtminPriceRange": [''],
			"txtmaxPriceRange": [''],
			"txtBestWarehousingFee": [''],
			"txtBestTransportationFee": [''],
			"txtBestCleaningAndforwardingFee": [''],
			"txtBestInsuranceFee": [''],
			"txtBestTradeFinancing": [''],
			"txtCurrency": [''],
			"txtSupplierRatings": [''],
			"txtSupplierCompliance": [''],
		})
	}
	onInputChange(e) {
		this.minValue = e.value
	}
	onInputMaxChange(e) {
		this.maxValue = e.value
	}

	filter(val: string): string[] {
		return this.options.filter(option =>
			option.productId.txtProductName.toLowerCase().indexOf(val.toLowerCase()) === 0);
	}

	get txtOrderQuantity() {
		return this.crowdSourcingForm.controls.txtOrderQuantity
	}
	get txtShipping() {
		return this.crowdSourcingForm.controls.txtShipping
	}

	get txtProduct() {
		return this.crowdSourcingForm.controls.txtProduct
	}

	get txtDeliveryLocation() {
		return this.crowdSourcingForm.controls.txtDeliveryLocation
	}
	get txtUrgency() {
		return this.crowdSourcingForm.controls.txtUrgency
	}

	get txtClosingDate() {
		return this.crowdSourcingForm.controls.txtClosingDate
	}

	get txtPaymentTerms() {
		return this.crowdSourcingForm.controls.txtPaymentTerms
	}

	productdata() {
		this.salesOrderService.getAllProductList().subscribe(res => {
			this.options = res;
			this.filteredOptions = this.txtProduct.valueChanges
				.startWith(null)
				.map(val => val ? this.filter(val) : this.options.slice());
		})
		this.signupUser.getCountry().subscribe(res => {
			res = res.json()
			this.countryArray = res;
		})

		this.configurationService.getCurrency().subscribe(resp => {
			this.currencyArray = resp;
		})
		this.companyDetailService.getLocation().subscribe(
			res => {
				this.LocationArray = res
			},
			err => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})
	}
	submit(formValues) {
		this.isHide = false;
		this.spinnerService.show()
		this.purchaseOrderService.getSelectedSuppliers(formValues).subscribe(res => {
			this.spinnerService.hide()

			this.productarray = res;
			var txtNoOfItems = res[0].txtNoOfItems;
			var discount = res[0].productId.discountId;

			if (res[0].productId.discountId == null || res[0].productId.discountId == undefined) {
				this.discountarray = 0;
			} else {
				let data = { traderId: res[0].buyerId }
				this.purchaseOrderService.getDiscountSuppliers(data).subscribe(resp => {
					var discountAvailable = res[0].productId.discountId.discount
					var disStartDate = res[0].productId.discountId.start_date.slice(0, 10).replace(/-/g, '/');
					var disEndDate = res[0].productId.discountId.end_date.slice(0, 10).replace(/-/g, '/');
					var minorder = res[0].productId.discountId.minimumOrder;
					if (resp.length == 0) {
						this.discountarray = 0;
					}
					if (resp[0] != null) {
						var currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
						if (minorder <= txtNoOfItems && currentDate >= disStartDate) {
							this.discountarray = discountAvailable;
						}
						else if (minorder <= txtNoOfItems && currentDate >= disEndDate) {
							this.discountarray = 0;
						}
					}
				})
			}
			this.shipping = res[0].shipping;
			this.successMsg = "Your Request is Processed";
			this.showSuccess();
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	issuePurchaseOrder(objData) {
		let id = objData._id;
		this.route.navigate(['/app/purchaseOrders/issuePurchaseOrder', { id }]);
	}

	download(evnt) {
		window.open(evnt, "_blank");
	}
	mailMe(objData) {
		this.value = { _id: objData.crowdSourcingSupplierId };
		this.purchaseOrderService.getRequestedProduct(this.value).subscribe(res => {
			var subject = "Hello "
			var email = res[0].supplierId.email;
			this.mailText = "mailto:" + email + "?subject=" + subject;
			window.location.href = this.mailText;
		})
		// var email=localStorage.getItem('email');
		// var subject="Hello "
		// this.mailText =  "mailto:" + email + "?subject=" + subject;;
		// window.location.href = this.mailText;
	}

	countryChanged(country) {
		this.signupUser.getCites(country).subscribe(res => {
			this.citiesArray = res;
		})
		this.countryName = country.name;
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
