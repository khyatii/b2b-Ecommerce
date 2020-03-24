import { Component, OnInit } from '@angular/core';
import { InputOutputService } from './../../services/inputOutput.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from "../../apperrors/apperror";

@Component({
  selector: 'app-tax-types',
  templateUrl: './tax-types.component.html',
  styleUrls: ['./tax-types.component.scss']
})
export class TaxTypesComponent implements OnInit {

  taxTypeArray:Array<number>=[];
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isHide: boolean = true;

  constructor(private inputOutputService:InputOutputService,private configurationService:ConfigurationService) { }

  ngOnInit() {
    this.taxTypeArray = this.inputOutputService.taxTypeArray;
    this.configurationService.getTaxType().subscribe(
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

  deleteTaxType(id){
    this.configurationService.deleteTaxType(id).subscribe(
      res=>{
        this.successMsg = "Tax Type is deleted.";
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
