
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputOutputService } from '../../../services/inputOutput.service';
import { InventoryService } from '../../../services/inventory.service';
import { AppError } from '../../../apperrors/apperror';
import { SignupUser } from '../../../signup-user/signup-user.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-modify-location',
	templateUrl: './modify-location.component.html',
	styleUrls: ['./modify-location.component.css']
})
export class ModifyLocationComponent implements OnInit {
	isShow: boolean;
	locationForm: FormGroup;
	value: { _id: any; };
	countryCode: any;
	countryArray: any;
	citiesArray: any;
	filteredOptions: Observable<string[]>;
	filteredCity: Observable<string[]>;


	constructor(private fb: FormBuilder, private route: Router, private router: ActivatedRoute, private inputOutputService: InputOutputService
		, private inventoryService: InventoryService, private signupUser: SignupUser) { }

	ngOnInit() {
		this.value = { _id: this.router.snapshot.params['id'] }
		this.signupUser.getCountry().subscribe(res => {
			res = res.json();
			this.countryArray = res;
			this.filteredOptions = this.txtCountry.valueChanges
				.startWith(null)
				.map(val => val ? this.filter(val) : this.countryArray.slice());
		})


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

		this.inventoryService.getOneInventory(this.value).subscribe(
			resp => {
				this.txtLocationName.setValue(resp[0].locationName);
				this.txtDescription.setValue(resp[0].description);
				this.txtLocationType.setValue(resp[0].branch);
				this.txtGeoLocation.setValue(resp[0].geoLocation);
				this.txtStatus.setValue(resp[0].status);
				this.txtOwnership.setValue(resp[0].ownershipType);
				this.txtSize.setValue(resp[0].size);
				this.txtCountry.setValue(resp[0].country);
				this.txtTown.setValue(resp[0].townName);
				// this.countryName = resp[0].countryCode;
				// var countryy = {
				// 	code: resp[0].countryCode
				// }
				// this.signupUser.getCites(countryy).subscribe(res => {
				// 	this.citiesArray = res;
				// 	this.txtTown.setValue(res[0].name);
				// })
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
	get txtGeoLocation() {
		return this.locationForm.controls.txtGeoLocation
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

	submit(formValues) {
		formValues._id = this.value;
		formValues.countryCode = this.countryCode;
		this.isShow = true;

		this.inventoryService.modifyLocation(formValues).subscribe(res => {
			setTimeout(function () {
				this.isShow = false;
				this.route.navigate(['/app/inventory/manage-inventory'])
			}.bind(this), 2000);
		}, (err) => {
			if (err instanceof AppError) { }
		})


	}
}
