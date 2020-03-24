import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';
import { Http,Headers } from '@angular/http';
import * as fx from 'money';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.css']
})
export class AddCurrencyComponent implements OnInit {
  currencyObject: any;
  addCurrencyForm: FormGroup
  currencyArray:any
  inputISO:string=''
  inputSymbol:string=''
  baseValue:string;
  exchangeRate:string='';
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  constructor(private fb:FormBuilder,private route:Router,private inputOutputService: InputOutputService,
    private configurationService:ConfigurationService ,public http:Http) {
   
   }

  ngOnInit() {
    this.addCurrencyForm = this.fb.group({
      "currency_name":['',Validators.required],
      "iso3":['',Validators.required],
      "symbol":['',Validators.required],
      "txtExchangeRate":['',Validators.required],
      "email": ['info@nicoza.com'],
    })
    this.http.get('assets/currency.json').subscribe(res=>{
      this.currencyObject=res.json();
      let keys = [];
      for (let key in this.currencyObject) {
        keys.push({key: key, value: this.currencyObject[key]});
      }
      this.currencyArray=keys;
    })

    this.configurationService.getCurrency().subscribe(
      resp=>{
        this.baseValue = resp[0].iso3;
      }
    )
  }

  getCurrency(){
    let headers = new Headers();
    return this.http.get(`http://data.fixer.io/api/latest?access_key=5e2d825820b2f2c710cd6a2612f85acb&symbols=`+this.baseValue)
  }
  change(option){
    this.inputISO=option.value.value.code;
    this.inputSymbol = option.value.value.symbol_native;

    this.addCurrencyForm.controls.iso3.patchValue(this.inputISO);
    this.addCurrencyForm.controls.symbol.patchValue(this.inputSymbol)
   
    this.getCurrency().subscribe(res=>{
      let currenyExchange=res.json();
      this.exchangeRate = currenyExchange.rates[this.inputISO]
      this.addCurrencyForm.controls.txtExchangeRate.patchValue(this.exchangeRate)
    })
  }

  get currency_name()  { 
    return this.addCurrencyForm.controls.currency_name
    }

  get iso3()  {   
    return this.addCurrencyForm.controls.iso3
  }

  get symbol()  {   
    return this.addCurrencyForm.controls.symbol
  }

  submit(formValues){
    formValues.currency_name =  formValues.currency_name.value.name;
    // this.route.navigate(['/app/customers/customerGroup'])
    this.inputOutputService.currencyArray.push(formValues)
    this.configurationService.addCurrency(formValues).subscribe(
      res=>{
        this.successMsg = "Currency is added.";
        this.showSuccess();        
        this.route.navigate(['app/config/currency'])
      },
      err=>{
        this.errorMsg = "Some Error Occured";
        this.showError();
        if(err instanceof AppError){
          
        }
      }
    )
  }

  showSuccess(){
    window.scrollTo(500, 0);
    this.isSuccess =  false;
    setTimeout(() => {
      this.isSuccess = true; 
    }, 2000);
  }

  showError(){
    window.scrollTo(500, 0);
    this.isError =  false;
    setTimeout(() => {
      this.isError = true; 
    }, 2000);
  }
}
