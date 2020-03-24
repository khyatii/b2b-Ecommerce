import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table';
import { ApplicationPipes } from '../../pipes/pipes.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule } from '@angular/material';
import { InputOutputService } from '../../services/inputOutput.service';
import { InventoryService } from '../../services/inventory.service';
import { FileUploadModule } from 'ng2-file-upload';
import { InventoryLogisticLocationComponent } from './inventory-logistic-location.component';
import { ViewLogisticLocationComponent } from './view-logistic-location/view-logistic-location.component';
import { AddLogisticLocationComponent } from './add-logistic-location/add-logistic-location.component';
import { ModifyLogisticLocationComponent } from './modify-logistic-location/modify-logistic-location.component';

export const routes = [
    {path: '', component: InventoryLogisticLocationComponent,
    children:[
        { path:'',redirectTo:'view'},
        { path:'view',component:ViewLogisticLocationComponent},
        { path:'add', component: AddLogisticLocationComponent },
        { path:'modify', component: ModifyLogisticLocationComponent },
    ]}
  ];
@NgModule({
  imports: [FileUploadModule,ApplicationPipes,
    DataTableModule,
    Ng2TableModule,
    FormsModule ,ReactiveFormsModule,
    CommonModule,ApplicationPipes,
    RouterModule.forChild(routes),
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule,MatCardModule,
    MatSliderModule, MatTabsModule,MatProgressBarModule,
  ],
  declarations: [InventoryLogisticLocationComponent, ViewLogisticLocationComponent, AddLogisticLocationComponent, ModifyLogisticLocationComponent,
    ],
  providers:[DataTable,InputOutputService, InventoryService]
})
export class InventoryLogisticLocationModule { }

