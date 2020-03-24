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
	selector: 'app-modify-category',
	templateUrl: './modify-category.component.html',
	styleUrls: ['./modify-category.component.css']
})
export class ModifyCategoryComponent implements OnInit {

	value: { _id: any; };
	industryArray=[];
	industryIdd:any;
	priceListForm: FormGroup;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	id;

	constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService, private router: ActivatedRoute) { }

	ngOnInit() {

		this.value = { _id: this.router.snapshot.params['id'] }

		this.priceListForm = this.fb.group({
			"category": ['', Validators.required],
			"industry": ['', Validators.required],
		})

		this.setupService.getOneCategoryList(this.value).subscribe(res => {
			this.industry.setValue(res[0].industryId.name);
			this.industryIdd=res[0].industryId._id;
			this.category.setValue(res[0].name);
			this.id = res[0]._id;
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
	get category() {
		return this.priceListForm.controls.category
	}
	get industry() {
		return this.priceListForm.controls.industry
	}
	submit(formValues) {
		formValues._id = this.id;
		formValues.industryIdd=this.industryIdd;
		this.setupService.updateCategory(formValues).subscribe(res => {
			this.successMsg = "Category List is modified.";
			this.showSuccess();
		}, err => {
			if (err.err.status == "502") {
				this.errorMsg = "Category Already Exist";
				this.showError();
			} else {
				this.errorMsg = "Some Error Occured";
				this.showError();
			}
		})
	}
	changeIndustry(x){
		this.industryIdd=x._id;
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