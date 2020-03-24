import { CompanyDetailService } from './../services/company-details.services';
import { LoadersCssModule } from 'angular2-loaders-css';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatCheckboxModule, MatCardModule, MatOptionModule, MatSelectModule, MatNativeDateModule, MatAutocompleteModule } from '@angular/material';
import { LoginService } from './login.service';
import { SignupUserComponent } from './signup-user.component';
import { SignupUser } from './signup-user.service';
// import { RecaptchaModule } from 'ng2-recaptcha';
import { SucessPopupModule } from "../sucess-popup/sucess-popup.module";
import { ConfigurationService } from '../services/configuration.service';
import { SetupService } from '../services/setup.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { ClickOutsideModalModule } from 'click-outside-modal/click-oustide-modal.module';
import { ClickOutsideModule } from 'ng4-click-outside';



export const routes = [
  { path: 'signupSeller', component: SignupUserComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    SignupUserComponent
  ],
  imports: [ReactiveFormsModule,SucessPopupModule,
    CommonModule,LoadersCssModule,ClickOutsideModule,
    FormsModule,RecaptchaModule.forRoot(),
    RouterModule.forChild(routes),MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule,MatCardModule,MatNativeDateModule,MatAutocompleteModule,],
  providers:[SignupUser,ConfigurationService,CompanyDetailService,SetupService]  
  
})
export class SignupModule {
  static routes = routes;
}
