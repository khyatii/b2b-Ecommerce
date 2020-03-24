import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupUser } from '../../signup-user/signup-user.service';
import { UserLogisticsService } from '../../services/userLogistics.Service';

@Component({
  selector: 'app-modify-insurance',
  templateUrl: './modify-insurance.component.html',
  styleUrls: ['./modify-insurance.component.css']
})
export class ModifyInsuranceComponent implements OnInit {

  insuranceForm: FormGroup;
  insuranceName: any;
  insuranceId: any;
  insuranceArray: any;
  countryCode: any;
  idRes: any;
  value: { _id: any; };
  citiesArray: any;
  countryArray: any;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;
  ServicesCategories = [];
  serviceNames = [];

  constructor(private fb: FormBuilder, private route: Router,
    private logisticsService: LogisticsService, private userLogisticsService: UserLogisticsService,
    private router: ActivatedRoute, private signupUser: SignupUser) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })
    this.logisticsService.getInsuranceOption().subscribe(
      res => {
        this.insuranceArray = res;
      })
    this.insuranceForm = this.fb.group({
      "txtCountry": ['', Validators.required],
      "txtTown": ['', Validators.required],
      "txtPriority": ['', Validators.required],
      "txtInsuranceAgent": ['', Validators.required],
      "txtShareTransportServiceDetails": ['', Validators.required],
      "txtShareConsignmentDetails": ['', Validators.required],
      "txtShareWarehouseDetails": ['', Validators.required],
      "txtShareClearingAgentsDetails": ['', Validators.required],
      "serviceType": ['', Validators.required],
      "serviceName": ['', Validators.required]
    })

    this.logisticsService.getOneInsuranceManagement(this.value).subscribe(
      res => {
        let priority = res[0].txtPriority
        this.txtCountry.setValue(res[0].txtCountry);
        this.idRes = res[0]._id;
        this.countryCode = res[0].txtCountryCode;
        this.txtInsuranceAgent.setValue(res[0].txtInsuranceAgent);
        this.insuranceName = res[0].txtInsuranceAgentName;
        this.serviceType.setValue(res[0].serviceType);
        this.serviceName.setValue(res[0].serviceName);
        this.txtPriority.setValue(priority.toString());
        this.txtShareWarehouseDetails.setValue(res[0].txtShareWarehouseDetails);
        this.txtShareConsignmentDetails.setValue(res[0].txtShareConsignmentDetails);
        this.txtShareTransportServiceDetails.setValue(res[0].txtShareTransportServiceDetails);
        this.txtShareClearingAgentsDetails.setValue(res[0].txtShareClearingAgentsDetails);
        this.txtTown.setValue(res[0].txtTown);
        var country = { code: res[0].txtCountryCode }
        var warehouse = { warehousecountry: country.code }
        this.logisticsService.getInsuranceCountry(warehouse).subscribe(resp1 => {
          this.insuranceArray = resp1;
        })
        var id = { _id: res[0].txtInsuranceAgent }
        this.userLogisticsService.getServicesTypesForLogi(id).subscribe(resp => {
          this.ServicesCategories = resp[0].type;
          this.serviceNames = resp[0].service
        })
      })
  }
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }


  submit(formValues) {
    this.isLoading = true;
    formValues._id = this.idRes;
    formValues.txtInsuranceAgentName = this.insuranceName;
    formValues.insuranceId = formValues.txtInsuranceAgent;
    formValues.txtCountryCode = this.countryCode;

    this.logisticsService.modifyInsuranceManagement(formValues).subscribe(res => {
      this.successMsg = "Insurance Agent is modified.";
      this.showSuccess();
      this.isLoading = false;
      setTimeout(() => {
        this.route.navigate(['/app/logistics/insuranceMangement'])
      }, 3000)
    }, (err) => {
      if (err.err.status == "502") {
        this.errorMsg = "Insurance Agent Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
      this.isLoading = false;
    })
  }

  changeInsurance(insurance) {
    this.insuranceName = insurance.company_name;
    var id = { _id: insurance._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }

  countryChanged(country) {
    var warehousecountry = { warehousecountry: country.code }
    this.logisticsService.getInsuranceCountry(warehousecountry).subscribe(res => {
      this.insuranceArray = res;
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
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  get txtCountry() {
    return this.insuranceForm.controls.txtCountry
  }
  get txtTown() {
    return this.insuranceForm.controls.txtTown
  }
  get txtPriority() {
    return this.insuranceForm.controls.txtPriority
  }
  get txtInsuranceAgent() {
    return this.insuranceForm.controls.txtInsuranceAgent
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
