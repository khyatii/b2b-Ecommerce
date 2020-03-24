import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { SignupUserComponent } from './signup-user/signup-user.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { LogisticRegistrationComponent } from './user-logistics/logistic-registration/logistic-registration.component';


export const ROUTES: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'app', loadChildren: '../layout/layout.module#LayoutModule'
  },
  {
    path: 'login', loadChildren: '../login/login.module#LoginModule'
  },
  {
    path: 'store', loadChildren: '../b2b-store/b2b-store.module#B2bStoreModule'
  },
  {
    path: 'logistics', component: LogisticRegistrationComponent
  },
  { path: 'signupSeller', loadChildren: '../signup-user/signup-user.module#SignupModule' },
  {
    path: 'error', component: ErrorComponent
  }, {
    path: '**', component: ErrorComponent
  }
  // { path: 'login', loadChildren: '../login/login.module#LoginModule' },

//   { path: 'app', loadChildren: '../layout/layout.module#LayoutModule', canActivate: [LoginGaurd], },
// { path: 'logistic', loadChildren: '../layout-logistic/layout-logistic.module#LayoutLogisticModule', canActivate: [LoginLogisticGaurd] },
// { path: 'login', loadChildren: '../login/login.module#LoginModule' },
// { path: 'loginlogistic', loadChildren: '../login-logistic/loginLogistic.module#LoginLogisticModule' },
// { path: 'store', loadChildren: '../b2b-store/b2b-store.module#B2bStoreModule' },
// { path: 'signupSeller', loadChildren: '../signup-user/signup-user.module#SignupModule' },
// { path: 'logistics', loadChildren: '../user-logistics/logistic-registration/logistic-registration.module#LogisticRegistrationModule' },

];
