import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modify-currency',
  templateUrl: './modify-currency.component.html',
  styleUrls: ['./modify-currency.component.css']
})
export class ModifyCurrencyComponent implements OnInit {
  objectId: any;
  value: { _id: any; };
  modifyCurrencyForm: FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  email:string = "info@qexon.com";                      //Used to update currency by fetching email
  id:string = "id123"                                   //Used to update currency by fetching id
  constructor(private fb:FormBuilder,private route:Router, private router:ActivatedRoute,private configurationService:ConfigurationService) {
   
   }

  ngOnInit() {
    this.value = {_id:this.router.snapshot.params['id']}

    this.modifyCurrencyForm = this.fb.group({
      "currency_name":['',Validators.required],
      "iso3":['',Validators.required],
      "symbol":['',Validators.required],      
    });

    this.configurationService.getOneCurrency(this.value).subscribe(
      res=>{
        this.currency_name.setValue(res[0].currency_name);
        this.iso3.setValue(res[0].iso3);
        this.symbol.setValue(res[0].symbol);
        this.objectId = res[0]._id;
      },
      err=>{
        this.errorMsg = "Some Error Occured";
        this.showError();
        if(err instanceof AppError){
          
        }
      }
    )
  }

  get currency_name()  { 
    return this.modifyCurrencyForm.controls.currency_name
    }

  get iso3()  {   
    return this.modifyCurrencyForm.controls.iso3
  }

  get symbol()  {   
    return this.modifyCurrencyForm.controls.symbol
  }

  submit(formValues){
    formValues._id = this.objectId;
    this.configurationService.modifyCurrency(formValues).subscribe(
      res=>{
        this.successMsg = "Currency is Updated.";
        this.showSuccess();
        this.route.navigate(['app/config/currency'])
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
