import { SignupUser } from './../../signup-user/signup-user.service';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogisticsService } from '../../services/userLogistics.Service';

@Component({
  selector: 'app-add-clearing',
  templateUrl: './add-clearing.component.html',
  styleUrls: ['./add-clearing.component.css']
})
export class AddClearingComponent implements OnInit {
  clearingArray: any;
  clearingForm: FormGroup;
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
  ServicesCategories=[]
  serviceNames=[];

  constructor(private fb: FormBuilder, private route: Router,private userLogisticsService:UserLogisticsService,
    private logisticsService: LogisticsService, private signupUser: SignupUser) { }

  ngOnInit() {
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.countryArray.slice());
    })
    this.clearingForm = this.fb.group({
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtClearingAgent": ['', Validators.required],
      "txtPriority": ['', Validators.required],
      "txtShareTransportServiceDetails": ['', Validators.required],
      "txtShareConsignmentDetails": ['', Validators.required],
      "txtShareWarehouseDetails": ['', Validators.required],
      "serviceType": ['', Validators.required],
      "serviceName": ['', Validators.required]
    })
    this.userLogisticsService.getServicesCategories().subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
		return this.countryArray.filter
      (function(Product) {
        return Product.name.toLowerCase().includes(filterValue);
    })
  }

  get txtCountry() {
    return this.clearingForm.controls.txtCountry
  }
  get txtTown() {
    return this.clearingForm.controls.txtTown
  }
  get txtClearingAgent() {
    return this.clearingForm.controls.txtClearingAgent
  }
  get txtPriority() {
    return this.clearingForm.controls.txtPriority
  }
  get txtShareTransportServiceDetails() {
    return this.clearingForm.controls.txtShareTransportServiceDetails
  }
  get txtShareConsignmentDetails() {
    return this.clearingForm.controls.txtShareConsignmentDetails
  }
  get txtShareWarehouseDetails() {
    return this.clearingForm.controls.txtShareWarehouseDetails
  }
  get serviceType() {
    return this.clearingForm.controls.serviceType
  }
  get serviceName() {
    return this.clearingForm.controls.serviceName
  }
  getServies(type){
    var id = { _id: type._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }

  submit(formValues) {
    formValues.txtClearingName = formValues.txtClearingAgent.company_name;
    formValues.txtClearingId = formValues.txtClearingAgent._id;
    formValues.txtCountryCode = this.countryCode;
    this.isLoading = true;
    this.logisticsService.postClearingManagement(formValues).subscribe(
      (res => {
        this.successMsg = "Clearing Agent is added."
        this.showSuccess();
        this.isLoading = false;
        setTimeout(() => {
          this.route.navigate(['/app/logistics/clearing'])
        }, 2000)
      }), (err) => {
        if (err.err.status == "502") {
          this.errorMsg = "Clearing Agent Already Exists";
          this.showError();
        } else {
          this.errorMsg = "Some Error Occured";
          this.showError();
        }
        this.isLoading = false;
      }
    )
  }

  countryChanged(country) {
    var warehouse={ warehousecountry:country.code }
    this.logisticsService.getClearingCountry(warehouse).subscribe(res => {
      this.clearingArray = res;
    })
    this.signupUser.getCites(country).subscribe(res => {
      this.citiesArray = res;
      this.filteredCity = this.txtTown.valueChanges
      .startWith(null)
      .map(val => val ? this.filtercity(val) : this.citiesArray.slice());
    });
    this.countryCode=country.code;
    
  }
  filtercity(val: string): string[] {
    const filterValue = val.toLowerCase();
		return this.citiesArray.filter
      (function(Product) {
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
