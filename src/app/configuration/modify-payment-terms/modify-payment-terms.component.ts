import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modify-payment-terms',
  templateUrl: './modify-payment-terms.component.html',
  styleUrls: ['./modify-payment-terms.component.css']
})
export class ModifyPaymentTermsComponent implements OnInit {
  modifyPaymentTermsForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = 'info@nicoza.com';
  id:number = 1;

  constructor(private fb:FormBuilder,private route:Router,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.modifyPaymentTermsForm = this.fb.group({
      "name":['NET 30',Validators.required],
      "due_in_date":['30',Validators.required],
      "payment_term_from":[''],
      "default":[''],
    })

    this.configurationService.getPaymentTerms().subscribe(
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

  get name()  { 
    return this.modifyPaymentTermsForm.controls.name
    }

  get due_in_date()  {   
    return this.modifyPaymentTermsForm.controls.due_in_date
  }

  submit(formValues){
    this.configurationService.modifyPaymentTerms(formValues).subscribe(
     res=>{
        this.successMsg = "Payment Terms Modified.";
        this.showSuccess();
        this.route.navigate(['app/config/paymentTerms'])
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


