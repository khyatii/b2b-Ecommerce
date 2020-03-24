import { SignupUser } from './../../signup-user/signup-user.service';
import { AppError } from './../../apperrors/apperror';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogisticsService } from '../../services/userLogistics.Service';


@Component({
  selector: 'app-modify-clearing',
  templateUrl: './modify-clearing.component.html',
  styleUrls: ['./modify-clearing.component.css']
})
export class ModifyClearingComponent implements OnInit {
  clearingName: any;
  clearingArray: any;
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
  clearingForm: FormGroup;
  ServicesCategories = [];
  serviceNames = [];

  constructor(private fb: FormBuilder, private route: Router,
    private logisticsService: LogisticsService, private userLogisticsService: UserLogisticsService,
    private router: ActivatedRoute, private signupUser: SignupUser) { }

  ngOnInit() {
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })

    this.value = { _id: this.router.snapshot.params['id'] }
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

    this.logisticsService.getOneClearingManagement(this.value).subscribe(
      res => {
        let priority = res[0].txtPriority
        this.txtCountry.setValue(res[0].txtCountry);
        this.idRes = res[0]._id;
        this.txtClearingAgent.setValue(res[0].txtClearingId);
        this.clearingName = res[0].txtClearingName;
        this.serviceType.setValue(res[0].serviceType);
        this.serviceName.setValue(res[0].serviceName);
        this.txtPriority.setValue(priority.toString());
        this.txtShareWarehouseDetails.setValue(res[0].txtShareWarehouseDetails);
        this.txtShareConsignmentDetails.setValue(res[0].txtShareConsignmentDetails);
        this.txtShareTransportServiceDetails.setValue(res[0].txtShareTransportServiceDetails);
        this.idRes = res[0]._id;
        this.countryCode = res[0].txtCountryCode;
        this.txtTown.setValue(res[0].txtTown);
        var country = { code: res[0].txtCountryCode }
        var warehouse = { warehousecountry: country.code }
        this.logisticsService.getClearingCountry(warehouse).subscribe(resp1 => {
          this.clearingArray = resp1;
        })
        var id = { _id: res[0].txtClearingId }
        this.userLogisticsService.getServicesTypesForLogi(id).subscribe(resp => {
          this.ServicesCategories = resp[0].type;
          this.serviceNames = resp[0].service
        })
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
    formValues.txtClearingName = this.clearingName;
    formValues.txtClearingId = formValues.txtClearingAgent;
    formValues.txtCountryCode = this.countryCode;

    this.logisticsService.modifyClearingManagement(formValues).subscribe(res => {
      this.successMsg = "Clearing Agent is modified.";
      this.showSuccess();
      this.isLoading = false;
      setTimeout(() => {
        this.route.navigate(['/app/logistics/clearing'])
      }, 3000)
    }, (err) => {
      if (err.err.status == "502") {
        this.errorMsg = "Clearing Agent Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
      this.isLoading = false;
    })
  }

  changeClearing(clearing) {
    this.clearingName = clearing.company_name;
    var id = { _id: clearing._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
    })
  }

  countryChanged(country) {
    var warehouse = { warehousecountry: country.code }
    this.logisticsService.getClearingCountry(warehouse).subscribe(res => {
      this.clearingArray = res;
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
