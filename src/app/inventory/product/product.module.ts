import { UserService } from './../../services/user.service';
import { LogisticsService } from './../../services/logistics.service';
import { ConfigurationService } from './../../services/configuration.service';
import { LoadersCssModule } from 'angular2-loaders-css';

import { ProductComponent } from './product.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table';
import { MatDialogModule } from '@angular/material/dialog';

import { ApplicationPipes } from '../../pipes/pipes.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import {
  MatButtonModule, MatInputModule,
  MatSelectModule, MatAutocompleteModule,
  MatDatepickerModule, MatFormFieldModule,
  MatCardModule, MatSliderModule, MatTabsModule,
  MatProgressBarModule, MatCheckboxModule
} from '@angular/material';
import { InputOutputService } from '../../services/inputOutput.service';
import { InventoryService } from '../../services/inventory.service';
import { ViewProductComponent } from './view-product/view-product.component';
// import { TestDirectives } from './add-product/test.directive';
import { AddProductComponent } from './add-product/add-product.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PermissionGaurd } from '../../services/permissionGaurd';
import { SetupService } from '../../services/setup.service';
import { CustomerService } from '../../services/customer.service';
import { PapaParseModule } from 'ngx-papaparse';
import { DialogComponent } from './dialog/dialog.component'
import { SharedModule } from '../../b2b-store/sharedModule.module';
export const routes = [
  {
    path: '', component: ProductComponent,
    children: [
      { path: '', redirectTo: 'view' },
      { path: 'view', component: ViewProductComponent },
      { path: 'add', component: AddProductComponent },
      { path: 'modify', component: ModifyProductComponent }
    ]
  }
];
@NgModule({
  imports: [FileUploadModule, ApplicationPipes,
    DataTableModule, MatDialogModule,
    Ng2TableModule,
    FormsModule, ReactiveFormsModule, LoadersCssModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule,
    MatSliderModule, MatTabsModule, MatProgressBarModule, MatCheckboxModule, PapaParseModule, SharedModule

  ],
  declarations: [ProductComponent, ViewProductComponent,
    ModifyProductComponent,
  ],
  entryComponents: [DialogComponent],
  providers: [DataTable, InputOutputService, InventoryService, ConfigurationService, LogisticsService,
    UserService, SetupService, CustomerService]
})

export class ProductModule {
  static routes = routes;
}
