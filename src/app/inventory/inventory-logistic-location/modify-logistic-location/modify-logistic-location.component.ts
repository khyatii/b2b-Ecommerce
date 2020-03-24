import { Component, OnInit } from '@angular/core';
import { AppError } from '../../../apperrors/apperror';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignupUser } from '../../../signup-user/signup-user.service';
import { UserService } from '../../../services/user.service';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { Observable } from 'rxjs/Observable';
import { SetupService } from '../../../services/setup.service';

@Component({
  selector: 'app-modify-logistic-location',
  templateUrl: './modify-logistic-location.component.html',
  styleUrls: ['./modify-logistic-location.component.css']
})
export class ModifyLogisticLocationComponent implements OnInit {
  logisticsHeading;
  logisticsType;
  isShow: boolean;
  locationForm: FormGroup;
  value: { _id: any; };
  countryCode: any;
  countryArray: any
  citiesArray: any;
  ServicesCategories = [];
  logisticTypeArray = [];
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;

  constructor(private fb: FormBuilder,
    private router: ActivatedRoute,
    private userService: UserService,
    private inventoryService: InventoryService,
    private signupUser: SignupUser,
    private route: Router,
    private userLogisticsService: UserLogisticsService,
    private setupService: SetupService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })
    this.setupService.getLogisticTypes().subscribe(res => {
      this.logisticTypeArray = res[0].logistics_type;
    })
    this.userLogisticsService.getServicesCategories().subscribe(res => {
      this.ServicesCategories = res[0].type;
    })
    this.userService.getLogisticData().subscribe(res => {
      if (res[0].logistics_type_multiple === true) {
        this.logisticsHeading = 'Multiple Logistics'
      } else {
        this.logisticsHeading = res[0].logistics_type
      }
    })
    this.locationForm = this.fb.group({
      // "txtLocationName": ['', Validators.required],
      "serviceType": ['', Validators.required],
      "txtLocationType": ['', Validators.required],
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtGeoLocation": ['', Validators.required],
      "txtStatus": ['', Validators.required],
      "txtOwnership": ['', Validators.required],
      "logistics_type": ['', Validators.required],
      "txtDescription": ['', Validators.required],

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
      // "storageLocation": ['', Validators.required],
      // "txtCapacity": ['', Validators.required],
      // "destinationsTransport": ['', Validators.required],
      // "destinationsClearing": ['', Validators.required],
      // "transportServices": ['', Validators.required],
      // "clearingServices": ['', Validators.required],
      // "townsCovered":['', Validators.required],
      // "insuranceServices":['', Validators.required],
    })

    this.inventoryService.getLogisticsInventory(this.value).subscribe(
      resp => {
        // this.txtLocationName.setValue(resp[0].locationName);
        this.serviceType.setValue(resp[0].serviceType);
        this.logistics_type.setValue(resp[0].logistics_type);
        this.packageType.setValue(resp[0].packageType);
        this.dimensions.setValue(resp[0].dimensions);
        this.ratePerUnit.setValue(resp[0].ratePerUnit);
        this.txtDescription.setValue(resp[0].description);
        this.txtLocationType.setValue(resp[0].branch);
        this.txtGeoLocation.setValue(resp[0].geoLocation);
        this.txtStatus.setValue(resp[0].status);
        this.txtOwnership.setValue(resp[0].ownershipType);
        this.txtCapacity.setValue(resp[0].capacity);
        this.storageLocation.setValue(resp[0].storageLocation);
        this.txtTown.setValue(resp[0].townName);
        this.txtCountry.setValue(resp[0].country);
        this.logisticsType = resp[0].logistics_type;

        if (this.logisticsType == 'Warehouse') {
          this.packageType.setValue(resp[0].packageType);
          this.dimensions.setValue(resp[0].dimensions);
          this.ratePerUnit.setValue(resp[0].ratePerUnit);
          this.txtCapacity.setValue(resp[0].capacity);
        }
        if (this.logisticsType == 'Transport') {
          this.destinationsTransport.setValue(resp[0].destinationsTransport);
          this.transportServices.setValue(resp[0].transportServices);
        }
        if (this.logisticsType == 'Clearing') {
          this.clearingServices.setValue(resp[0].clearingServices);
          this.destinationsClearing.setValue(resp[0].destinationsClearing);
        }
        if (this.logisticsType == 'Insurance') {
          this.townsCovered.setValue(resp[0].townsCovered);
          this.insuranceServices.setValue(resp[0].insuranceServices);
        }

      })
  }
  logisticChange(e) {
    this.logisticsType = e.value;
  }

  // get txtLocationName() {
  //   return this.locationForm.controls.txtLocationName
  // }
  get logistics_type() {
    return this.locationForm.controls.logistics_type
  }
  get serviceType() {
    return this.locationForm.controls.serviceType
  }
  get txtDescription() {
    return this.locationForm.controls.txtDescription
  }
  get txtOwnership() {
    return this.locationForm.controls.txtOwnership
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
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
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
  submit(formValues) {
    formValues.countryCode = this.countryCode;
    formValues._id = this.value;
    this.isShow = true;

    this.inventoryService.modifyLogiticLocation(formValues).subscribe(res => {
      setTimeout(function () {
        this.isShow = false;
        this.route.navigate(['/logistic/inventory/manage-logistic-inventory'])
      }.bind(this), 2000);
    },
      (err) => {
        if (err instanceof AppError) { }
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
