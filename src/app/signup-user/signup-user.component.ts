import { CompanyDetailService } from './../services/company-details.services';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, style } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidation } from '../validators/emailValid';
import { SignupUser } from './signup-user.service';
import { CountriesService } from "../services/countries.service";
import { ServerError } from "../apperrors/servererror";
import { ConfigurationService } from '../services/configuration.service';
import { Http } from "@angular/http";
import { SetupService } from '../services/setup.service';
import { Observable } from 'rxjs/Observable';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css'],

})
export class SignupUserComponent implements OnInit {
  formValue: any;
  phone_number_dialcode: any;
  signupUser: FormGroup
  isHide: boolean = true;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  countryArray: any;
  filteredOptions: Observable<string[]>;

  constructor(private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder, 
    private signup: SignupUser, private countries: CountriesService,
    private route: Router, private configurationService: ConfigurationService, public http: Http,
    private companyDetailService: CompanyDetailService, private SetupService: SetupService) {
  }

  ngOnInit() {
    this.signup.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.country_name.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })
    this.signupUser = this.fb.group({
      "company_name": ['', Validators.required],
      "registration_name": ['', [Validators.required, Validators.minLength(3)]],
      "role": ['', Validators.required],
      "country_name": ['', Validators.required],
      "trader_type": ['', Validators.required],
      "email": ['', [Validators.required, EmailValidation.emailValid]],
      "phone_number": ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      "phone_number_code": ['', Validators.required],
      "register_type": ['trader'],
      "checkTerms": ['', Validators.required],
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
  get phone_number() {
    return this.signupUser.controls.phone_number
  }
  get phone_number_code() {
    return this.signupUser.controls.phone_number_code
  }
  get checkTerms() {
    return this.signupUser.controls.checkTerms
  }

  // openDialog(event){
  //   document.getElementById('modalAddProduct').style.display ='show';
  // }
  onClickedOutside(e: Event) {
  }
  onSubmit(formValues) {
    this.spinnerService.show()
    formValues.password = "temporary password" //Extra field in api for password for now
    formValues.admin = true;
    var that = this;
    window['formValue'] = formValues
    localStorage.setItem('user', JSON.stringify(formValues));

    this.signup.postsignup(formValues).subscribe(
      res => {
        localStorage.setItem('token', res.userToken);
        this.successMsg = "Password link has been sent to you registered Email Account";
        this.showSuccess();
        this.spinnerService.hide()
        setTimeout(() => {
          this.isSuccess = true;
          this.route.navigate(['login'])
        }, 2000);

        localStorage.setItem('email', res.userData.email)
        this.signup.getCurrencyCodes().subscribe(
          response => {
            let currencyCode = response
            let country = that.signupUser.controls['country_name']['value'];
            let code = currencyCode[country];

            this.http.get('assets/currency.json').subscribe(
              res => {

                let data = res.json();
                let addCurrency = {};
                addCurrency['currency_name'] = data[code].name;
                addCurrency['iso3'] = data[code].code;
                addCurrency['symbol'] = data[code].symbol_native;
                addCurrency['txtExchangeRate'] = 0;
                addCurrency['default'] = true;

                this.configurationService.addCurrency(addCurrency).subscribe(res => {
                  setTimeout(() => {
                    this.isSuccess = true;
                    this.route.navigate(['login'])
                  }, 2000);
                })
              }
            )

          }
        )
        let addLocation = {};
        addLocation['label'] = 'Primary Location';
        addLocation['txtCountry'] = formValues.country_name;
        addLocation['default'] = true;
        addLocation['hold_stock'] = false;
        this.companyDetailService.addLocation(addLocation).subscribe(
          res2 => {
          }
        )

        this.SetupService.addApproval('').subscribe(res => {
        })
      },
      err => {

        // if(err != undefined){
        if (err.err._body == '{"message":"duplicateEmail"}') {
          this.errorMsg = "Email already exists";
          this.showError();
          this.spinnerService.hide()
          return;
        }
        // }


        if (err instanceof ServerError) {
          this.errorMsg = "Server not responding.";
          this.showError();
          this.spinnerService.hide()
          return
        }
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.spinnerService.hide()

      }
    )

  }
  resolved(captchaResponse: string) {
  }

  hideDiv() {
    this.isHide = !this.isHide;
  }

  clickTerms(terms) {
    terms.style.display = 'block';
  }
  countryChanged(val) {
    this.phone_number_dialcode = val.dial_code;
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

  closeOutside(terms) {
    terms.style.display = 'none';
  }

}
