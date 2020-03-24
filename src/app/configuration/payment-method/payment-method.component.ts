import { Component, OnInit } from '@angular/core';
import { InputOutputService } from './../../services/inputOutput.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from "../../apperrors/apperror";

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {

  paymentArray:Array<number>=[];
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isHide: boolean = true;
  constructor(private inputOutputService:InputOutputService,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.paymentArray = this.inputOutputService.paymentArray;
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

  deletePaymentmethod(id){
    this.configurationService.deletePaymentMethods(id).subscribe(
      res=>{
        this.successMsg = "Payment Method Deleted";
        this.showSuccess()
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
