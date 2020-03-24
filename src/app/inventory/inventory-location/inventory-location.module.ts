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
import { InventoryLocationComponent } from './inventory-location.component';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { ModifyLocationComponent } from './modify-location/modify-location.component';
import { SharedModule } from '../../b2b-store/sharedModule.module';

export const routes = [
    {path: '', component: InventoryLocationComponent,
    children:[
        { path:'',redirectTo:'view'},
        { path:'view',component:ViewInventoryComponent},
        { path:'add', component: AddLocationComponent },
        { path:'modify', component: ModifyLocationComponent },
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
    MatSliderModule, MatTabsModule,MatProgressBarModule, SharedModule
  ],
  declarations: [InventoryLocationComponent,ViewInventoryComponent,ModifyLocationComponent
    ],
  providers:[DataTable,InputOutputService, InventoryService],
  exports:[AddLocationComponent]
})
export class InventoryLocationModule { }

