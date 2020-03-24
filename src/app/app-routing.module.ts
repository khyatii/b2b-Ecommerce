import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { LoginGaurd } from "./services/loginGuard";
import { LoginLogisticGaurd } from './services/loginLogisticsGuard';
import { NgModule, ApplicationRef} from '@angular/core';
import {RouterModule,PreloadAllModules} from '@angular/router';

const ROUTES: Routes = [
//   { path: '', redirectTo: 'b2b-store', pathMatch: 'full' },
  {
    path: 'app', loadChildren: './layout/layout.module#LayoutModule', canActivate: [LoginGaurd],
  },
  {
    path: 'logistic', loadChildren: './layout-logistic/layout-logistic.module#LayoutLogisticModule', canActivate: [LoginLogisticGaurd],
  },
  {
    path: 'login', loadChildren: './login/login.module#LoginModule',

  },
  {
    path: 'loginlogistic', loadChildren: './login-logistic/loginLogistic.module#LoginLogisticModule',
  },
  
  {
    path: 'store', loadChildren: './b2b-store/b2b-store.module#B2bStoreModule',

  },
  {
    path: 'signupSeller', loadChildren: './signup-user/signup-user.module#SignupModule',

  },
  {
    path: 'logistics', loadChildren: './user-logistics/logistic-registration/logistic-registration.module#LogisticRegistrationModule',
  },
  
];
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class LazyRoutingModule { }
