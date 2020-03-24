import { SignupUser } from './../../signup-user/signup-user.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { InputOutputService } from '../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyDetailService } from "../../services/company-details.services";
import { AppError } from "../../apperrors/apperror";

@Component({
  selector: 'app-modify-location',
  templateUrl: './modify-location.component.html',
  styleUrls: ['./modify-location.component.css']
})
export class ModifyLocationComponent implements OnInit {
  holdStockChk: any;
  idRes: any;
  countryArray: any;

  locationForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isLoading:boolean = false;

  constructor(private fb:FormBuilder,private route:Router,private signupUser:SignupUser,
    private companyDetailService:CompanyDetailService,private router: ActivatedRoute) { }

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

    let value = {_id:this.router.snapshot.params['id']}

    this.companyDetailService.getOneLocation(value).subscribe(
      res1=>{
        this.locationForm.controls['label'].setValue(res1[0].label);
        this.locationForm.controls['street1'].setValue(res1[0].street1);
        this.locationForm.controls['street2'].setValue(res1[0].street2);
        this.locationForm.controls['suburb'].setValue(res1[0].suburb);
        this.locationForm.controls['city'].setValue(res1[0].city);
        this.locationForm.controls['state'].setValue(res1[0].state);
        this.locationForm.controls['postal_code'].setValue(res1[0].postal_code);
        this.locationForm.controls['txtCountry'].setValue(res1[0].txtCountry);
        this.locationForm.controls['hold_stock'].setValue(res1[0].hold_stock);

        this.holdStockChk = res1[0].hold_stock;
        this.idRes = res1[0]._id;
      }
    )
  }

  get label()  { 
    return this.locationForm.controls.label
    }

  get street1()  {   
    return this.locationForm.controls.street1
  }

  submit(formValues){
    this.isLoading = true;
    formValues._id = this.idRes;
    this.companyDetailService.modifyLocation(formValues).subscribe(
      res=>{
        this.successMsg = "Location updated.";
        this.showSuccess();
        this.isLoading =false;
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
