import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { InputOutputService } from '../../services/inputOutput.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';


@Component({
  selector: 'app-addtax-types',
  templateUrl: './addtax-types.component.html',
  styleUrls: ['./addtax-types.component.css']
})
export class AddtaxTypesComponent implements OnInit {

  addTaxTypeForm:FormGroup
  isHide:boolean=false;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = 'info@nicoza.com';

  constructor(private fb:FormBuilder,private route:Router,private inputOutputService: InputOutputService,private configurationService:ConfigurationService) {
   
   }

  ngOnInit() {
    this.addTaxTypeForm = this.fb.group({
      "tax_name":['',Validators.required],
      "tax_code":['',Validators.required],
      "computedTax":[''],
      "tax_lines":[''],
      "tax_line_percent":[''],
      "compound_tax":[''],
      "compound_tax_percent":[''],
    })
  }

  get tax_name()  { 
    return this.addTaxTypeForm.controls.tax_name
    }

  get tax_code()  {   
    return this.addTaxTypeForm.controls.tax_code
  }

  get computedTax()  { 
    return this.addTaxTypeForm.controls.computedTax
    }

  get tax_lines()  {   
    return this.addTaxTypeForm.controls.tax_lines
  }

  get tax_line_percent()  { 
    return this.addTaxTypeForm.controls.tax_line_percent
    }

  get compound_tax()  {   
    return this.addTaxTypeForm.controls.compound_tax
  }

  get compound_tax_percent()  { 
    return this.addTaxTypeForm.controls.compound_tax_percent
    }

  showCompoundTax(){
    this.isHide = !this.isHide;
  }

  submit(formValues){
    formValues.email = this.email;    
    this.inputOutputService.taxTypeArray.push(formValues)
    this.configurationService.addTaxType(formValues).subscribe(
      res=>{
        this.successMsg = "Tax Type is added.";
        this.showSuccess();
        this.route.navigate(['/app/config/taxType'])
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
