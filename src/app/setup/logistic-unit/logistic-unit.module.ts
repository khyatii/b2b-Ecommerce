import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseUnitComponent } from './warehouse-unit/warehouse-unit.component';
import { TransportUnitComponent } from './transport-unit/transport-unit.component';
import { InsuranceUnitComponent } from './insurance-unit/insurance-unit.component';
import { ClearingUnitComponent } from './clearing-unit/clearing-unit.component';
import { ViewWarehouseUnitComponent } from './view-warehouse-unit/view-warehouse-unit.component';
import { ViewTransportUnitComponent } from './view-transport-unit/view-transport-unit.component';
import { ViewClearingUnitComponent } from './view-clearing-unit/view-clearing-unit.component';
import { ViewInsuranceUnitComponent } from './view-insurance-unit/view-insurance-unit.component';

export const routes = [
    { path: 'warehouse', component: WarehouseUnitComponent },
    { path: 'Transport', component: TransportUnitComponent },
    { path: 'Clearing', component: ClearingUnitComponent },
    { path: 'Insurance', component: InsuranceUnitComponent },
    { path: 'ViewWarehouse', component: ViewWarehouseUnitComponent },
    { path: 'ViewTransport', component: ViewTransportUnitComponent },
    { path: 'ViewClearing', component: ViewClearingUnitComponent },
    { path: 'ViewInsurance', component: ViewInsuranceUnitComponent },
    // children:[
    //     { path:'Warehouse',component:WarehouseUnitComponent},
    //     { path:'Transport', component: TransportUnitComponent },
    //     { path:'Clearing', component: ClearingUnitComponent },
    //     { path:'Insurance', component: InsuranceUnitComponent },
    // ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes),
        FormsModule, ReactiveFormsModule, CommonModule,
        MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule,
        MatSliderModule, MatTabsModule, MatProgressBarModule,
    ],
    declarations: [
        WarehouseUnitComponent,
        TransportUnitComponent,
        InsuranceUnitComponent,
        ClearingUnitComponent,
        ViewWarehouseUnitComponent,
        ViewTransportUnitComponent,
        ViewClearingUnitComponent,
        ViewInsuranceUnitComponent],
    providers: []
})
export class LogisticUnitModule { }