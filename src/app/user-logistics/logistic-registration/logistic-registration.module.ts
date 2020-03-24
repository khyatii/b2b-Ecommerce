// import { ClickOutsideModalModule } from 'click-outside-modal/click-oustide-modal.module';
import { LoadersCssModule } from 'angular2-loaders-css';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatCheckboxModule, MatCardModule, MatOptionModule, MatSelectModule, MatNativeDateModule, MatAutocompleteModule } from '@angular/material';
import { SignupUser } from '../../signup-user/signup-user.service';
// import { RecaptchaModule } from 'ng2-recaptcha';
import { SucessPopupModule } from "../../sucess-popup/sucess-popup.module";
import { SetupService } from '../../services/setup.service';
import { LogisticRegistrationComponent } from './logistic-registration.component';
import { UserLogisticsService } from '../../services/userLogistics.Service';
import { RecaptchaModule } from 'ng-recaptcha';


export const routes = [
    { path: 'logistics', component: LogisticRegistrationComponent, pathMatch: 'full' }
];

@NgModule({
    declarations: [
        LogisticRegistrationComponent
    ],
    imports: [ReactiveFormsModule, SucessPopupModule,
        CommonModule, LoadersCssModule,
        FormsModule, RecaptchaModule.forRoot(),
        RouterModule.forChild(routes), MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatNativeDateModule, MatAutocompleteModule,],

    providers: [SignupUser, UserLogisticsService, SetupService]

})
export class LogisticRegistrationModule {
    static routes = routes;
}