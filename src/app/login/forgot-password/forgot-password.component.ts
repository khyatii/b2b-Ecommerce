import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotFoundError } from '../../apperrors/notfound';
import { ForgotPasswordService } from './forot-password.service';
import { EmailValidation } from '../../validators/emailValid';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  setPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private route: Router,
    private ForgotPasswordService: ForgotPasswordService) { }

  ngOnInit() {
    this.setPasswordForm = this.fb.group({
      "txtEmail": ['', [Validators.required, EmailValidation.emailValid]],

    })
  }

  get txtEmail() {

    return this.setPasswordForm.controls.txtEmail
  }

  submit(formValue) {

    this.isLoading = true
    this.ForgotPasswordService.postPassword(formValue).subscribe(res => {

      this.isLoading = false
      this.successMsg = "Reset Password Link has been sent on your Email";
      this.showSuccess();
      setTimeout(() => {
        this.isSuccess = true;
        this.route.navigate(['login'])
      }, 2000);
      this.isLoading = false;
    }, (err: Error) => {
      if (err instanceof NotFoundError) {
        this.errorMsg = "Email does not exist";
        this.showError();
        this.isLoading = false;
        return;
      }
      this.errorMsg = "Some Error Occured";
      this.showError();
      this.isLoading = false;
    })
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
    }, 2000);
  }

  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }
}

