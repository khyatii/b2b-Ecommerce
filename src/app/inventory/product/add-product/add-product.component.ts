import { CompanyDetailService } from './../../../services/company-details.services';
import { ConfigurationService } from './../../../services/configuration.service';
import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { InventoryService } from '../../../services/inventory.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from './../dialog/dialog.component';
import { SetupService } from '../../../services/setup.service';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';

const URL = 'http://13.127.188.236:8000/product/add';
// const URL = 'http://localhost:8000/product/add';
@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
	@Output() notify: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	productId: any;
	warehouseArray: any;
	docUploaded: FormData;
	docArray: any;
	defaultImageName: any;
	imageArray = [];
	subCategoryId: any = '';
	categoryId: any = '';
	defaultImg: string = './assets/img/uploadImage.png';
	addProductData: FormGroup;
	imageUploaded: FormData;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	isLoading: boolean = false;
	currencyArray = [];
	unitsArray = ['Kilogram', 'Nos', 'Pieces', 'Tons', 'Units', '20’ Container', '40’ Container', 'Bags',
		'Bag', 'Barrel', 'Barrels', 'Bottles', 'Boxes', 'Bushel', 'Bushels', 'Cartons', 'Dozen', 'Foot',
		'Gallon', 'Grams', 'Hectare', 'Kilometer', 'Kilowatt', 'Litre', 'Litres', 'Long Ton', 'Meter',
		'Metric Ton', 'Metric Tons', 'Ounce', 'Packets', 'Pack', 'Packs', 'Piece', 'Pounds', 'Reams',
		'Rolls', 'Sets', 'Sheets', 'Short Ton', 'Square Feet', 'Square Metres', 'Watt'
	];
	subCategoryArray;
	prefferedSupplierArray;
	filterOptionSubCategory;
	filterOptionProduct;
	filteredOptions: any;
	filterOption;
	categoryArray;
	productNameArray;
	industryArray = [];
	catArray = [];
	subcatArray = [];
	isbystepper: boolean = false;
	@select() isStepper: Observable<boolean>;


	constructor(private fb: FormBuilder,
		private setupService: SetupService, private inventoryService: InventoryService,
		private el: ElementRef, private configurationService: ConfigurationService,
		public compnayDetailService: CompanyDetailService, private route: Router,
		public dialog: MatDialog, private ngRedux: NgRedux<IAppState>) { }

	public uploader: FileUploader = new FileUploader({ url: URL, authToken: localStorage.getItem('email'), itemAlias: 'avatar' });

	openDialog() {
		const dialogRef = this.dialog.open(DialogComponent);

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}



	ngOnInit() {

		//overide the onCompleteItem property of the uploader so we are 
		//able to deal with the server response.
		this.isStepper.subscribe(res => {
			this.isbystepper = res;
		})

		this.loadPrefferedSupplier();

		this.inventoryService.getProduct().subscribe(
			res1 => {
				this.filterOptionProduct = res1;
				this.productNameArray = res1;
			})

		this.setupService.getIndustry().subscribe(res => {
			this.industryArray = res;
		},
			err => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})

		this.inventoryService.getProductCategory().subscribe(
			res => {

				this.filterOption = res;
				this.categoryArray = res;
			}
		)

		this.configurationService.getCurrency().subscribe(
			resp => {
				this.currencyArray = resp;
			}
		)

		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			console.log("ImageUpload:uploaded:", item, status, response);
		};
		this.addProductData = this.fb.group({
			"txtProductCode": ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)]],
			"txtModelCode": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
			"txtPartNo": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
			"txtSerialNo": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
			"txtProductName": ['', Validators.required],

			"industry": ['', Validators.required],
			"txtProductCategory": ['', Validators.required],
			"txtProductSubCategory": ['', Validators.required],

			"txtBrand": ['', Validators.required],
			"txtDescription": [''],
			"txtPrice": ['', Validators.required],
			"txtCurrency": ['', Validators.required],
			"txtQuantityPerUnitPrice": ['', Validators.required],
			"txtStorageLocation": ['', Validators.required],
			"txtSalesUnitOfMeasure": [''],
			"txtDocuments": [''],
			"txtStockOnHand": ['', Validators.required],
			"txtStockAvailable": ['', Validators.required],
			"txtStockReorderLevel": [''],
			"txtProductVideoUrl": ['', Validators.pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)],
			"txtPriceRules": [''],
			"txtSupplier": [''],
			"txtMinimumOrderQuantity": [''],
			"txtItemSize": [''],
			"txtItemColor": [''],
			"txtItemWarranty": [''],
			"txtItemWeight": [''],
		})

		// this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
		this.uploader.onBeforeUploadItem = (fileItem: any) => {
			fileItem.formData = this.addProductData.value
		}

		this.inventoryService.getLocation().subscribe(res => {
			this.warehouseArray = res;
		}, (err) => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	getInventoryLocations() {
		this.inventoryService.getLocation().subscribe(res => {
			this.warehouseArray = res;
			console.log('got response ', res);
		}, (err) => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	closePopUp(event) {
		document.getElementById('modalAddProduct').style.display = 'none';
	}

	changeCategory(option) {
		let values = {
			categoryId: option._id
		}
		this.categoryId = option._id;
		this.inventoryService.getProductSubCategory(values).subscribe(
			res => {
				this.subCategoryArray = res;
				this.filterOptionSubCategory = res;
			}
		)
	}

	getCategories(val) {
		let data = {
			industryId: val.value
		}
		this.setupService.getCategories(data).subscribe(res => {
			this.catArray = res;
		})
	}

	getSubCategories(val) {
		let data = {
			categoryId: val.value
		}
		this.setupService.getSubCategories(data).subscribe(res => {
			this.subcatArray = res;
		})
	}

	loadPrefferedSupplier() {

		this.prefferedSupplierArray;
		this.inventoryService.getPrefferedSupplier().subscribe(
			res => {
				this.prefferedSupplierArray = res;
				//this.filterOptionSubCategory=res;
			}
		)
	}

	changeSubCategory(option) {
		this.subCategoryId = option._id
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
	filterCategory(val: string) {
		var a = this.filterOption.filter(option =>
			option.name.toLowerCase().indexOf(val.toLowerCase()) === 0
		);
		this.categoryArray = a;
	}
	filterSubCategory(val: string) {
		var a = this.filterOptionSubCategory.filter(option =>
			option.name.toLowerCase().indexOf(val.toLowerCase()) === 0
		);
		this.subCategoryArray = a;
	}

	keyPress(evt: any) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

	get txtProductCode() {
		return this.addProductData.controls.txtProductCode
	}
	get txtModelCode() {
		return this.addProductData.controls.txtModelCode
	}
	get txtPartNo() {
		return this.addProductData.controls.txtPartNo
	}
	get txtSerialNo() {
		return this.addProductData.controls.txtSerialNo
	}
	get txtProductName() {
		return this.addProductData.controls.txtProductName
	}
	get industry() {
		return this.addProductData.controls.industry
	}
	get txtProductCategory() {
		return this.addProductData.controls.txtProductCategory
	}
	get txtProductSubCategory() {
		return this.addProductData.controls.txtProductSubCategory
	}
	get txtBrand() {
		return this.addProductData.controls.txtBrand
	}
	get txtDescription() {
		return this.addProductData.controls.txtDescription
	}
	get txtPrice() {
		return this.addProductData.controls.txtPrice
	}
	get txtCurrency() {
		return this.addProductData.controls.txtCurrency
	}
	get txtQuantityPerUnitPrice() {
		return this.addProductData.controls.txtQuantityPerUnitPrice
	}
	get txtStorageLocation() {
		return this.addProductData.controls.txtStorageLocation
	}
	get txtSalesUnitOfMeasure() {
		return this.addProductData.controls.txtSalesUnitOfMeasure
	}
	get txtDocuments() {
		return this.addProductData.controls.txtDocuments
	}
	get txtStockOnHand() {
		return this.addProductData.controls.txtStockOnHand
	}
	get txtStockAvailable() {
		return this.addProductData.controls.txtStockAvailable
	}
	get txtStockReorderLevel() {
		return this.addProductData.controls.txtStockReorderLevel
	}
	get txtProductVideoUrl() {
		return this.addProductData.controls.txtProductVideoUrl
	}
	get txtPriceRules() {
		return this.addProductData.controls.txtPriceRules
	}
	get txtSupplier() {
		return this.addProductData.controls.txtSupplier
	}
	get txtMinimumOrderQuantity() {
		return this.addProductData.controls.txtMinimumOrderQuantity;
	}
	get txtItemSize() {
		return this.addProductData.controls.txtItemSize;
	}
	get txtItemColor() {
		return this.addProductData.controls.txtItemColor;
	}
	get txtItemWarranty() {
		return this.addProductData.controls.txtItemWarranty;
	}
	get txtItemWeight() {
		return this.addProductData.controls.txtItemWeight;
	}

	log(x) {
		console.log(x)
	}

	submit(formValues) {

		this.isLoading = true;
		var imageDone = false;
		var docDone = false;

		if (this.defaultImg == 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png') {
			this.errorMsg = "Please Select a Default Image."
			this.showError();
			this.isLoading = false;
			return;
		}
		// this.upload();

		let fileCount: number = this.imageArray.length;
		this.imageUploaded = new FormData();
		if (fileCount > 0) {
			for (let i = 0; i < fileCount; i++) {
				this.imageUploaded.append('photo', this.imageArray[i]);
			}

		}
		else {
			this.imageUploaded = null;
		}

		if (this.docArray == undefined) {
			var docCount: number = 0;
		}
		else {
			var docCount: number = this.docArray.length;
		}

		this.docUploaded = new FormData();
		if (docCount > 0) {
			for (let i = 0; i < docCount; i++) {
				this.docUploaded.append('docs', this.docArray[i]);
			}

		}
		else {
			this.docUploaded = null;
		}

		formValues.categoryId = this.categoryId;
		formValues.subCategoryId = this.subCategoryId;

		this.inventoryService.addProduct(formValues).subscribe(
			res => {
				this.successMsg = "Product added Succesfully";
				this.showSuccess();
				this.isLoading = false;

				if (this.imageUploaded != undefined || this.imageUploaded != null) {
					this.inventoryService.postImage(res.id, this.defaultImageName, this.imageUploaded).subscribe(

						resp => {

							this.successMsg = "Image Updated Succesfully";
							this.showSuccess();
							this.isLoading = false;
							this.inventoryService.defaultImage({ _id: res.id, name: this.defaultImageName })
								.subscribe(res => {
									imageDone = true;
									if (imageDone == true && docDone == true) {
										if (!this.isbystepper) {
											setTimeout(() => {
												this.route.navigateByUrl('/app/inventory/product');
											}, 2000)
										} else {
											setTimeout(function () {
												this.route.navigateByUrl('/app/inventory/product');
											}.bind(this), 2000);
										}
									}

								})

						}, error => {
							this.errorMsg = "Some Error Occured";
							this.showError();
							this.isLoading = false;
						}
					)
				}
				else {
					imageDone = true;
					if (imageDone == true && docDone == true) {
						setTimeout(() => {
							this.route.navigateByUrl('/app/inventory/product');
						}, 2000)
					}
				}
				if (this.docUploaded != undefined || this.docUploaded != null) {
					this.inventoryService.postDocs(res.id, this.docUploaded).subscribe(res => {

						docDone = true;
						if (imageDone == true && docDone == true) {
							setTimeout(() => {
								this.route.navigateByUrl('/app/inventory/product');
							}, 2000)
						}
					})
				}
				else {
					docDone = true;
					if (imageDone == true && docDone == true) {
						setTimeout(() => {
							this.route.navigateByUrl('/app/inventory/product');
						}, 2000)
					}
				}
			}, err => {
				if (err.err.status == 400) {
					this.errorMsg = "This Product Code Already Exists";
					this.showError();
					this.isLoading = false;
				} else {
					this.errorMsg = "Some Error Occured";
					this.showError();
					this.isLoading = false;
				}

			}, () => {

			}
		)

	}
	fileChange(event) {
		let fileList: FileList = event.target.files;
		var imageSource;
		if (fileList.length > 0) {
			let file: File = fileList[0];
			var img = (<HTMLInputElement>document.querySelector(".img"));
			var reader = new FileReader();
			reader.onload = (function () { return function (e) { imageSource = e.target.result; fileList[0]['imageSrc'] = imageSource }; })();
			reader.readAsDataURL(file);
		}
		let count = fileList.length;
		let imgArray = fileList[0];
		this.imageArray.push(imgArray);
	}
	clickTerms(terms) {
		terms.style.display = 'block';
	}

	closeOutside(terms) {
		terms.style.display = 'none';
	}

	deleteImage(imageId, i) {
		let currentImg = i.previousElementSibling.src;
		let index = this.imageArray.filter(function (v, i) {
			if (v['imageSrc'] != currentImg) {
				return v;
			}
		})
		this.imageArray = [];
		this.imageArray = index;
	}


	//Uplaod image using formdata

	upload() {

		let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
		let fileCount: number = inputEl.files.length;
		this.imageUploaded = new FormData();
		if (fileCount > 0) {
			this.imageUploaded.append('photo', inputEl.files.item(0));
		}
		else {
			this.imageUploaded = null;
		}
	}

	defaultImage(imgData, target, i) {
		this.defaultImg = imgData.imageSrc;
		this.defaultImageName = imgData.name

		let len = this.imageArray.length;
		for (let j = 0; j < len; j++) {
			this.imageArray[j].default = false;
			i.parentElement.parentElement.getElementsByClassName('imgRef')[j].style.borderColor = "gainsboro";
			i.parentElement.parentElement.getElementsByClassName('default-check')[j].style.display = "none";
		}

		imgData.default = true;
		i.style.display = "block";
		i.previousElementSibling.style.borderColor = "green";

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

	uploadDocument(fileRef) {
		fileRef.click();
	}

	docChange(e) {

		this.docArray = e.target.files;
	}

	deleteDoc(index) {
		let newArr = [];
		for (var i = 0; i < this.docArray.length; i++) {
			if (i != index) {
				newArr.push(this.docArray[i])
			}
		}
		this.docArray = [];
		this.docArray = newArr;
	}
}
