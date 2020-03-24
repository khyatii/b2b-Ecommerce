import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';


@Component({
  selector: 'app-setup-defaults',
  templateUrl: './setup-defaults.component.html',
  styleUrls: ['./setup-defaults.component.css']
})
export class SetupDefaultsComponent implements OnInit {

  defaultForm:FormGroup;
  isShow:boolean=true;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = 'info@nicoza.com'

  constructor(private fb:FormBuilder,private route:Router ,private configurationService:ConfigurationService) { }

  ngOnInit() {
  this.defaultForm = this.fb.group({
      "default_sale_tax":[''],
      "default_purchase_tax":[''],
      "default_tax_exempts":['0'],
      "total_are":[''],
      "primary_location":['Location'],
      "primary_contact":[''],
      "payment_terms":[''],
      "payment_method":[''],
      "sale_price_list":[''],
      "purchase_price_list":[''],

    })

    this.configurationService.getDefaultSettings().subscribe(
      res=>{
      },
      err=>{
        this.errorMsg = "Some Error Occured";
        this.showError();
        if(err instanceof AppError){
          
        }
      }
    )
  }

  submit(formValues){
    formValues.email = this.email;
    this.configurationService.addDefaultSettings(formValues).subscribe(
      res=>{
        this.successMsg = "Default Settings Updated Successfully.";
        this.showSuccess();
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
