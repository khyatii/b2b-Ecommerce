import { EmailValidation } from './../../validators/emailValid';
import { Observable } from 'rxjs';
import { AppError } from './../../apperrors/apperror';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyDetailService } from '../../services/company-details.services';
import { SignupUser } from '../../signup-user/signup-user.service';

@Component({
	selector: 'app-company-overview-logistics',
	templateUrl: './company-overview-logistics.component.html',
	styleUrls: ['./company-overview-logistics.component.scss']
})
export class CompanyOverviewLogisticsComponent implements OnInit {

	companyOverviewForm: FormGroup;
	isShow: boolean = true;
	countryArray: any;
	filteredOptions: Observable<string[]>;

	constructor(private fb: FormBuilder, private signupUser: SignupUser,
		private companyDetailService: CompanyDetailService) { }

	ngOnInit() {
		this.companyOverviewForm = this.fb.group({
			"txtCompanyName": ['', Validators.required],
			"txtWebsite": [''],
			"role": ['', Validators.required],
			"txtCountry": ['', Validators.required],
			"txtEmail": [{ value: '', disabled: true }, [Validators.required, EmailValidation.emailValid]],
			"txtMobile": ['', Validators.required]
		})

		this.companyDetailService.getCompanyDetailsLogistics().subscribe(res => {
			if (res[0].website != undefined) {
				this.txtWebsite.setValue(res[0].website);
			}
			this.txtCompanyName.setValue(res[0].company_name);
			this.role.setValue(res[0].role);
			this.txtEmail.setValue(res[0].email);
			this.txtMobile.setValue(res[0].phone_number);
			this.txtCountry.setValue(res[0].country_name);
		})
		this.signupUser.getCountry().subscribe(res => {
			res = res.json();
			this.countryArray = res;
			this.filteredOptions = this.txtCountry.valueChanges
				.startWith(null)
				.map(val => val ? this.filter(val) : this.countryArray.slice());
		})
	}
	submit(formValues) {
		this.isShow = true;
		this.companyDetailService.saveCompanyDetailsLogistics(formValues).subscribe(res => {
			this.isShow = false;
			setTimeout(function () {
				this.isShow = true;
			}.bind(this), 2000);
		}, (err) => {
			if (err instanceof AppError) { }
		})


	}
	filter(val: string): string[] {
		const filterValue = val.toLowerCase();
		return this.countryArray.filter
			(function (Product) {
				return Product.name.toLowerCase().includes(filterValue);
			})
	}
	keyPress(evt: any) {
		evt = (evt) ? evt : window.event;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}
	get txtCompanyName() {
		return this.companyOverviewForm.controls.txtCompanyName
	}
	get role() {
		return this.companyOverviewForm.controls.role
	}
	get txtEmail() {
		return this.companyOverviewForm.controls.txtEmail
	}
	get txtMobile() {
		return this.companyOverviewForm.controls.txtMobile
	}
	get txtCountry() {
		return this.companyOverviewForm.controls.txtCountry
	}
	get txtWebsite() {
		return this.companyOverviewForm.controls.txtWebsite
	}
}

