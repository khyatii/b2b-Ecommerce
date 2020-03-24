import { SignupUser } from './signup-user/signup-user.service';
import { VasSelectionService } from './services/vas-selection.service';

import { SucessPopupModule } from './sucess-popup/sucess-popup.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef} from '@angular/core';
import{LayoutModule} from '../app/layout/layout.module';
import { LoginModule} from '../app/login/login.module';
import{SignupModule} from '../app/signup-user/signup-user.module';
  import {LayoutLogisticModule} from '../app/layout-logistic/layout-logistic.module';
import {LoginLogisticModule} from '../app/login-logistic/loginLogistic.module';
import {SetupModule} from '../app/setup/setup.module'
import {LogisticRegistrationModule} from '../app/user-logistics/logistic-registration/logistic-registration.module';
/*
 * Platform and Environment providers/directives/pipes
 */
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { RecaptchaModule } from 'ng-recaptcha';
import { ClickOutsideModalModule } from 'click-outside-modal/click-oustide-modal.module';

import { AppRoutingModule } from './app.routes';
// App is our top level component
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { AppConfig } from './app.config';
import { ErrorComponent } from './error/error.component';
import { LoadersCssModule } from 'angular2-loaders-css';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatNativeDateModule, MatAutocompleteModule } from '@angular/material';
// import { RecaptchaModule } from 'ng2-recaptcha';
import { InvoiceComponent } from './invoice/invoice.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { CountriesService } from "./services/countries.service";
import { UserLogisticsService } from "./services/userLogistics.Service";
import { LoginGaurd } from "./services/loginGuard";
import { PermissionGaurd } from './services/permissionGaurd';
import { SetupService } from './services/setup.service';
import { InventoryService } from './services/inventory.service';
import { LoginLogisticGaurd } from './services/loginLogisticsGuard';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store/store';
import {MatStepperModule} from '@angular/material/stepper';



// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  AppConfig
];


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App,
    ErrorComponent,
    InvoiceComponent,
    StripePaymentComponent,
    ErrorPopupComponent,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    ReactiveFormsModule, SucessPopupModule,
    BrowserModule,
    FormsModule,LoginModule,LayoutModule,SignupModule,LayoutLogisticModule,LoginLogisticModule,
    LogisticRegistrationModule,  HttpModule,
    BrowserAnimationsModule,RecaptchaModule.forRoot(), Ng4LoadingSpinnerModule.forRoot(),
    MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatNativeDateModule, MatAutocompleteModule,
     LoadersCssModule,AppRoutingModule, NgReduxModule, MatStepperModule
   
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
     VasSelectionService, PermissionGaurd,
    APP_PROVIDERS, CountriesService, UserLogisticsService,
    LoginGaurd, LoginLogisticGaurd,
    SignupUser, SetupService, InventoryService, AuthService,AuthGuardService
  ],

})
export class AppModule {
  constructor (ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
}
}
