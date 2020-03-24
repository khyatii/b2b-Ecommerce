import { VasSelectionService } from './../../services/vas-selection.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vasform',
  templateUrl: './vasform.component.html',
  styleUrls: ['./vasform.component.css']
})
export class VasformComponent implements OnInit {

  isHide:boolean=false;
  vasForm:FormGroup;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isLoading:boolean = false;

  constructor(private fb:FormBuilder,private route:Router,private inputOutputService :InputOutputService,
    private vasSelectionService:VasSelectionService) { }

  ngOnInit() {
    this.vasForm= this.fb.group({
      "servicePLan":['',Validators.required],
      "location":['',Validators.required],
      "price":['',Validators.required],
    })
  }

   get servicePLan()  {    
     return this.vasForm.controls.servicePLan
  }

  get location()  {    
     return this.vasForm.controls.location
  }

  get price()  {    
     return this.vasForm.controls.price
  }

  submit(formValues){
    this.isHide = true;
    this.isLoading=true
    // this.inputOutputService.vasArray.push(formValues)
    

    this.vasSelectionService.addVasService(formValues).subscribe(
      res=>{
        this.successMsg="Vas Selection Service Added";
        this.showSuccess();
        this.isLoading = false;
        this.route.navigateByUrl('/app/vasselection');
        window.location.reload()
      },
      err=>{
        this.errorMsg ="Some Error Occured";
        this.showError();
        this.isLoading= false;
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
