import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupUser } from '../../signup-user/signup-user.service';
import { Observable } from 'rxjs/Observable';
import { UserLogisticsService } from '../../services/userLogistics.Service';


@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.css']
})
export class AddInsuranceComponent implements OnInit {

  insuranceForm: FormGroup;
  insuranceAgentArray = [];
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
    private signupUser: SignupUser, private logisticsService: LogisticsService) { }

  ngOnInit() {

    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.countryArray.slice());
    })

    this.insuranceForm = this.fb.group({
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtInsuranceAgent": ['', Validators.required],
      "txtPriority": ['', Validators.required],
      "txtShareTransportServiceDetails": ['', Validators.required],
      "txtShareConsignmentDetails": ['', Validators.required],
      "txtShareWarehouseDetails": ['', Validators.required],
      "txtShareClearingAgentsDetails": ['', Validators.required],
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
    return this.insuranceForm.controls.txtCountry
  }
  get txtTown() {
    return this.insuranceForm.controls.txtTown
  }
  get txtInsuranceAgent() {
    return this.insuranceForm.controls.txtInsuranceAgent
  }
  get txtPriority() {
    return this.insuranceForm.controls.txtPriority
  }
  get txtShareTransportServiceDetails() {
    return this.insuranceForm.controls.txtShareTransportServiceDetails
  }
  get txtShareConsignmentDetails() {
    return this.insuranceForm.controls.txtShareConsignmentDetails
  }
  get txtShareWarehouseDetails() {
    return this.insuranceForm.controls.txtShareWarehouseDetails
  }
  get txtShareClearingAgentsDetails() {
    return this.insuranceForm.controls.txtShareClearingAgentsDetails
  }
  get serviceType() {
    return this.insuranceForm.controls.serviceType
  }
  get serviceName() {
    return this.insuranceForm.controls.serviceName
  }
  getServies(type){
    var id = { _id: type._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }

  countryChanged(country) {
    var warehouse={ warehousecountry:country.code }
    this.logisticsService.getInsuranceCountry(warehouse).subscribe(res => {
      this.insuranceAgentArray = res;
    })
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
      (function(Product) {
        return Product.name.toLowerCase().includes(filterValue);
    })
	}
  submit(formValues) {
    formValues.txtInsuranceAgentName = formValues.txtInsuranceAgent.company_name;
    formValues.txtInsuranceAgent = formValues.txtInsuranceAgent._id;
    formValues.txtCountryCode = this.countryCode;

    this.logisticsService.postInsuranceManagement(formValues).subscribe((res => {
      this.showSuccess();
      this.successMsg = "Insuarnce Agent is added."
      this.isLoading = false;
    }), (err) => {
      if (err.err.status == "502") {
        this.errorMsg = "Insuarnce Agent Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
      this.isLoading = false;
    })
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
      this.route.navigate(['/app/logistics/insuranceMangement'])
    }, 3000);
  }
  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }

}
