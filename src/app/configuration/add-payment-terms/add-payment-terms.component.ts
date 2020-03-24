import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-add-payment-terms',
  templateUrl: './add-payment-terms.component.html',
  styleUrls: ['./add-payment-terms.component.css']
})
export class AddPaymentTermsComponent implements OnInit {
  addPaymentTermsForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = 'info@nicoza.com';

  constructor(private fb:FormBuilder,private route:Router,private inputOutputService: InputOutputService,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.addPaymentTermsForm = this.fb.group({
      "name":['',Validators.required],
      "due_in_date":['',Validators.required],
      "payment_term_from	":[''],
      "default":['']
    })
  }

  get name()  { 
    return this.addPaymentTermsForm.controls.name
    }

  get due_in_date()  {   
    return this.addPaymentTermsForm.controls.due_in_date
  }

  submit(formValues){
    formValues.email = this.email;
    
    // this.route.navigate(['/app/customers/customerGroup'])
    this.inputOutputService.paymentTermArray.push(formValues)
    this.configurationService.addPaymentTerms(formValues).subscribe(
      res=>{
        this.successMsg = "Payment Term added.";
        this.showSuccess();
        this.route.navigate(['app/config/paymentTerms'])
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
