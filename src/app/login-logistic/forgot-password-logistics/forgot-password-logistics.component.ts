import { Component, OnInit } from '@angular/core';
import { NotFoundError } from '../../apperrors/notfound';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from '../../login/forgot-password/forot-password.service';
import { EmailValidation } from '../../validators/emailValid';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-forgot-password-logistics',
  templateUrl: './forgot-password-logistics.component.html',
  styleUrls: ['./forgot-password-logistics.component.css']
})
export class ForgotPasswordLogisticsComponent implements OnInit {
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  setPasswordForm: FormGroup;

  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private fb: FormBuilder, private route: Router,
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
    this.spinnerService.show()
    this.isLoading = true
    this.ForgotPasswordService.postPasswordLogistics(formValue).subscribe(res => {
      this.spinnerService.hide()
      this.isLoading = false
      this.successMsg = "Reset Password Link has been sent on your Email";
      this.showSuccess();
      setTimeout(() => {
        this.isSuccess = true;
        this.route.navigate(['/loginlogistic'])
      }, 2000);
      this.isLoading = false;
    }, ((err) => {
      if (err instanceof NotFoundError) {
        this.errorMsg = "Email does not exist";
        this.showError();
        this.isLoading = false;
        return;
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
      }
    }))
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

