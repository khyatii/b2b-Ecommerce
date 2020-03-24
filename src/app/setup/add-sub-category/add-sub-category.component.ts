import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../services/setup.service';

@Component({
	selector: 'app-add-sub-category',
	templateUrl: './add-sub-category.component.html',
	styleUrls: ['./add-sub-category.component.css']
})
export class AddSubCategoryComponent implements OnInit {

	categoryForm: FormGroup;
	filteredOptions: Observable<string[]>;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	catArray = [];
	industryArray = [];

	constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService, ) { }

	ngOnInit() {
		this.categoryForm = this.fb.group({
			"industry": ['', Validators.required],
			"category": ['', Validators.required],
			"subcategory": ['', Validators.required]
		})

		this.filteredOptions = this.industry.valueChanges
			.startWith(null)
			.map(val => val ? this.filterIndustry(val) : this.industryArray.slice());

		this.filteredOptions = this.category.valueChanges
			.startWith(null)
			.map(val => val ? this.filter(val) : this.catArray.slice());

		this.setupService.getIndustry().subscribe(res => {
			this.industryArray = res;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	filterIndustry(val: string): string[] {
		return this.industryArray.filter(option =>
			option.toLowerCase().indexOf(val.toLowerCase()) === 0);
	}

	filter(val: string): string[] {
		return this.catArray.filter(option =>
			option.toLowerCase().indexOf(val.toLowerCase()) === 0);
	}

	getCategories(val) {
		let data = {
			industryId: val.value
		}
		this.setupService.getCategories(data).subscribe(res => {
			this.catArray = res;
		})
	}

	get industry() {
		return this.categoryForm.controls.industry
	}
	get category() {
		return this.categoryForm.controls.category
	}
	get subcategory() {
		return this.categoryForm.controls.subcategory
	}

	submit(formValues) {
		this.setupService.addNewSubCategoryList(formValues).subscribe(res => {
			this.successMsg = "Sub Category List is added.";
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
