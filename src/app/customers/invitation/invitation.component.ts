import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { NotFoundError } from '../../apperrors/notfound';
import { SignupUser } from '../../signup-user/signup-user.service';
import { Observable } from 'rxjs/Observable';
import { Http } from "@angular/http";
import { ConfigurationService } from '../../services/configuration.service';
import { CompanyDetailService } from '../../services/company-details.services';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {
  @Output() notify: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  customerGroupArray: any;
  invitationForm: FormGroup;
  isShow: boolean = true;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  filteredOptions: Observable<string[]>;
  countryArray: any;
  phone_number_dialcode: any;
  isbystepper: boolean = false;
  @select() isStepper: Observable<boolean>;

  constructor(private companyDetailService: CompanyDetailService, private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private signup: SignupUser, public http: Http, private route: Router,
    private customerService: CustomerService, private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {

    this.isStepper.subscribe(res => {
      this.isbystepper = res;
    })

    this.customerService.getCustomerGroups().subscribe(res => {
      this.customerGroupArray = res;
    })

    this.signup.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.country_name.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    })

    this.invitationForm = this.fb.group({
      "txtBusinessName": ['', Validators.required],
      "txtBuisnessEmail": ['', [Validators.required, Validators.email]],
      "txtTraderType": ['', Validators.required],
      "txtContactName": ['', Validators.required],
      "country_name": ['', Validators.required],
      "phone_number": ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      "phone_number_code": ['', Validators.required],
      "txtCustomerGroup": [''],
      "txtContactEmail": [''],
      "txtPostalAdress": [''],
      "txtPhysicalAddress": [''],
      "txtWebsite": [''],
      "txtPhone": ['']
    })

  }

  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  countryChanged(val) {
    this.phone_number_dialcode = val.dial_code;
  }

  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // keyPress(event: any) {
  //   if (!((event.keyCode > 95 && event.keyCode < 106)
  //     || (event.keyCode > 47 && event.keyCode < 58)
  //     || event.keyCode == 8)) {
  //     event.preventDefault();
  //   }
  // }

  get txtBusinessName() {
    return this.invitationForm.controls.txtBusinessName
  }
  get country_name() {
    return this.invitationForm.controls.country_name
  }
  get phone_number() {
    return this.invitationForm.controls.phone_number
  }
  get phone_number_code() {
    return this.invitationForm.controls.phone_number_code
  }
  get txtTraderType() {
    return this.invitationForm.controls.txtTraderType
  }
  get txtContactName() {
    return this.invitationForm.controls.txtContactName
  }
  get txtCustomerGroup() {
    return this.invitationForm.controls.txtCustomerGroup
  }


  submit(formValues) {
    this.isLoading = true;
    this.customerService.postInvitation(formValues).subscribe(res => {
      this.successMsg = "Invitation link has been sent to Customer Email Account";
      this.showSuccess();
      this.isLoading = false;
      this.signup.getCurrencyCodes().subscribe(response => {
        let currencyCode = response
        let country = this.invitationForm.controls['country_name']['value'];
        let code = currencyCode[country];
        this.http.get('assets/currency.json').subscribe(resp => {
          let data = resp.json();
          let addCurrency = {};
          addCurrency['currency_name'] = data[code].name;
          addCurrency['iso3'] = data[code].code;
          addCurrency['symbol'] = data[code].symbol_native;
          addCurrency['txtExchangeRate'] = 0;
          addCurrency['default'] = true;
          addCurrency['id'] = res._id;
          this.configurationService.addCurrencyInvite(addCurrency).subscribe(resc => {
          })
        })
      })
      let addLocation = {};
      addLocation['label'] = 'Primary Location';
      addLocation['txtCountry'] = formValues.country_name;
      addLocation['default'] = true;
      addLocation['hold_stock'] = false;
      addLocation['id'] = res._id;
      this.companyDetailService.addLocationInvite(addLocation).subscribe(res2 => { })
    },
      err => {
        if (err.err.status == "401") {
          this.errorMsg = "Email Already Exist";
          this.showError();
          this.isLoading = false;
        }
        else {
          this.errorMsg = "Some Error Occured";
          this.showError();
          this.isLoading = false;
        }
        if (err instanceof NotFoundError) { }
      }
    )
  }

  showSuccess() {
    if (this.isbystepper) {
      window.scrollTo(500, 0);
      this.isSuccess = false;
      setTimeout(() => {
        this.isSuccess = true;
      }, 2000);

      this.notify.emit(this.invitationForm);
    } else {
      window.scrollTo(500, 0);
      this.isSuccess = false;
      setTimeout(() => {
        this.isSuccess = true;
        this.route.navigateByUrl('/app/customers/allCustomer');
      }, 2000);
    }
  }


  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }

}