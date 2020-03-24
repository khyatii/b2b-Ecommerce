import { ConfigurationService } from './../../services/configuration.service';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupUser } from '../../signup-user/signup-user.service';
import { Observable } from 'rxjs/Observable';
import { SetupService } from '../../services/setup.service';

@Component({
  selector: 'app-logistics-search',
  templateUrl: './logistics-search.component.html',
  styleUrls: ['./logistics-search.component.css']
})
export class LogisticsSearchComponent implements OnInit {

  countryArray: any;
  citiesArray: any;
  isShow: boolean;
  minAmount: any;
  maxAmount: any;
  allCurrency;
  logisticTypeArray;
  servicesOnLogistics: Array<any>;
  isHide: boolean = true;
  searchLogisticsForm: FormGroup;
  searchResults: Array<any>;
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;
  servicetype: Array<any>;
  servicetypea: Array<any>;
  global: Array<any> = [];
  currencyArray = [];

  constructor(private setupService: SetupService, private configurationService: ConfigurationService,
    private fb: FormBuilder, private route: Router, private logisticsService: LogisticsService, private signup: SignupUser) { }

  ngOnInit() {

    this.searchLogisticsForm = this.fb.group({
      "txtLogisticsService": ['', Validators.required],
      "txtServiceName": ['',],
      "txtCity": ['',],
      "txtMinPriceRange": ['',],
      "txtMaxPriceRange": ['',],
      "txtCurrency": ['',],
      "txtCountry": ['',],

    })

    this.signup.getCurrencyCodes().subscribe(resp => {
      this.allCurrency = resp;
    })
    this.configurationService.getCurrency().subscribe(resp => {
      this.currencyArray = resp;
    })
    this.setupService.getTypes().subscribe(res => {
      this.logisticTypeArray = res;
    })

    this.signup.getCountry().subscribe(res => {
      res = res.json();
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.countryArray.slice());
    });
  }

  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  setSelected(event: any) {
    this.global = [];
    var logisticArr = event.value;
    if (logisticArr.length >= 1) {
      this.setupService.getMultipleServices(logisticArr).subscribe(resp => {
        this.servicesOnLogistics = resp.services;
        for (let i = 0; i < logisticArr.length; i++) {
          var obj = {};
          var dataarr = [];
          obj['name'] = logisticArr[i];
          for (let j = 0; j < this.servicesOnLogistics.length; j++) {
            if (this.servicesOnLogistics[j].logistics_type == logisticArr[i]) {
              dataarr.push(this.servicesOnLogistics[j])
            }
          }
          obj['data'] = dataarr
          this.global.push(obj);
        }
      })
    } else {
      this.servicesOnLogistics = [];
      this.global = [];
    }
  }

  countryChanged(country) {
    this.signup.getCites(country).subscribe(res => {
      if (res.length >= 1) {
        this.citiesArray = res;
        this.filteredCity = this.txtCity.valueChanges
          .startWith(null)
          .map(val => val ? this.filtercity(val) : this.citiesArray.slice());
      } else this.citiesArray = [];
    })
  }


  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  filtercity(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.citiesArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  get txtLogisticsService() {
    return this.searchLogisticsForm.controls.txtLogisticsService
  }
  get txtCountry() {
    return this.searchLogisticsForm.controls.txtCountry
  }
  get txtCity() {
    return this.searchLogisticsForm.controls.txtCity;
  }

  showMessage() {
    this.isShow = true;
    setTimeout(function () { this.isShow = false; }.bind(this), 2000);
  }

  submit(formValues) {
    this.isHide = false;
    this.setupService.postLogisticsSearch(formValues).subscribe(resp => {
      this.searchResults = resp.data
    })
  }

  // maxSlideChange(event: any) {
  //   this.maxValue = event.value;
  // }

  // minSlideChange(event: any) {
  //   this.minValue = event.value;
  // }
}
