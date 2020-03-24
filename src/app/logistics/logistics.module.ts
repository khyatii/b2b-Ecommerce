import { LoadersCssModule } from 'angular2-loaders-css';
import { LogisticsService } from './../services/logistics.service';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { FormModule } from './../forms/forms.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocomplete, MatAutocompleteModule, MatDatepickerModule, MatSliderModule, MatRadioModule } from '@angular/material';
import { LogisticsComponent } from './logistics.component';
import { WarehouseManagementComponent } from './warehouse-management/warehouse-management.component';
import { RouterModule } from '@angular/router';
import { LogisticsSearchComponent } from './logistics-search/logistics-search.component';
import { AddwarehouseComponent } from './addwarehouse/addwarehouse.component';
import { ModifywarehouseComponent } from './modifywarehouse/modifywarehouse.component';
import { TranportManagementComponent } from './tranport-management/tranport-management.component';
import { AddTransportComponent } from './add-transport/add-transport.component';
import { ModifyTransportComponent } from './modify-transport/modify-transport.component';
import { ClearingManagementComponent } from './clearing-management/clearing-management.component';
import { AddClearingComponent } from './add-clearing/add-clearing.component';
import { ModifyClearingComponent } from './modify-clearing/modify-clearing.component';
import { InsuranceManagementComponent } from './insurance-management/insurance-management.component';
import { ModifyInsuranceComponent } from './modify-insurance/modify-insurance.component';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { InputOutputService } from '../services/inputOutput.service';
import { WarehouseServiceComponent } from './warehouse-service/warehouse-service.component';
import { ApplicationPipes } from '../pipes/pipes.module';
import { UserLogisticsService } from '../services/userLogistics.Service';

export const routes = [
  {path:'',redirectTo: 'warehouse', pathMatch: 'full'},
  { path: 'warehouse',component: WarehouseManagementComponent},
  { path: 'logisticssearch',component: LogisticsSearchComponent},
  { path: 'transportmanagement',component: TranportManagementComponent},
  { path: 'modifytransportmanagement',component: ModifyTransportComponent},
  { path: 'addtransportmanagement',component: AddTransportComponent},
  { path: 'addwarehouse',component: AddwarehouseComponent},
  { path: 'modifywarehouse',component: ModifywarehouseComponent},
  { path: 'clearing',component: ClearingManagementComponent},
  { path: 'addclearing',component: AddClearingComponent},
  { path: 'modifyclearing',component: ModifyClearingComponent},
  { path: 'insuranceMangement',component: InsuranceManagementComponent},
  { path: 'addInsurance',component: AddInsuranceComponent},
  { path: 'modifyInsurance',component: ModifyInsuranceComponent},
  { path: 'warehouseService',component: WarehouseServiceComponent},
]

@NgModule({
  imports: [
    CommonModule,FormModule ,ReactiveFormsModule,FormsModule,LoadersCssModule,
    RouterModule.forChild(routes),DataTableModule,ApplicationPipes,
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatSliderModule,MatRadioModule,
  ],
  declarations: [
    LogisticsComponent,
    WarehouseManagementComponent,
    LogisticsSearchComponent,
    AddwarehouseComponent,
    ModifywarehouseComponent,
    TranportManagementComponent,
    AddTransportComponent,
    ModifyTransportComponent,
    ClearingManagementComponent,
    AddClearingComponent,
    ModifyClearingComponent,
    InsuranceManagementComponent,
    ModifyInsuranceComponent,
    AddInsuranceComponent,
    WarehouseServiceComponent],

    providers:[InputOutputService, DataTable, LogisticsService,UserLogisticsService]
})
export class LogisticsModule { }
