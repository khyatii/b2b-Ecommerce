import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginLogisticComponent } from './login-logistic.component';
import { MatButtonModule, MatInputModule, MatCheckboxModule, MatCardModule } from '@angular/material';
import { LoginLogisticsService  } from './login-logistics.service';
import { ForgotPasswordService } from '../login/forgot-password/forot-password.service';
import { LogisticsSetPasswordComponent } from './logistics-set-password/logistics-set-password.component';
import { PasswordService } from '../login/set-password/set-password.service';
import { ConfirmLogisticLoginComponent } from './confirm-logistic-login/confirm-logistic-login.component';
import { ForgotPasswordLogisticsComponent } from './forgot-password-logistics/forgot-password-logistics.component';
import { LoadersCssModule } from 'angular2-loaders-css';

export const routes = [
  { path: 'loginlogistic', component: LoginLogisticComponent, pathMatch: 'full' },
  { path: 'forgotPasswordLogistic', component: ForgotPasswordLogisticsComponent },
  { path: 'setPasswordLogistics', component: LogisticsSetPasswordComponent },
  { path: 'confirmLogisticLogin', component: ConfirmLogisticLoginComponent },
];

@NgModule({
  declarations: [
    LoginLogisticComponent,ForgotPasswordLogisticsComponent,
    LogisticsSetPasswordComponent,ConfirmLogisticLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,LoadersCssModule,
    RouterModule.forChild(routes),MatButtonModule,MatInputModule,ReactiveFormsModule,MatCheckboxModule,MatCardModule],
  providers:[LoginLogisticsService,ForgotPasswordService,PasswordService]  
  
})
export class LoginLogisticModule {
  static routes = routes;
}
