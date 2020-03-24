import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modify-payment-method',
  templateUrl: './modify-payment-method.component.html',
  styleUrls: ['./modify-payment-method.component.css']
})
export class ModifyPaymentMethodComponent implements OnInit {

  modifyPaymentMethodForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = 'info@nicoza.com';
  id:number = 1;

  constructor(private fb:FormBuilder,private route:Router,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.modifyPaymentMethodForm = this.fb.group({
      "description":['PayPal',Validators.required],
      "active":['']
    })

    this.configurationService.getPaymentMethods().subscribe(
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

  get description()  { 
    return this.modifyPaymentMethodForm.controls.description
  }

  submit(formValues){
    formValues.email = this.email;
    formValues.id = this.id;
    
    this.configurationService.modifyPaymentMethods(formValues).subscribe(
      res=>{
        this.successMsg = "Payment Method Modified.";
        this.showSuccess();
        this.route.navigate(['app/config/paymentMethod'])
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


