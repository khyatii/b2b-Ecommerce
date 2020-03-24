
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputOutputService } from '../../../services/inputOutput.service';
import { InventoryService } from '../../../services/inventory.service';
import { AppError } from '../../../apperrors/apperror';
import { SignupUser } from '../../../signup-user/signup-user.service';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { IS_STEPPER } from '../../../store/action';


@Component({
	selector: 'app-add-location',
	templateUrl: './add-location.component.html',
	styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {
	@ViewChild('ccity') ccity: any;
	@Output() notify: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	countryCode: any;
	countryArray: any;
	locationForm: FormGroup;
	isShow = false;
	citiesArray: any;
	isbystepper: boolean = false;
	filteredOptions: Observable<string[]>;
	filteredCity: Observable<string[]>;
	@select() isStepper: Observable<boolean>;

	constructor(private fb: FormBuilder, private route: Router, private inputOutputService: InputOutputService,
		private inventoryService: InventoryService, private signupUser: SignupUser,
		private ngRedux: NgRedux<IAppState>) { }

	ngOnInit() {
		this.locationForm = this.fb.group({
			"txtLocationName": ['', Validators.required],
			"txtDescription": [''],
			"txtLocationType": ['', Validators.required],
			"txtTown": ['', Validators.required],
			"txtCountry": ['', Validators.required],
			"txtGeoLocation": [''],
			"txtStatus": ['', Validators.required],
			"txtOwnership": ['', Validators.required],
			"txtSize": ['', Validators.required],
		})
		this.signupUser.getCountry().subscribe(res => {
			res = res.json()
			this.countryArray = res;
			this.filteredOptions = this.txtCountry.valueChanges
				.startWith(null)
				.map(val => val ? this.filter(val) : this.countryArray.slice());

		})
		this.isStepper.subscribe(res => {
			this.isbystepper = res;
		})
	}
	filter(val: string): string[] {
		const filterValue = val.toLowerCase();
		return this.countryArray.filter
			(function (Product) {
				return Product.name.toLowerCase().includes(filterValue);
			})
	}

	get txtLocationName() {
		return this.locationForm.controls.txtLocationName
	}
	get txtDescription() {
		return this.locationForm.controls.txtDescription
	}
	get txtLocationType() {
		return this.locationForm.controls.txtLocationType
	}
	get txtTown() {
		return this.locationForm.controls.txtTown
	}
	get txtCountry() {
		return this.locationForm.controls.txtCountry
	}
	get txtStatus() {
		return this.locationForm.controls.txtStatus
	}
	get txtOwnership() {
		return this.locationForm.controls.txtOwnership
	}
	get txtSize() {
		return this.locationForm.controls.txtSize
	}

	submit(formValues) {
		formValues.countryCode = this.countryCode
		this.isShow = true;
		this.inventoryService.addLocation(formValues).subscribe(res => {
		}, err => { })

		if (!this.isbystepper) {
			setTimeout(function () {
				this.isShow = false;
				this.route.navigate(['/app/inventory/manage-inventory'])
			}.bind(this), 2000);
		} else {
			setTimeout(function () {
				this.isShow = false;
				this.notify.emit(this.locationForm)
			}.bind(this), 2000);
		}

	}

	countryChanged(country) {
		this.signupUser.getCites(country).subscribe(res => {
			this.citiesArray = res;
			this.filteredCity = this.txtTown.valueChanges
				.startWith(null)
				.map(val => val ? this.filtercity(val) : this.citiesArray.slice());
			this.countryCode = country.code;
		});
	}
	filtercity(val: string): string[] {
		const filterValue = val.toLowerCase();
		return this.citiesArray.filter
			(function (Product) {
				return Product.name.toLowerCase().includes(filterValue);
			})
	}

	setCountry() {
		this.ccity.nativeElement.value = "";
	}


}
