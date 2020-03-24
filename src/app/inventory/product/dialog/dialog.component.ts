import { ConfigurationService } from './../../../services/configuration.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignupUser } from './../../../signup-user/signup-user.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { InputOutputService } from '../../../services/inputOutput.service';
import { NotFoundError } from '../../../apperrors/notfound';
import { CompanyDetailService } from '../../../services/company-details.services';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private route: Router,
    private customerService: CustomerService, private signup: SignupUser,
    private configurationService: ConfigurationService, public http: Http,
    private companyDetailService: CompanyDetailService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
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
      "country_name": ['', Validators.required],
      "phone_number": ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      "phone_number_code": ['', Validators.required],
      "txtContactName": ['', Validators.required],
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
  get txtBusinessName() {
    return this.invitationForm.controls.txtBusinessName
  }
  get txtTraderType() {
    return this.invitationForm.controls.txtTraderType
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
  get txtBuisnessEmail() {
    return this.invitationForm.controls.txtBuisnessEmail
  }
  get txtContactName() {
    return this.invitationForm.controls.txtContactName
  }

  submit(formValues) {
    this.isLoading = true;
    var that = this;
    this.customerService.postInvitation(formValues).subscribe(
      res => {
        this.successMsg = "Invitation link has been sent to you Customer Email Account";
        this.showSuccess();
        this.isLoading = false;
        this.dialogRef.close();

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
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
        if (err instanceof NotFoundError) { }
      }
    )
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
