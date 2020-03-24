import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
	selector: 'app-add-category',
	templateUrl: './add-category.component.html',
	styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

	categoryForm: FormGroup;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	industryArray = [];

	constructor(private spinnerService: Ng4LoadingSpinnerService,private fb: FormBuilder, private route: Router, private setupService: SetupService) { }

	ngOnInit() {
		this.categoryForm = this.fb.group({
			"industry": ['', Validators.required],
			"category": ['', Validators.required],
		})

		this.setupService.getIndustry().subscribe(res => {
			this.industryArray = res;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

	filter(val: string): string[] {
		return this.industryArray.filter(option =>
			option.toLowerCase().indexOf(val.toLowerCase()) === 0);
	}
	get industry() {
		return this.categoryForm.controls.industry
	}
	get category() {
		return this.categoryForm.controls.category
	}

	submit(formValues) {
		this.spinnerService.show()
		this.setupService.addNewCategoryList(formValues).subscribe(res => {
			this.successMsg = "Category List is added.";
			this.showSuccess();
			this.spinnerService.hide()
		}, err => {
			if (err.err.status == "502") {
				this.errorMsg = "Category Already Exist";
				this.showError();
				this.spinnerService.hide()

			} else {
				this.errorMsg = "Some Error Occured";
				this.showError();
				this.spinnerService.hide()

			}
		})
	}

	showSuccess() {
		window.scrollTo(500, 0);
		this.isSuccess = false;
		setTimeout(() => {
			this.route.navigate(['/app/setup/category'])
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