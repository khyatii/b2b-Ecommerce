import { SignupUser } from './../../signup-user/signup-user.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyDetailService } from "../../services/company-details.services";
import { AppError } from "../../apperrors/apperror";


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {
  countryArray: any;

  locationForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isLoading:boolean = false;

  constructor(private fb:FormBuilder,private route:Router,private signupUser:SignupUser,
   private companyDetailService:CompanyDetailService) { }

  ngOnInit() {
    this.signupUser.getCountry().subscribe(
      res=>{
        res = res.json()
        this.countryArray = res;
      }
    )

    this.locationForm = this.fb.group({
      "label":['',Validators.required],
      "street1":['',Validators.required],
      "street2":[''],
      "suburb":[''],
      "city":[''],
      "state":[''],
      "postal_code":[''],
      "txtCountry":[''],
      "hold_stock":[''],
    })
  }

  get label()  { 
    return this.locationForm.controls.label
    }

  get street1()  {   
    return this.locationForm.controls.street1
  }

  submit(formValues){
    if(formValues.hold_stock == ''){
      formValues.hold_stock = false;
    }
    this.isLoading = true;

    this.companyDetailService.addLocation(formValues).subscribe(
      res=>{
        this.successMsg = "Location added.";
        this.showSuccess();
        this.isLoading = false;
        setTimeout(()=>{
         this.route.navigate(['/app/companyDetails/location'])
        },2000)
      },
      err=>{
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
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
