import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SetupService } from '../../services/setup.service';

@Component({
	selector: 'app-modify-industry',
	templateUrl: './modify-industry.component.html',
	styleUrls: ['./modify-industry.component.css']
})
export class ModifyIndustryComponent implements OnInit {

	value: { _id: any; };
	industryForm: FormGroup;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	id;

	constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService,
		private router: ActivatedRoute) { }

	ngOnInit() {
		this.value = { _id: this.router.snapshot.params['id'] }
		this.industryForm = this.fb.group({
			"industry": ['', Validators.required],
			// "description": [''],
		})
		this.setupService.getOneIndustry(this.value).subscribe(res => {
			this.industry.setValue(res[0].name);
			this.id = res[0]._id;
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}
	get industry() {
		return this.industryForm.controls.industry
	}

	submit(formValues) {
		formValues._id = this.id;
		this.setupService.updateIndustry(formValues).subscribe(res => {
			this.successMsg = "Industry List is modified.";
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
			this.route.navigate(['/app/setup/industry'])
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