import { SignupUser } from './../../signup-user/signup-user.service';
import { AppError } from './../../apperrors/apperror';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { InputOutputService } from '../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogisticsService } from '../../services/userLogistics.Service';


@Component({
  selector: 'app-modify-transport',
  templateUrl: './modify-transport.component.html',
  styleUrls: ['./modify-transport.component.css']
})
export class ModifyTransportComponent implements OnInit {
  transporterName: any;
  transporterId: any;
  transportArray: any;
  transportForm: FormGroup;
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
    this.signupUser.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());

    })


    this.value = { _id: this.router.snapshot.params['id'] }
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

    this.logisticsService.getOneTransportManagement(this.value).subscribe(res => {
      let priority = res[0].txtPriority
      this.txtCountry.setValue(res[0].txtCountry);
      this.idRes = res[0]._id;
      this.txtTransporter.setValue(res[0].txtTransporter);
      this.transporterName = res[0].txtTransporterName;
      this.serviceType.setValue(res[0].serviceType);
      this.serviceName.setValue(res[0].serviceName);
      this.txtPriority.setValue(priority.toString());
      this.txtShareWarehouseServiceDetails.setValue(res[0].txtShareWarehouseServiceDetails);
      this.txtShareConsignmentDetails.setValue(res[0].txtShareConsignmentDetails);
      this.idRes = res[0]._id;
      this.countryCode = res[0].txtCountryCode;
      this.txtTown.setValue(res[0].txtTown);
      var country = { code: res[0].txtCountryCode }
      var warehouse = { warehousecountry: country.code }
      this.logisticsService.getTransportCountry(warehouse).subscribe(resp1 => {
        this.transportArray = resp1;
      })
      var id = { _id: res[0].txtTransporter }
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

  submit(formValues) {
    this.isLoading = true;
    formValues._id = this.idRes;
    formValues.txtTransporterName = this.transporterName;
    formValues.txtCountryCode = this.countryCode;

    this.logisticsService.modifyTransportManagement(formValues).subscribe(res => {
      this.successMsg = "Transport is modified.";
      this.showSuccess();
      this.isLoading = false;
      setTimeout(() => {
        this.route.navigate(['/app/logistics/transportmanagement'])
      }, 3000)
    }, (err) => {
      if (err.err.status == "502") {
        this.errorMsg = "Transport Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
      this.isLoading = false;
    })
  }

  changeTransport(transport) {
    this.transporterName = transport.company_name;
    var id = { _id: transport._id }
    this.userLogisticsService.getServicesTypesForLogi(id).subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.serviceNames = res[0].service
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
