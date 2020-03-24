import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  generalSetupForm:FormGroup
  isShow:boolean=true;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;

  constructor(private fb:FormBuilder,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.generalSetupForm = this.fb.group({
      "email":[localStorage.getItem('email')],                          //we have to pick email of login user
      "tax_label":['',Validators.required],
      "tax_number_label":['',Validators.required],
      "tax_number":['',Validators.required],
      "warn_on_shipping":['',Validators.required],
      
    })
  }

  get tax_label()  {   
    return this.generalSetupForm.controls.tax_label
  }

  get tax_number_label()  {   
    return this.generalSetupForm.controls.tax_number_label
  }

  get tax_number()  {   
    return this.generalSetupForm.controls.tax_number
  }

  get warn_on_shipping()  {   
    return this.generalSetupForm.controls.warn_on_shipping
  }

  submit(formValues){
    this.configurationService.postGeneralSettings(formValues).subscribe(
      res=>{
        this.successMsg = "General Configuration Updated Successfully.";
        this.showSuccess();
      },
      err=>{
        if(err instanceof AppError){
          this.errorMsg = "Some Error Occured.";
          this.showError();
        }
      })
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

