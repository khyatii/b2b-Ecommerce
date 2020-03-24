
import { LoadersCssModule } from 'angular2-loaders-css';
import { InputOutputService } from './../services/inputOutput.service';
import { MatButtonModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MatSnackBarModule, MatRadioModule, MatDatepickerModule, MatSliderModule } from '@angular/material';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table';
import { UtilsModule } from './../layout/utils/utils.module';
import { WidgetModule } from './../layout/widget/widget.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { JqSparklineModule } from './../components/sparkline/sparkline.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormModule } from './../forms/forms.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { RouterModule } from '@angular/router';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { AddNewgroupComponent } from './add-newgroup/add-newgroup.component';
import { ModifyGroupComponent } from './modify-group/modify-group.component';
import { InvitationComponent } from './invitation/invitation.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomerService } from '../services/customer.service';
import { ViewGroupComponent } from './view-group/view-group.component';
import { ModifyCustomerfromGroupComponent } from './modify-customerfrom-group/modify-customerfrom-group.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { ModifyCustomerComponent } from './modify-customer/modify-customer.component';
import { InviteCustomerComponent } from './invite-customer/invite-customer.component';
import { CompanyDetailService } from '../services/company-details.services';
import { ConfigurationService } from '../services/configuration.service';
import { SharedModule } from '../b2b-store/sharedModule.module';  

export const routes = [
  { path: '', component: CustomersComponent },
  { path: 'customerGroup', component: CustomerGroupComponent },
  { path: 'addGroup', component: AddNewgroupComponent },
  { path: 'modifyGroup', component: ModifyGroupComponent },
  { path: 'invite', component: InvitationComponent },
  { path: 'customer-profile', component: CustomerProfileComponent },
  { path: 'view', component: ViewGroupComponent },
  { path: 'modify', component: ModifyCustomerfromGroupComponent },
  { path: 'allCustomer', component: CustomerTableComponent },
  { path: 'modifyCustomer', component: ModifyCustomerComponent },
  { path: 'invite-customer', component: InviteCustomerComponent },

]
@NgModule({
  imports: [
    CommonModule, FormModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    JqSparklineModule,
    FormsModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    WidgetModule,
    UtilsModule,
    Ng2TableModule,
    DataTableModule, LoadersCssModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatSnackBarModule,
    MatRadioModule, MatDatepickerModule, MatSliderModule, SharedModule
  ],
  declarations: [CustomersComponent, CustomerGroupComponent, AddNewgroupComponent, ModifyGroupComponent, CustomerProfileComponent,
    ViewGroupComponent, ModifyCustomerfromGroupComponent, CustomerTableComponent, ModifyCustomerComponent, InviteCustomerComponent],
  providers: [DataTable, InputOutputService, CustomerService,CompanyDetailService,ConfigurationService
  ]
})
export class CustomersModule {
  static routes = routes;
}
