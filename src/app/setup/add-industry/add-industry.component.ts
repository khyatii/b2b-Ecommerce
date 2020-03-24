import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SetupService } from '../../services/setup.service';

@Component({
	selector: 'app-add-industry',
	templateUrl: './add-industry.component.html',
	styleUrls: ['./add-industry.component.css']
})
export class AddIndustryComponent implements OnInit {

	industryForm: FormGroup;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;

	constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService) { }

	ngOnInit() {
		this.industryForm = this.fb.group({
			"industry": ['', Validators.required]
		})
	}
	get industry() {
		return this.industryForm.controls.industry
	}

	submit(formValues) {
		this.setupService.addNewIndustry(formValues).subscribe(res => {
			this.successMsg = "Industry List is added.";
			this.showSuccess();
		}, err => {
			if (err.err.status == "502") {
				this.errorMsg = "Industry Already Exist";
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
			this.isSuccess = true;
			this.route.navigate(['/app/setup/industry'])
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