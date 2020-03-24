import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordValidation } from '../../common/passwordValidation';
import { PasswordService } from '../set-password/set-password.service';

@Component({
  selector: 'app-confirm-login',
  templateUrl: './confirm-login.component.html',
  styleUrls: ['./confirm-login.component.css']
})
export class ConfirmLoginComponent implements OnInit {

  setPasswordForm:FormGroup;
  value;
  successMsg:string;
  isSuccess:boolean = true;
  errorMsg:string;
  isError:boolean = true;
  isLoading:boolean = false;
  constructor(private fb:FormBuilder,private activateRoute:ActivatedRoute,
    private route:Router,private passwordService:PasswordService) {

  }
  ngOnInit(){

      if(this.activateRoute.snapshot.queryParams['link']!=undefined){
      this.value={id:this.activateRoute.snapshot.queryParams['link']}
    }


    this.setPasswordForm= this.fb.group({
      "txtPassword":['',[Validators.required,Validators.minLength(8)]],
      "txtRePassword":['',Validators.required]
    }
    ,{
      validator: PasswordValidation.MatchPassword // your validation method
    })

    this.passwordService.checkTokenExpireSignUp(this.value).subscribe(res=>{
      if(res){
      }
    },
    (err)=>{
           if(err.err.status == "401"){
             this.errorMsg = "Password reset token is invalid or has expired.";
             this.showError();
             setTimeout(() => {
               this.route.navigate(['/forgotPassword'])
             }, 3000);
             return;
           }
             this.errorMsg = "Some Error Occured";
             this.showError();
    }
  )
  }


  get txtPassword()  {
    
     return this.setPasswordForm.controls.txtPassword
   }
   get txtRePassword()  {
   
     return this.setPasswordForm.controls.txtRePassword
   }

   submit(formValue){
     formValue.token = this.value.id;
     this.passwordService.confirmLogin(formValue).subscribe(res=>{
        this.successMsg = "Password Updated Succesfully";
        this.showSuccess();
        this.isLoading = false;
        setTimeout(() => {
          this.route.navigate(['/login'])
        }, 2000);
        
     },((err)=>{
       if(err.err.status == '401'){
        this.errorMsg = "Password reset token is invalid or has expired";
        this.showError();
        setTimeout(() => {
          this.route.navigate(['/forgotPassword'])
        }, 3000);
        this.isLoading = false;
       }
       else{
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
       }
    }))
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
