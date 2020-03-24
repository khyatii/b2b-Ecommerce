import { LoadersCssModule } from 'angular2-loaders-css';
import { MatButtonModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MatSnackBarModule, MatRadioModule, MatDatepickerModule, MatSliderModule, MatDialogModule } from '@angular/material';
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
import { RouterModule } from '@angular/router';
import { SupplierSearchComponent } from './supplier-search/supplier-search.component';
import { SellerManagemnetTableComponent } from './seller-managemnet-table/seller-managemnet-table.component';
import { VendorsComponent } from './vendors.component';
import { SellerManagementComponent } from './seller-management/seller-management.component';
import { ModifySellerManagementComponent } from './modify-seller-management/modify-seller-management.component';
import { InputOutputService } from '../services/inputOutput.service';
import { InventoryService } from '../services/inventory.service';
import { ConfigurationService } from '../services/configuration.service';
import { SalesOrderService } from '../services/sales-order.service';
import { SetupService } from '../services/setup.service';
import { CustomerService } from '../services/customer.service';
import { PopUpRequestQuotationComponent } from './pop-up-request-quotation/pop-up-request-quotation.component';
import { CompanyDetailService } from '../services/company-details.services';
import { PermissionService } from '../services/permission.service';
import { SharedModule } from '../b2b-store/sharedModule.module';

export const routes = [
  { path: '', component: VendorsComponent },
  { path: 'suppliersearch', component: SupplierSearchComponent },
  { path: 'sellermanagementtable', component: SellerManagemnetTableComponent },
  { path: 'sellermanagement', component: SellerManagementComponent },
  { path: 'modifySellermanagement', component: ModifySellerManagementComponent },
  { path:'pop-up',component:PopUpRequestQuotationComponent},
]
@NgModule({
  imports: [
    CommonModule, FormModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    JqSparklineModule,MatDialogModule,
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
    MatRadioModule, MatDatepickerModule, MatSliderModule,
    SharedModule
  ],
  declarations: [VendorsComponent,SupplierSearchComponent,SellerManagemnetTableComponent,ModifySellerManagementComponent, PopUpRequestQuotationComponent],
  providers: [InputOutputService,InventoryService,ConfigurationService,SalesOrderService,
    SetupService,CustomerService,DataTable,CompanyDetailService,PermissionService]
})
export class VendorsModule {
  static routes = routes;
}
