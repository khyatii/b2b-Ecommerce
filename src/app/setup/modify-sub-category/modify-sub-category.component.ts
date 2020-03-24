import { ConfigurationService } from './../../services/configuration.service';
import { CustomerService } from './../../services/customer.service';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { AppError } from '../../apperrors/apperror';

@Component({
	selector: 'app-modify-sub-category',
	templateUrl: './modify-sub-category.component.html',
	styleUrls: ['./modify-sub-category.component.css']
})
export class ModifySubCategoryComponent implements OnInit {

	value: { _id: any; };
	productArray: any = [];
	industryArray = [];
	catArray = [];
	industryIdd: any;
	categoryIdd: any;
	priceListForm: FormGroup;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	id;

	constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService,
		private router: ActivatedRoute) { }

	ngOnInit() {

		this.value = { _id: this.router.snapshot.params['id'] }
		this.priceListForm = this.fb.group({
			"industry": ['', Validators.required],
			"category": ['', Validators.required],
			"subcategory": ['', Validators.required],
		})
		this.setupService.getSubCategoryList().subscribe(res1 => {
			this.productArray = res1;
		})
		this.setupService.getOneSubCategoryList(this.value).subscribe(res => {
			this.industry.setValue(res[0].industryId.name);
			this.industryIdd = res[0].industryId._id;
			this.category.setValue(res[0].categoryId.name);
			this.categoryIdd = res[0].categoryId._id;
			this.subcategory.setValue(res[0].name);
			this.id = res[0]._id;

			let data = {
				industryId: res[0].industryId._id
			}
			this.setupService.getCategories(data).subscribe(resp => {
				this.catArray = resp;
			})

		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
		this.setupService.getIndustry().subscribe(res => {
			this.industryArray = res;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	get industry() {
		return this.priceListForm.controls.industry
	}
	get category() {
		return this.priceListForm.controls.category
	}
	get subcategory() {
		return this.priceListForm.controls.subcategory
	}

	submit(formValues) {
		formValues._id = this.id;
		formValues.industryIdd = this.industryIdd;
		formValues.categoryIdd = this.categoryIdd;
		this.setupService.updateSubCategory(formValues).subscribe(res => {
			this.successMsg = "Sub Category List is modified.";
			this.showSuccess();
		}, err => {
			if (err.err.status == "502") {
				this.errorMsg = "Sub Category Already Exist";
				this.showError();
			} else {
				this.errorMsg = "Some Error Occured";
				this.showError();
			}
		})
	}
	changeIndustry(x) {
		this.industryIdd = x._id;
		let data = {
			industryId: x._id
		}
		this.setupService.getCategories(data).subscribe(res => {
			this.catArray = res;
		})
	}
	changeCategory(x) {
		this.categoryIdd = x._id;
	}
	showSuccess() {
		window.scrollTo(500, 0);
		this.isSuccess = false;
		setTimeout(() => {
			this.route.navigate(['/app/setup/subCategory'])
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