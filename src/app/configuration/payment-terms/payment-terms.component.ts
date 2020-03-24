import { Component, OnInit } from '@angular/core';
import { InputOutputService } from './../../services/inputOutput.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from "../../apperrors/apperror";

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})
export class PaymentTermsComponent implements OnInit {

  paymentTermArray:Array<number>=[];
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isHide: boolean = true;
  constructor(private inputOutputService:InputOutputService,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.paymentTermArray = this.inputOutputService.paymentTermArray;
    this.configurationService.getPaymentTerms().subscribe(
      res=>{
      },
      err=>{
        this.errorMsg="Some Error Occured";
        this.showError();
        if(err instanceof AppError){
          
        }
      }
    )
  }

  deletePaymentTerms(id){
    this.configurationService.deletePaymentTerms(id).subscribe(
      res=>{
        this.successMsg = "Payment Terms deleted.";
        this.showSuccess();
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
