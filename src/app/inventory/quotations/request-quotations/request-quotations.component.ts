
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InventoryService } from '../../../services/inventory.service';
import { AppError } from '../../../apperrors/apperror';
import { ConfigurationService } from '../../../services/configuration.service';
import { SalesOrderService } from '../../../services/sales-order.service';
import { CompanyDetailService } from '../../../services/company-details.services';
import { CustomerService } from '../../../services/customer.service';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';



@Component({
	selector: 'app-request-quotations',
	templateUrl: './request-quotations.component.html',
	styleUrls: ['./request-quotations.component.css']
})
export class RequestQuotationsComponent implements OnInit {
	@Output() notify: EventEmitter<any> = new EventEmitter<any>();
	quoutationForm: FormGroup;
	isShow: boolean = true;
	currencyArray = [];
	sellerManagementArray = [];
	productArray = [];
	LocationArray: any;
	successMsg: string;
	value;
	options;
	productName;
	supplierId;
	quantity;
	unitofMeasure;
	filteredOptions: Observable<string[]>;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	isLoading: boolean = false;
	minDate = new Date();
	invitationType;
	isbystepper: boolean = false;
	@select() isStepper: Observable<boolean>;

	constructor(private fb: FormBuilder, private configurationService: ConfigurationService, private route: Router,
		private router: ActivatedRoute, private inventoryService: InventoryService, private salesOrderService: SalesOrderService,
		private companyDetailService: CompanyDetailService, private customerService: CustomerService,
		private ngRedux: NgRedux<IAppState>) { }

	ngOnInit() {

		this.value = { _id: this.router.snapshot.params['id'] }

		this.quoutationForm = this.fb.group({
			"txtProduct": [''],
			"txtinvitationType": ['', Validators.required],
			"txtCurrency": ['', Validators.required],
			"txtPaymentTerms": ['', Validators.required],
			"txtClosingDate": ['', Validators.required],
			"txtDeliveryLocation": ['', Validators.required],
			"txtShipping": ['', Validators.required],
			"supplier": [''],
			"items": this.fb.array(
				[this.buildItem()]
			)
		})

		this.salesOrderService.getAllProductList().subscribe(res => {
			this.options = res;
			this.filteredOptions = this.txtProduct.valueChanges
				.startWith(null)
				.map(val => val ? this.filter(val) : this.options.slice());
		})

		this.configurationService.getCurrency().subscribe(resp => {
			this.currencyArray = resp;
		})

		this.companyDetailService.getLocation().subscribe(res => {
			this.LocationArray = res
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})

		this.customerService.getAllSupplier().subscribe(res => {
			this.sellerManagementArray = res;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})

		this.isStepper.subscribe(res => {
			this.isbystepper = res;
		})
	}

	buildItem() {
		return this.fb.group({
			'txtProduct': ['', Validators.required],
			'txtOrderQuantity': ['', Validators.required]
		})
	}

	addItem() {
		(<FormArray>this.quoutationForm.controls['items']).push(this.buildItem());
	}

	removeItem(index) {
		this.options.splice(index, 1);
		(<FormArray>this.quoutationForm.controls['items']).removeAt(index);
	}

	filter(val: string): string[] {
		return this.options.filter(option =>
			option.productId.txtProductName.toLowerCase().indexOf(val.toLowerCase()) === 0);
	}

	keyPress(evt: any) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}
	get txtProduct() {
		return this.quoutationForm.controls.txtProduct
	}
	get txtOrderQuantity() {
		return this.quoutationForm.controls.txtOrderQuantity
	}
	get txtUnitOfMeasure() {
		return this.quoutationForm.controls.txtUnitOfMeasure
	}
	get txtinvitationType() {
		return this.quoutationForm.controls.txtinvitationType
	}
	get txtCurrency() {
		return this.quoutationForm.controls.txtCurrency
	}
	get txtPaymentTerms() {
		return this.quoutationForm.controls.txtPaymentTerms
	}
	get txtClosingDate() {
		return this.quoutationForm.controls.txtClosingDate
	}
	get txtDeliveryLocation() {
		return this.quoutationForm.controls.txtDeliveryLocation
	}
	get txtShipping() {
		return this.quoutationForm.controls.txtShipping
	}
	get supplier() {
		return this.quoutationForm.controls.supplier
	}

	submit(formValues) {
		formValues.productId = this.value;
		if (this.invitationType == "Open") {
			this.inventoryService.postQuotations(formValues).subscribe(res => {
				if (this.isbystepper) {
					this.successMsg = 'Quotation request is sent Successfully.';
					this.showSuccess();
					setTimeout(() => {
						this.notify.emit();
						// this.route.navigate(['/app/inventory/quotations/request-quotation-table'])
					}, 2000);
				} else {
					this.successMsg = 'Quotation request is sent Successfully.';
					this.showSuccess();
					setTimeout(() => {
						this.route.navigate(['/app/inventory/quotations/request-quotation-table'])
					}, 2000);
				}
			}, (err) => {
				if (err instanceof AppError) {
					this.errorMsg = "No supplier Found"
					this.showError();
				}
			})
		} else {
			formValues.productArray = this.productArray;
			this.inventoryService.postSupplierQuotations(formValues).subscribe(res => {
				if (this.isStepper) {
					this.successMsg = 'Quotation request is sent Successfully.';
					this.showSuccess();
					setTimeout(() => {
						this.notify.emit();
						this.route.navigate(['/app/inventory/quotations/request-quotation-table'])
					}, 2000);
				} else {
					this.successMsg = 'Quotation request is sent Successfully.';
					this.showSuccess();
					setTimeout(() => {
						this.route.navigate(['/app/inventory/quotations/request-quotation-table'])
					}, 2000);
				}
			}, (err) => {
				if (err instanceof AppError) {
					this.errorMsg = "No supplier Found"
					this.showError();
				}
			})
		}
	}
	currency(e) {
	}
	selectSupplier(data) {
		this.supplierId = { supplierId: data.value }
		this.customerService.getSupplierDetail(this.supplierId).subscribe(res => {
			this.productArray = res;
			this.productName = res[0].optProduct.productId.txtProductName;
			this.quantity = res[0].txtOrderQuantity;
			this.unitofMeasure = res[0].optPurchaseUnit;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	invitation(type) {
		this.invitationType = type.value;
		if (this.invitationType == "Closed") {
			this.options.splice(0, 1);
			(<FormArray>this.quoutationForm.controls['items']).removeAt(0);
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
}
