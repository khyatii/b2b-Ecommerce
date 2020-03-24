import { LoadersCssModule } from 'angular2-loaders-css';
import { VasSelectionService } from './../services/vas-selection.service';
import { InputOutputService } from './../services/inputOutput.service';
import { MatButtonModule, MatInputModule, MatCardModule,MatSelectModule } from '@angular/material';
import 'jquery-ui/ui/sortable.js';

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterModule } from '@angular/router';
import { VasselectionComponent } from './vasselection.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { RecaptchaModule } from 'ng2-recaptcha';
import { VastableComponent } from './vastable/vastable.component';
import { SubscribeVasComponent } from './subscribe-vas/subscribe-vas.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { VasServicesComponent } from './vas-services/vas-services.component';
import { ViewVasServicesComponent } from './view-vas-services/view-vas-services.component';
import {  DataTableModule } from 'angular2-datatable';
import { ModifyVasComponent } from './modify-vas/modify-vas.component';
import { PlanSubscribeComponent } from './plan-subscribe/plan-subscribe.component';

export const routes = [
  { path: '', component: VasselectionComponent , children: [
  { path: 'vasform', loadChildren: './vasform/vasform.module#VasformModule' },
],

  },{path:'vassubscribe',component: SubscribeVasComponent },
  {path:'vasservices',component: VasServicesComponent },
  {path:'viewvas',component:ViewVasServicesComponent},
  {path:'modifyVas',component:ModifyVasComponent},
  {path:'subsplan',component:PlanSubscribeComponent}
  ]

@NgModule({
  
  imports: [ CommonModule, RouterModule.forChild(routes),ReactiveFormsModule,RecaptchaModule.forRoot(), 
  MatButtonModule,MatInputModule,MatCardModule,LoadersCssModule,FormsModule,MatSelectModule,DataTableModule
  ],
  declarations: [ VasselectionComponent, VastableComponent, SubscribeVasComponent, VasServicesComponent, ViewVasServicesComponent, ModifyVasComponent, PlanSubscribeComponent, ],
  providers: [InputOutputService,VasSelectionService]
})


export class VasselectionModule {
  static routes = routes;
 }
