import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadersCssModule } from 'angular2-loaders-css';
import { Login } from './login.component';
import { MatButtonModule, MatInputModule, MatCheckboxModule, MatCardModule } from '@angular/material';
import { LoginService } from './login.service';
import { ForgotPasswordComponent } from '../../app/login/forgot-password/forgot-password.component';
import { ForgotPasswordService } from '../../app/login/forgot-password/forot-password.service';
import { PasswordService } from '../../app/login/set-password/set-password.service';
import { SetPasswordComponent } from '../../app/login/set-password/set-password.component';
import { ConfirmLoginComponent } from '../../app/login/confirm-login/confirm-login.component';


export const routes = [{ 
  path: 'login',
  component: Login,
  // children: [
  //   { path: 'forgotPassword', component: ForgotPasswordComponent }, 

  //   { path: 'setPassword', component: SetPasswordComponent },
  //   ,]
},
{ path: 'setPassword', component: SetPasswordComponent },
{ path: 'forgotPassword', component: ForgotPasswordComponent }, 
{ path: 'confirmLogin', component: ConfirmLoginComponent }

];

@NgModule({
  declarations: [
    Login, ForgotPasswordComponent,SetPasswordComponent,ConfirmLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,LoadersCssModule,
    RouterModule.forChild(routes), MatButtonModule, MatInputModule,
    ReactiveFormsModule, MatCheckboxModule, MatCardModule],
  providers: [LoginService,ForgotPasswordService,PasswordService]

})
export class LoginModule {
  static routes = routes;
}
