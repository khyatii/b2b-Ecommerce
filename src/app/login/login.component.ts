import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidation } from '../validators/emailValid';
import { AlphaNumericValidator } from '../validators/alphNumeric';
import { trigger, state, style, animate, transition } from '@angular/core';
import { LoginService } from './login.service';
import { NotFoundError } from '../apperrors/notfound';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'login',
  styleUrls: ['./login.style.scss'],
  templateUrl: './login.template.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(500)
      ]),
    ])

  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'login-page app'
  }
})
export class Login implements OnInit {
  loginForm: FormGroup
  errorMsg: string;
  isError: boolean = true;
  isData = false;

  constructor(private spinnerService: Ng4LoadingSpinnerService,private fb: FormBuilder, private loginService: LoginService, private route: Router) {

  }
  ngOnInit() {
    this.loginForm = this.fb.group({
      "email": ['', [Validators.required, EmailValidation.emailValid]],
      // "password":['',[Validators.required,Validators.minLength(8),AlphaNumericValidator.invalidAlphaNumeric]]
      "password": ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get email() {

    return this.loginForm.controls.email
  }
  get password() {

    return this.loginForm.controls.password
  }

  submit(formvalues) {
    // this.isData = true;
    this.spinnerService.show()
    this.loginService.postLogin(formvalues).subscribe((res) => {
      // this.isData = false;
      localStorage.setItem('email', res.email);
      localStorage.setItem('token',res.token);
      this.route.navigate(['/app/seller-layout'])
      this.spinnerService.hide()

    }, ((err) => {
      this.spinnerService.hide()
      if (err.err.status == "401") {
        this.errorMsg = "InValid Password.Please reset your Password";
        this.showError();
      }
      else if (err.err.status == "400") {
        this.errorMsg = "User Not Registered";
        this.showError();
        return;
      }
      else if (err.err.status == "403") {
        this.errorMsg = "Access forbidden";
        this.showError();
      }
      else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
    })
    )
  }

  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }
}
