import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.css']
})
export class AddPaymentMethodComponent implements OnInit {
  addPaymentMethodForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = 'info@nicoza.com';

  constructor(private fb:FormBuilder,private route:Router,private inputOutputService: InputOutputService,
    private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.addPaymentMethodForm = this.fb.group({
      "description":['',Validators.required],
      "active":['']
    })
  }

  get description()  { 
    return this.addPaymentMethodForm.controls.description
    }

  submit(formValues){
    formValues.email = this.email;
   
    this.configurationService.addPaymentMethods(formValues).subscribe(
      res=>{
        this.successMsg = "Payment Method added.";
        this.showSuccess();
        this.route.navigate(['app/config/paymentMethod'])
      },
      err=>{
        this.errorMsg="Some Error Occured";
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
