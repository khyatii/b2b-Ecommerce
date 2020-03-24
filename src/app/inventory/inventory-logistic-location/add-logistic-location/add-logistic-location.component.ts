import { Component, OnInit } from '@angular/core';
import { AppError } from '../../../apperrors/apperror';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { SignupUser } from '../../../signup-user/signup-user.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { Observable } from 'rxjs/Observable';
import { SetupService } from '../../../services/setup.service';

@Component({
  selector: 'app-add-logistic-location',
  templateUrl: './add-logistic-location.component.html',
  styleUrls: ['./add-logistic-location.component.css']
})
export class AddLogisticLocationComponent implements OnInit {
  logisticsHeading;
  logisticsType;
  countryCode: any;
  countryArray: any;
  locationForm: FormGroup;
  isShow = false;
  citiesArray: any;
  ServicesCategories = [];
  logisticTypeArray = [];
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;


  constructor(private fb: FormBuilder, private route: Router, private userService: UserService,
    private inventoryService: InventoryService, private signupUser: SignupUser, private setupService: SetupService,
    private userLogisticsService: UserLogisticsService) { }

  ngOnInit() {
    this.locationForm = this.fb.group({
      "serviceType": ['', Validators.required],
      "txtLocationType": ['', Validators.required],
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtGeoLocation": ['', Validators.required],
      "txtStatus": ['', Validators.required],
      "txtOwnership": ['', Validators.required],
      "txtDescription": ['', Validators.required],
      "logistics_type": ['', Validators.required],
      "storageLocation": ['',],
      "packageType": ['',],
      "dimensions": ['',],
      "ratePerUnit": ['',],
      "txtCapacity": ['',],
      "destinationsTransport": ['',],
      "destinationsClearing": ['',],
      "transportServices": ['',],
      "clearingServices": ['',],
      "townsCovered": ['',],
      "insuranceServices": ['',],
    })
    this.setupService.getLogisticTypes().subscribe(res => {
      this.logisticTypeArray = res[0].logistics_type;
    })
    this.signupUser.getCountry().subscribe(
      res => {
        res = res.json()
        this.countryArray = res;
        this.filteredOptions = this.txtCountry.valueChanges
          .startWith(null)
          .map(val => val ? this.filter(val) : this.countryArray.slice());
      }
    )
    this.userService.getLogisticData().subscribe(res => {
      if (res[0].logistics_type_multiple === true) {
        this.logisticsHeading = 'Multiple Logistics'
      } else {
        this.logisticsHeading = res[0].logistics_type
      }
    })
    this.userLogisticsService.getServicesCategories().subscribe(res => {
      this.ServicesCategories = res[0].type;
    })
  }
  logisticChange(e) {
    this.logisticsType = e.value;
    // var logistic_type = { logistic_type: e.value };
    // this.userLogisticsService.getServicesCategoryByType(logistic_type).subscribe(res => {
    //   this.ServicesCategories = res[0].type;
    // }) 
  }
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }
  get logistics_type() {
    return this.locationForm.controls.logistics_type
  }
  get serviceType() {
    return this.locationForm.controls.serviceType
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
  get txtCapacity() {
    return this.locationForm.controls.txtCapacity
  }
  get storageLocation() {
    return this.locationForm.controls.storageLocation
  }

  get packageType() {
    return this.locationForm.controls.packageType
  }
  get dimensions() {
    return this.locationForm.controls.dimensions
  }
  get ratePerUnit() {
    return this.locationForm.controls.ratePerUnit
  }

  get destinationsTransport() {
    return this.locationForm.controls.destinationsTransport
  }
  get destinationsClearing() {
    return this.locationForm.controls.destinationsClearing
  }
  get transportServices() {
    return this.locationForm.controls.transportServices
  }
  get clearingServices() {
    return this.locationForm.controls.clearingServices
  }
  get townsCovered() {
    return this.locationForm.controls.townsCovered
  }
  get insuranceServices() {
    return this.locationForm.controls.insuranceServices
  }



  submit(formValues) {
    formValues.countryCode = this.countryCode;
    this.isShow = true;
    this.inventoryService.addWarehouseLocation(formValues).subscribe(res => {
      setTimeout(function () {
        this.isShow = false;
        this.route.navigate(['/logistic/inventory/manage-logistic-inventory'])
      }.bind(this), 2000);
    },
      err => {
        if (err instanceof AppError) {

        }
      })
  }

  countryChanged(country) {
    this.signupUser.getCites(country).subscribe(res => {
      this.citiesArray = res;
      this.filteredCity = this.txtTown.valueChanges
        .startWith(null)
        .map(val => val ? this.filtercity(val) : this.citiesArray.slice());
    });
    this.countryCode = country.code;
  }
  filtercity(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.citiesArray.filter
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
}
