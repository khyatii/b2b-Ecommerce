import { SignupUser } from './../../signup-user/signup-user.service';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogisticsService } from '../../services/userLogistics.Service';

@Component({
  selector: 'app-add-transport',
  templateUrl: './add-transport.component.html',
  styleUrls: ['./add-transport.component.css']
})
export class AddTransportComponent implements OnInit {
  transportArray: any;

  transportForm: FormGroup;
  countryCode: any;
  citiesArray: any;
  countryArray: any;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;
  ServicesCategories = []
  serviceNames = [];

  constructor(private fb: FormBuilder, private route: Router, private userLogisticsService: UserLogisticsService,
    private logisticsService: LogisticsService, private signupUser: SignupUser) { }

  ngOnInit() {
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })
    this.transportForm = this.fb.group({
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtTransporter": ['', Validators.required],
      "txtPriority": ['', Validators.required],
      "txtShareWarehouseServiceDetails": ['', Validators.required],
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

  get txtCountry() {
    return this.transportForm.controls.txtCountry
  }
  get txtTown() {
    return this.transportForm.controls.txtTown
  }
  get txtTransporter() {
    return this.transportForm.controls.txtTransporter
  }
  get txtPriority() {
    return this.transportForm.controls.txtPriority
  }
  get txtShareWarehouseServiceDetails() {
    return this.transportForm.controls.txtShareWarehouseServiceDetails
  }
  get txtShareConsignmentDetails() {
    return this.transportForm.controls.txtShareConsignmentDetails
  }
  get serviceType() {
    return this.transportForm.controls.serviceType
  }
  get serviceName() {
    return this.transportForm.controls.serviceName
  }
  getServies(type) {
    var id = { _id: type._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }

  submit(formValues) {
    formValues.txtTransporterName = formValues.txtTransporter.company_name;
    formValues.txtTransporter = formValues.txtTransporter._id;
    this.isLoading = true;
    formValues.txtCountryCode = this.countryCode;

    this.logisticsService.postTransportManagement(formValues).subscribe(res => {
      this.successMsg = "Transport is added."
      this.showSuccess();
      this.isLoading = false;
      setTimeout(() => {
        this.route.navigate(['/app/logistics/transportmanagement'])
      }, 3000)
    }), (err) => {
      if (err.err.status == "502") {
        this.errorMsg = "Transport Already Exists";
        this.showError();
        this.isLoading = false;
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
      }
      // this.isLoading = false;
    }
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
    this.logisticsService.getTransportCountry(warehouse).subscribe(res => {
      this.transportArray = res;
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
