import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { AddServiceTypeComponent } from './add-service-type/add-service-type.component';
import { ModifyServiceTypeComponent } from './modify-service-type/modify-service-type.component';
import { SetupService } from '../../services/setup.service';
import { DataTable, DataTableModule } from 'angular2-datatable';
import { ApplicationPipes } from '../../pipes/pipes.module';
import { LogisticsTypeComponent } from './logistics-type/logistics-type.component';
import { AddLogisticsComponent } from './add-logistics/add-logistics.component';
import { ModifyLogisticsComponent } from './modify-logistics/modify-logistics.component';

export const routes = [
    { path: 'serviceType', component: ServiceTypeComponent },
    { path: 'add', component: AddServiceTypeComponent },
    { path: 'modify', component: ModifyServiceTypeComponent },
    { path: 'logisticsType', component: LogisticsTypeComponent },
    { path: 'addLogistics', component: AddLogisticsComponent },
    { path: 'modifyLogistics', component: ModifyLogisticsComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes),
        FormsModule, ReactiveFormsModule, CommonModule, DataTableModule, ApplicationPipes,
        MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule,
        MatDatepickerModule, MatFormFieldModule, MatCardModule,
        MatSliderModule, MatTabsModule, MatProgressBarModule,
    ],
    declarations: [ServiceTypeComponent, AddServiceTypeComponent, ModifyServiceTypeComponent,
         LogisticsTypeComponent, AddLogisticsComponent, ModifyLogisticsComponent],
    providers: [SetupService, DataTable]
})
export class LogisticServiceModule { }