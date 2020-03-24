import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupUser } from '../../signup-user/signup-user.service';
import { UserLogisticsService } from '../../services/userLogistics.Service';

@Component({
  selector: 'app-addwarehouse',
  templateUrl: './addwarehouse.component.html',
  styleUrls: ['./addwarehouse.component.css']
})
export class AddwarehouseComponent implements OnInit {
  warehouseArray: any;
  countryCode: any;
  citiesArray: any;
  countryArray: any;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  warehouseForm: FormGroup;
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;
  ServicesCategories = []
  serviceNames = [];

  constructor(private fb: FormBuilder, private route: Router, private signupUser: SignupUser,
    private logisticsService: LogisticsService, private userLogisticsService: UserLogisticsService) { }

  ngOnInit() {
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());

    })

    this.warehouseForm = this.fb.group({
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtWarehouse": ['', Validators.required],
      "txtPriority": ['', Validators.required],
      "txtShareTransportServiceDetails": ['', Validators.required],
      "txtShareConsignmentDetails": ['', Validators.required],
      "serviceType": ['', Validators.required],
      "serviceName": ['', Validators.required]
    })

  }
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  getServies(type) {
    var id = { _id: type._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }

  get txtCountry() {
    return this.warehouseForm.controls.txtCountry
  }
  get txtTown() {
    return this.warehouseForm.controls.txtTown
  }
  get txtWarehouse() {
    return this.warehouseForm.controls.txtWarehouse
  }
  get txtPriority() {
    return this.warehouseForm.controls.txtPriority
  }
  get txtShareTransportServiceDetails() {
    return this.warehouseForm.controls.txtShareTransportServiceDetails
  }
  get txtShareConsignmentDetails() {
    return this.warehouseForm.controls.txtShareConsignmentDetails
  }
  get serviceType() {
    return this.warehouseForm.controls.serviceType
  }
  get serviceName() {
    return this.warehouseForm.controls.serviceName
  }

  submit(formValues) {
    formValues.txtCountryCode = this.countryCode;
    formValues.txtWarehouseName = formValues.txtWarehouse.company_name;
    formValues.txtWarehouse = formValues.txtWarehouse._id;
    this.logisticsService.postWarehouseManagement(formValues).subscribe(res => {
      this.isLoading = false;
      this.successMsg = "Warehouse is added."
      this.showSuccess();
      setTimeout(() => {
        this.route.navigate(['/app/logistics/warehouse'])
      }, 3000)
    }, err => {
      if (err.err.status == "502") {
        // this.errorMsg = "Warehouse Priority with County & Town Already Exists";
        this.errorMsg = "Warehouse Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
      this.isLoading = false;
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
    var warehouse = { warehousecountry: country.code }
    this.logisticsService.getWarehouseCountry(warehouse).subscribe(res => {
      this.warehouseArray = res.data;
    })
  }
  filtercity(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.citiesArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }
  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
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
