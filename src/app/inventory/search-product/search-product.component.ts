import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotFoundError } from '../../apperrors/notfound';
import { InventoryService } from "../../services/inventory.service";
import { PermissionService } from '../../services/permission.service';

@Component({
	selector: 'app-search-product',
	templateUrl: './search-product.component.html',
	styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit {
	locationArray: any;
	productId;
	filterOptionProduct;
	productNameArray = [];
	maxAmount: any;
	minAmount: any;
	priceRange: any;
	searchProduct: boolean;
	showMessage: boolean = false
	isHide: boolean = true;
	searchProductForm: FormGroup;
	resultArray: Array<object>;
	permission;
	isSuccess: boolean = true;
	errorMsg: string;
	successMsg: string;
	isError: boolean = true;
	step:1;
	constructor(private fb: FormBuilder, private route: Router, private permissionService: PermissionService,
		private inventoryService: InventoryService) { }

	ngOnInit() {
		// this.inventoryService.priceRange().subscribe(res => {
		// 	this.priceRange = res;
		// 	this.maxAmount = res[0].maxAmount
		// 	this.minAmount = res[0].minAmount

		// })
		this.inventoryService.getLocation().subscribe(res => { this.locationArray = res; })
		this.searchProductForm = this.fb.group({
			"txtProductName": ['', Validators.required],
			"txtModel": ['',],
			"txtPartNo": ['',],
			"txtMinPriceRange": ['',],
			"txtMaxPriceRange": ['',],
			"txtSerialNo": ['',],
			"txtStorageLocation": ['',],
		})

		this.inventoryService.getProduct().subscribe(res1 => {
			this.filterOptionProduct = res1;
			this.productNameArray = res1;
		})
	}

	changeProduct(option) {
		this.productId = option._id
	}

	filterProductName(val: string) {
		var a = this.filterOptionProduct.filter(option =>
			option.productId.txtProductName.toLowerCase().indexOf(val.toLowerCase()) === 0
		);
		this.productNameArray = a;
	}

	get txtProductName() {
		return this.searchProductForm.controls.txtProductName
	}

	submit(formValues) {
		this.permissionService.getModulePermissions().subscribe(resp => {
			this.permission = {
				InventoryPermission: resp[0].txtInventoryPermission,
			}
			if (this.permission.InventoryPermission == 'rw') {
				this.isHide = false;
				this.showMessage = false;
				this.searchProduct = true;
				this.inventoryService.searchProduct(formValues).subscribe(res => {
					this.resultArray = res;
					if (this.resultArray.length == 0) this.searchProduct = false;
				}, (err) => {
					if (err instanceof NotFoundError) {
						this.searchProductForm.setErrors({ "notauser": true })
						setTimeout(() => this.showMessage = true, 2000)
					}
				})
			}
			else {
				this.errorMsg = "You Don't have the appropriate permission"
				this.showError()
			}
		})
	}

	requestQuotation(objData) {
		let id = objData._id;
		this.route.navigate(['/app/inventory/quotations/request-quotations', { id }]);
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
