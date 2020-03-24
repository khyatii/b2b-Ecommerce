import { Router } from '@angular/router';
import { SignupUser } from './../../signup-user/signup-user.service';
import { UserLogisticsService } from './../../services/userLogistics.Service';
import { Component, OnInit, style } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidation } from '../../validators/emailValid';
import { Observable } from 'rxjs/Observable';
import { SetupService } from '../../services/setup.service';
import 'rxjs/add/operator/startWith'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-logistic-registration',
  templateUrl: './logistic-registration.component.html',
  styleUrls: ['./logistic-registration.component.css']
})
export class LogisticRegistrationComponent implements OnInit {
  phone_number_dialcode: any;
  countryArray: any;
  country: any;
  logisticType: any;
  signupUser: FormGroup
  isHide: boolean = true;
  logisticsType = [];
  logisticsServiceArray = [];
  logisticsServiceType = [];
  logisticTypeArray = [];
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  logisticsTypeArrayMultiple: Array<any>;
  serviceGroup: Array<any> = [];
  serviceNameGroup: Array<any> = [];

  constructor(private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder, private userLogisticsService: UserLogisticsService,
    private signup: SignupUser, private route: Router, private setupService: SetupService) { }

  ngOnInit() {
    this.signupUser = this.fb.group({
      "company_name": ['', Validators.required],
      "registration_name": ['', [Validators.required, Validators.minLength(3)]],
      "role": ['', Validators.required],
      "country_name": ['', Validators.required],
      "trader_type": ['', Validators.required],
      "logistics_type": ['', Validators.required],
      "service": ['', Validators.required],
      "type": ['', Validators.required],
      "email": ['', [Validators.required, EmailValidation.emailValid]],
      "phone_number": ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      "phone_number_code": ['', Validators.required],
    })
    this.setupService.getTypes().subscribe(res => {
      this.logisticTypeArray = res;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })

    this.signup.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;

      this.filteredOptions = this.country_name.valueChanges.startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
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
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }
  logisticChange(e) {
    this.serviceGroup = [];
    var logisticArray = e.value;
    if (logisticArray.length >= 1) {
      this.setupService.getMultipleType(logisticArray).subscribe(res => {
        this.logisticsTypeArrayMultiple = res;
        for (let i = 0; i < logisticArray.length; i++) {
          var obj = {};
          var data = [];
          obj['LogisticType'] = logisticArray[i];
          for (let j = 0; j < this.logisticsTypeArrayMultiple.length; j++) {
            if (this.logisticsTypeArrayMultiple[j].logistics_type == logisticArray[i]) {
              data.push(this.logisticsTypeArrayMultiple[j])
            }
          }
          obj['serviceArr'] = data;
          this.serviceGroup.push(obj);
        }
      })
    } else {
      this.logisticsTypeArrayMultiple = [];
      this.serviceGroup = [];
    }

  }

  logisticservice(e) {
    this.serviceNameGroup = [];
    var service_type = e.value;
    if (service_type.length >= 1) {
      this.setupService.getName(service_type).subscribe(res => {
        this.logisticsServiceArray = res;
        for (let i = 0; i < service_type.length; i++) {
          var obj = {};
          var data = [];
          obj['LogisticName'] = service_type[i];
          for (let j = 0; j < this.logisticsServiceArray.length; j++) {
            if (this.logisticsServiceArray[j].service_type == service_type[i]) {
              data.push(this.logisticsServiceArray[j])
            }
          }
          obj['serviceArr'] = data;
          this.serviceNameGroup.push(obj);
        }
      })
    }
    else {
      this.logisticsServiceArray = [];
      this.serviceNameGroup = [];
    }
  }

  countryChanged(val) {
    this.phone_number_dialcode = val.dial_code;
    this.country = val.name;
  }
  submit(formValues) {
    this.spinnerService.show()
    formValues.country = this.country;
    localStorage.setItem('user', JSON.stringify(formValues));

    this.userLogisticsService.register(formValues).subscribe(
      res => {
        this.successMsg = "Registered Succesfully, Password setting link sent to your Email Id";
        this.showSuccess();
        this.spinnerService.hide()
        setTimeout(() => {
          this.route.navigate(['/loginlogistic'])
        }, 2000);
      },
      err => {
        if (err.err._body == '{"message":"duplicateEmail"}') {
          this.errorMsg = "Email already exists";
          this.showError();
          this.isLoading = false;
          return;
        }
        else {
          this.errorMsg = "Some Error Occured";
          this.showError();
          this.isLoading = false;
        }
      }
    )
  }
  resolved(captchaResponse: string) {
  }

  hideDiv() {
    this.isHide = !this.isHide;
  }


  get company_name() {
    return this.signupUser.controls.company_name
  }
  get registration_name() {
    return this.signupUser.controls.registration_name
  }
  get role() {
    return this.signupUser.controls.role
  }
  get country_name() {
    return this.signupUser.controls.country_name
  }
  get trader_type() {
    return this.signupUser.controls.trader_type
  }
  get email() {
    return this.signupUser.controls.email
  }
  get logistics_type() {
    return this.signupUser.controls.logistics_type
  }
  get service() {
    return this.signupUser.controls.service
  }
  get type() {
    return this.signupUser.controls.type
  }
  get phone_number() {
    return this.signupUser.controls.phone_number
  }
  get phone_number_code() {
    return this.signupUser.controls.phone_number_code
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

  clickTerms(terms) {
    terms.style.display = 'block';
  }

  closeOutside(terms) {
    terms.style.display = 'none';
  }

}
