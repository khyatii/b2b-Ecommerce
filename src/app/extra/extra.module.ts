import 'fullcalendar/dist/fullcalendar.js';
import 'jquery-ui/ui/draggable.js';
import 'magnific-popup/dist/jquery.magnific-popup.min.js';
import 'shufflejs/dist/shuffle.js';
import 'moment/moment.js';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertModule, TooltipModule,
  ButtonsModule, BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { Invoice } from './invoice/invoice.component';
// import { AgmCoreModule } from 'angular2-google-maps/core';

export const routes = [
  {path: '', redirectTo: 'invoice', pathMatch: 'full'},
  
  {path: 'invoice', component: Invoice},
  
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipe
    Invoice,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule,
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    // })
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ExtraModule {
  static routes = routes;
}
