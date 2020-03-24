import { CompanyDetailService } from './../../../services/company-details.services';
import { LogisticsService } from './../../../services/logistics.service';
import { ConfigurationService } from './../../../services/configuration.service';
import { Component, OnInit, ElementRef, style } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { InputOutputService } from '../../../services/inputOutput.service';
import { InventoryService } from "../../../services/inventory.service";
import { SetupService } from '../../../services/setup.service';

// const URL = 'http://localhost:8000/users/updateProfile';
const URL = 'http://13.127.188.236:8000/users/updateProfile';
@Component({
	selector: 'app-modify-product',
	templateUrl: './modify-product.component.html',
	styleUrls: ['./modify-product.component.css']
})
export class ModifyProductComponent implements OnInit {
	productApproval: any;
	category: any;
	respLength: any;
	docUploaded: FormData;
	docArray: any;
	fetchDocArray: any;
	warehouseArray: any;
	imageArray: any;
	defaultImageName: any;
	defaultImg: any;
	inputStockOnHand: any;
	inputStockAvaliable: any;
	categoryIdd: any;
	subCategoryIdd: any;
	valueIndustry: { industryId: any; };
	valueCategory: { categoryId: any; };
	productImage: any;
	imageUploaded: FormData;
	value: { _id: any; };
	_id: any;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	isLoading: boolean = false;
	currencyArray = [];
	industryArray = [];
	catArray = [];
	subcatArray = [];
	modifyProductForm: FormGroup;
	unitsArray = ['Kilogram', 'Nos', 'Pieces', 'Tons', 'Units', '20’ Container', '40’ Container', 'Bags',
		'Bag', 'Barrel', 'Barrels', 'Bottles', 'Boxes', 'Bushel', 'Bushels', 'Cartons', 'Dozen', 'Foot',
		'Gallon', 'Grams', 'Hectare', 'Kilometer', 'Kilowatt', 'Litre', 'Litres', 'Long Ton', 'Meter',
		'Metric Ton', 'Metric Tons', 'Ounce', 'Packets', 'Pack', 'Packs', 'Piece', 'Pounds', 'Reams',
		'Rolls', 'Sets', 'Sheets', 'Short Ton', 'Square Feet', 'Square Metres', 'Watt'
	];
	subCategoryArray;
	categoryArray;
	filterOptionSubCategory;
	filterOption;
	filteredOptions: Observable<string[]>;

	constructor(private fb: FormBuilder, private route: Router, private router: ActivatedRoute,
		private inputOutputService: InputOutputService, private setupService: SetupService,
		private inventoryService: InventoryService, private el: ElementRef,
		private configurationService: ConfigurationService, ) { }

	public uploader: FileUploader = new FileUploader({ url: URL, authToken: localStorage.getItem('token'), itemAlias: 'avatar' });

	ngOnInit() {
		// this.setupService.getProductApproval().subscribe(res => {
		// 	this.productApproval = res
		// })
		this.value = { _id: this.router.snapshot.params['id'] }

		//overide the onCompleteItem property of the uploader so we are 
		//able to deal with the server response.
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
		};
		this.modifyProductForm = this.fb.group({
			"productId": [''],
			"txtProductCode": ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)]],
			"txtModelCode": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
			"txtPartNo": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
			"txtSerialNo": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
			"txtProductName": ['', Validators.required],

			"industry": ['', Validators.required],
			"txtProductCategory": ['', Validators.required],
			"txtProductSubCategory": ['', Validators.required],

			"txtBrand": [''],
			"txtDescription": [''],
			"txtPrice": ['', Validators.required],
			"txtCurrency": ['', Validators.required],
			"txtQuantityPerUnitPrice": ['', Validators.required],
			"txtStorageLocation": ['', Validators.required],
			"txtSalesUnitOfMeasure": [''],
			"txtDocuments": [''],
			"txtStockOnHand": [{ value: '', disabled: true }],
			"txtStockAvailable": [{ value: '', disabled: true }],
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

		this.configurationService.getCurrency().subscribe(resp => {
			this.currencyArray = resp;
		})

		this.setupService.getIndustry().subscribe(res => {
			this.industryArray = res;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
		this.bindData();
	}

	closePopUp() {
		document.getElementById('modalAddProduct').style.display = 'none';
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
		return this.modifyProductForm.controls.txtProductCode
	}

	get productId() {
		return this.modifyProductForm.controls.productId
	}

	get txtModelCode() {
		return this.modifyProductForm.controls.txtModelCode
	}

	get txtPartNo() {
		return this.modifyProductForm.controls.txtPartNo
	}

	get txtSerialNo() {
		return this.modifyProductForm.controls.txtSerialNo
	}

	get txtProductName() {
		return this.modifyProductForm.controls.txtProductName
	}
	get industry() {
		return this.modifyProductForm.controls.industry
	}

	get txtProductCategory() {
		return this.modifyProductForm.controls.txtProductCategory
	}

	get txtProductSubCategory() {
		return this.modifyProductForm.controls.txtProductSubCategory
	}

	get txtDescription() {
		return this.modifyProductForm.controls.txtDescription
	}

	get txtBrand() {
		return this.modifyProductForm.controls.txtBrand
	}

	get txtPrice() {
		return this.modifyProductForm.controls.txtPrice
	}

	get txtCurrency() {
		return this.modifyProductForm.controls.txtCurrency
	}

	get txtQuantityPerUnitPrice() {
		return this.modifyProductForm.controls.txtQuantityPerUnitPrice
	}

	get txtStorageLocation() {
		return this.modifyProductForm.controls.txtStorageLocation
	}

	get txtSalesUnitOfMeasure() {
		return this.modifyProductForm.controls.txtSalesUnitOfMeasure
	}

	get txtDocuments() {
		return this.modifyProductForm.controls.txtDocuments
	}

	get txtStockOnHand() {
		return this.modifyProductForm.controls.txtStockOnHand
	}

	get txtStockAvailable() {
		return this.modifyProductForm.controls.txtStockAvailable
	}

	get txtStockReorderLevel() {
		return this.modifyProductForm.controls.txtStockReorderLevel
	}

	get txtProductVideoUrl() {
		return this.modifyProductForm.controls.txtProductVideoUrl
	}

	get txtPriceRules() {
		return this.modifyProductForm.controls.txtPriceRules
	}

	get txtSupplier() {
		return this.modifyProductForm.controls.txtSupplier
	}

	get txtMinimumOrderQuantity() {
		return this.modifyProductForm.controls.txtMinimumOrderQuantity
	}

	get txtItemSize() {
		return this.modifyProductForm.controls.txtItemSize;
	}

	get txtItemColor() {
		return this.modifyProductForm.controls.txtItemColor;
	}

	get txtItemWarranty() {
		return this.modifyProductForm.controls.txtItemWarranty;
	}


	get txtItemWeight() {
		return this.modifyProductForm.controls.txtItemWeight;
	}

	submit(formValues) {
		formValues._id = this.value;
		formValues.categoryIdd = this.categoryIdd;
		formValues.subCategoryIdd = this.subCategoryIdd;
		formValues.txtStockOnHand = this.inputStockOnHand;
		formValues.txtStockAvailable = this.inputStockAvaliable;
		var imageDone: any = false;
		var productDone: any = false;
		var docDone: any = false;
		this.isLoading = true;
		let fileCount: number = this.imageArray.length - this.respLength;
		this.imageUploaded = new FormData();
		if (fileCount > 0) {
			for (let i = 0; i < fileCount; i++) {
				if (this.imageArray[i + this.respLength].hasOwnProperty('createdAt') != true) {
					this.imageUploaded.append('photo', this.imageArray[i + this.respLength]);
				}
			}
		}
		else {
			this.imageUploaded = null;
		}
		//dOC uPLOAD
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

		// this.inputOutputService.broadcastObjectChange(formValues)

		this.inventoryService.modifyProduct(formValues).subscribe(res => {
			this.successMsg = "Product Updated Succesfully";
			this.showSuccess();
			this.isLoading = false;
			productDone = true;
			if (imageDone == true && productDone == true && docDone == true) {
				setTimeout(() => {
					this.route.navigateByUrl('/app/inventory/product');
				}, 2000)
			}
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
			this.isLoading = false;
		})

		if (this.imageUploaded != undefined || this.imageUploaded != null) {
			this.inventoryService.postImage(formValues._id._id, '', this.imageUploaded).subscribe(
				resp => {
					this.successMsg = "Image Updated Succesfully";
					this.showSuccess();
					this.isLoading = false;
					this.inventoryService.defaultImage({ _id: formValues._id._id, name: this.defaultImageName })
						.subscribe(res => {
							imageDone = true;
							if (imageDone == true && productDone == true && docDone == true) {
								setTimeout(() => {
									this.route.navigateByUrl('/app/inventory/product');
								}, 2000)
							}
						})
				}, error => {
					this.errorMsg = "Some Error Occured";
					this.showError();
					this.isLoading = false;
				})
		}
		else {
			this.inventoryService.defaultImage({ _id: formValues._id._id, name: this.defaultImageName })
				.subscribe(res => {
					imageDone = true;
					if (imageDone == true && productDone == true && docDone == true) {
						setTimeout(() => {
							this.route.navigateByUrl('/app/inventory/product');
						}, 2000)
					}
				})
		}

		if (this.docUploaded != undefined || this.docUploaded != null) {
			this.inventoryService.postDocs(formValues._id._id, this.docUploaded).subscribe(res => {
				docDone = true;
				if (imageDone == true && productDone == true && docDone == true) {
					setTimeout(() => {
						this.route.navigateByUrl('/app/inventory/product');
					}, 2000)
				}
			})
		}
		else {
			docDone = true;
			if (imageDone == true && productDone == true && docDone == true) {
				setTimeout(() => {
					this.route.navigateByUrl('/app/inventory/product');
				}, 2000)
			}
		}
	}

	getCategories(val) {
		let data = {
			industryId: val._id
		}
		this.setupService.getCategories(data).subscribe(res => {
			this.catArray = res;
		})
	}
	getSubCategories(val) {
		let data = {
			categoryId: val._id
		}
		this.setupService.getSubCategories(data).subscribe(res => {
			this.subcatArray = res;
		})
		this.categoryIdd = val._id;
	}
	changeSubCategory(x) {
		this.subCategoryIdd = x._id;
	}

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

	fileChange(event) {
		let fileList: FileList = event.target.files;
		var imageSource;
		if (fileList.length > 0) {
			let file: File = fileList[0];
			var img = (<HTMLInputElement>document.querySelector(".img"));
			var reader = new FileReader();
			reader.onload = (function () { return function (e) { imageSource = e.target.result; fileList[0]['path'] = imageSource }; })();
			reader.readAsDataURL(file);

		}
		let count = fileList.length;
		let imgArray = fileList[0];
		this.imageArray.push(imgArray);
		console.log("image array", this.imageArray);
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

	defaultImage(imgData, target, i) {
		this.defaultImg = imgData.path;
		this.defaultImageName = imgData.name

		let len = this.imageArray.length;
		for (let j = 0; j < len; j++) {
			this.imageArray[j].default = false;
			i.parentElement.parentElement.parentElement.getElementsByClassName('imgRef')[j].style.borderColor = "gainsboro";
			i.parentElement.parentElement.getElementsByClassName('default-check')[j].style.display = "none";
			i.parentElement.parentElement.parentElement.getElementsByClassName('default-delete')[j].style.display = "block";
		}

		imgData.default = true;
		i.style.display = "block";
		i.previousElementSibling.style.border = "2px solid green";
		i.nextElementSibling.style.display = 'none';
	}

	defaultImageInit(imgData, i) {
		this.defaultImg = imgData.path;
		this.defaultImageName = imgData.name

		let len = this.imageArray.length;
		for (let j = 0; j < len; j++) {
			// document.getElementsByClassName('imgRef')[j].setAttribute('style', 'border-color:gainsboro');
			document.getElementsByClassName('default-check')[j].setAttribute('style', 'display:none');
		}
		document.getElementsByClassName('default-check')[i].setAttribute('style', 'display:block');
		document.getElementsByClassName('default-delete')[i].setAttribute('style', 'display:none');
		document.getElementsByClassName('imgRef')[i].setAttribute('style', 'border: 2px solid green')
	}

	triggerFile(ref) {
		ref.click();
	}
	uploadDocument(fileRef) {
		fileRef.click();
	}
	clickTerms(terms) {
		terms.style.display = 'block';
	}

	closeOutside(terms) {
		terms.style.display = 'none';
	}
	docChange(e) {
		this.docArray = e.target.files;
	}

	deleteImage(imageId, i) {
		let productId = this.router.snapshot.params['id'];

		let currentImg = i.previousElementSibling.src;
		let index = this.imageArray.filter(function (v, i) {
			if (v['path'] != currentImg) {
				return v;
			}
		})
		this.imageArray = [];
		this.imageArray = index;

		let obj = {
			productId: productId,
			fileId: imageId
		}
		this.inventoryService.deleteModifiedImage(obj).subscribe(res => {
		})
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

	deleteFetchDoc(id) {
		let data = {
			fileId: id,
			productId: { _id: this.router.snapshot.params['id'] }
		}
		this.inventoryService.deleteDoc(data).subscribe(res => {
			this.bindData();
		})
	}

	bindData() {
		this.inventoryService.getOne(this.value).subscribe(
			resp => {
				this.imageArray = (resp[0].imageFile == null) ? 0 : resp[0].imageFile;
				let len = this.imageArray.length;
				this.respLength = len;
				setTimeout(() => {
					for (let i = 0; i < len; i++) {
						if (resp[0].imageFile[i].isdefault == true) {
							this.defaultImageInit(resp[0].imageFile[i], i)
						}
					}
				}, 1000);
				this.productId.setValue(resp[0].productId._id);
				this.txtProductCode.setValue(resp[0].txtProductCode);
				this.txtModelCode.setValue(resp[0].txtModelCode);
				this.txtPartNo.setValue(resp[0].txtPartNo);
				this.txtSerialNo.setValue(resp[0].txtSerialNo);
				this.txtProductName.setValue(resp[0].productId.txtProductName);
				this.industry.setValue(resp[0].productId.industry);
				this.txtBrand.setValue(resp[0].txtBrand);
				this.txtDescription.setValue(resp[0].txtDescription);
				this.txtPrice.setValue(resp[0].txtPrice);
				this.txtCurrency.setValue(resp[0].txtCurrency);
				this.txtQuantityPerUnitPrice.setValue(resp[0].txtQuantityPerUnitPrice);
				this.txtStorageLocation.setValue(resp[0].txtStorageLocation);
				this.txtSalesUnitOfMeasure.setValue(resp[0].txtSalesUnitOfMeasure);
				//this.txtDocuments.setValue(resp[0].txtDocuments);
				this.txtStockOnHand.setValue(resp[0].txtStockOnHand);
				this.txtStockAvailable.setValue(resp[0].txtStockAvailable);
				this.txtStockReorderLevel.setValue(resp[0].txtStockReorderLevel);
				this.txtProductVideoUrl.setValue(resp[0].txtProductVideoUrl);
				this.txtPriceRules.setValue(resp[0].txtPriceRules);
				this.txtSupplier.setValue(resp[0].txtSupplier);
				this.txtItemSize.setValue(resp[0].txtItemSize);
				this.txtItemColor.setValue(resp[0].txtItemColor);
				this.txtItemWarranty.setValue(resp[0].txtItemWarranty);
				this.txtItemWeight.setValue(resp[0].txtItemWeight);
				this.imageUploaded = resp[0].imageArray;
				this.fetchDocArray = resp[0].document;
				this.txtMinimumOrderQuantity.setValue(resp[0].txtMinimumOrderQuantity);

				this.inputStockAvaliable = resp[0].txtStockAvailable;
				this.inputStockOnHand = resp[0].txtStockOnHand;

				this.txtProductCategory.setValue(resp[0].productId.txtProductCategory.name);
				this.txtProductSubCategory.setValue(resp[0].productId.txtProductSubCategory.name);

				this.valueIndustry = { industryId: resp[0].productId.industry };
				this.inventoryService.getProductCategories(this.valueIndustry).subscribe(ress => {
					this.catArray = ress;
					this.categoryIdd = resp[0].productId.txtProductCategory._id;
				})

				this.valueCategory = { categoryId: resp[0].productId.txtProductCategory };
				this.inventoryService.getProductSubCategory(this.valueCategory).subscribe(ress => {
					this.subcatArray = ress;
					this.subCategoryIdd = resp[0].productId.txtProductSubCategory._id;
				})

				this.inventoryService.getLocation().subscribe(
					res => {
						this.warehouseArray = res;
					},
					(err) => {
						this.errorMsg = "Some Error Occured";
						this.showError();
					}
				)
			})
	}

}
