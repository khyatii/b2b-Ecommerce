import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SidenavComponent} from './sidenav/sidenav.component'
import { RouterModule } from '@angular/router';
import { AddLocationComponent } from '../inventory/inventory-location/add-location/add-location.component' 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule,
    MatSelectModule, MatAutocompleteModule,
    MatDatepickerModule, MatFormFieldModule,
    MatCardModule, MatSliderModule, MatTabsModule,
    MatProgressBarModule, MatCheckboxModule,
    MatSnackBarModule, MatRadioModule} from '@angular/material';



import { InputOutputService } from '../services/inputOutput.service';
import { TourComponentComponent } from '../inventory/product/tour-component/tour-component.component';
import { LoadersCssModule } from 'angular2-loaders-css';
import { AddProductComponent } from '../inventory/product/add-product/add-product.component';

import { UserService } from '../services/user.service';
import { LogisticsService } from '../services/logistics.service';
import { ConfigurationService } from '../services/configuration.service';
import { Ng2TableModule } from 'ng2-table';
import { MatDialogModule } from '@angular/material';
import { ApplicationPipes } from '../pipes/pipes.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { InventoryService } from '../services/inventory.service';

import { FileUploadModule } from 'ng2-file-upload';
import { PermissionGaurd } from '../services/permissionGaurd';
import { selectDirective } from '../inventory/product/add-product/select.directive';
import { SetupService } from '../services/setup.service';
import { DialogComponent } from '../inventory/product/dialog/dialog.component';
import { CustomerService } from '../services/customer.service';
import { PapaParseModule } from 'ngx-papaparse';

// things

import { TestDirectives } from '../inventory/product/add-product/test.directive';
import { TestPipe } from '../inventory/product/add-product/test.pipe';
import { InvitationComponent } from '../customers/invitation/invitation.component';
import { SellerManagementComponent } from '../vendors/seller-management/seller-management.component';
import { RequestQuotationsComponent } from '../inventory/quotations/request-quotations/request-quotations.component';
import { SalesOrderService } from '../services/sales-order.service';
import { ViewOrdersComponent } from '../sales-order/orders/view-orders/view-orders.component';




@NgModule({
imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule, MatInputModule, MatSelectModule,
     MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, 
     MatSliderModule, MatTabsModule, MatProgressBarModule, LoadersCssModule,
    
    FileUploadModule,ApplicationPipes,
    DataTableModule,MatDialogModule,
    Ng2TableModule,
    FormsModule ,ReactiveFormsModule,LoadersCssModule,
    CommonModule,
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule,MatCardModule,
    MatSliderModule, MatTabsModule,MatProgressBarModule,MatCheckboxModule,PapaParseModule, MatSnackBarModule, MatRadioModule
],
declarations: [
    //components
    SidenavComponent,
    AddLocationComponent,
    AddProductComponent,
    TourComponentComponent, 
    DialogComponent,
    selectDirective,
    TestDirectives,
    selectDirective,
    TestPipe,
    InvitationComponent,
    SellerManagementComponent,
    RequestQuotationsComponent,
    ViewOrdersComponent],
exports: [
    //export thos components
    SidenavComponent,
    AddLocationComponent,
    AddProductComponent,
    TourComponentComponent,
    DialogComponent,
    InvitationComponent,
    SellerManagementComponent,
    RequestQuotationsComponent,
    ViewOrdersComponent
],
  entryComponents: [DialogComponent],
providers:[InputOutputService, DataTable,InputOutputService, InventoryService, ConfigurationService, LogisticsService,
    UserService,SetupService,CustomerService, PermissionGaurd, SalesOrderService]
})
export class SharedModule {

}