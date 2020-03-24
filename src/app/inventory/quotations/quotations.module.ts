import { ViewRequestComponent } from './view-request/view-request.component';
import { CommonModule } from '@angular/common';
import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormModule } from '../../forms/forms.module';
import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table';
import { ApplicationPipes } from '../../pipes/pipes.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { InputOutputService } from '../../services/inputOutput.service';
import { InventoryService } from '../../services/inventory.service';
import { ViewProductComponent } from './view-product/view-product.component';
import { FileUploadModule } from 'ng2-file-upload';
import { QuotationsComponent } from './quotations.component';
import { RequestQuotationsComponent } from './request-quotations/request-quotations.component';
import { RequestQuotationTableComponent } from './request-quotation-table/request-quotation-table.component';
import { ConfigurationService } from './../../services/configuration.service';
import { SalesOrderService } from '../../services/sales-order.service';
import { MatDialogModule } from '@angular/material/dialog';
import { PopUpComponent } from './pop-up/pop-up.component';
import { ViewResponseComponent } from './view-response/view-response.component';
import { LogisticsService } from '../../services/logistics.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';
import { SharedModule } from '../../b2b-store/sharedModule.module';


export const routes = [
  {
    path: '', component: QuotationsComponent,
    children: [
      { path: '', redirectTo: 'request-quotation-table' },
      { path: 'request-quotations', component: RequestQuotationsComponent },
      { path: 'request-quotation-table', component: RequestQuotationTableComponent },
      { path: 'view-request', component: ViewRequestComponent },
      { path: 'view-response', component: ViewResponseComponent },
      { path: 'pop-up', component: PopUpComponent },
    ]
  }
];

@NgModule({
  imports: [FileUploadModule, ApplicationPipes,
    DataTableModule,
    Ng2TableModule,
    FormsModule, ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule,
    MatSliderModule, MatTabsModule, MatProgressBarModule, MatDialogModule, MatTooltipModule, MatCheckboxModule, SharedModule
  ],
  declarations: [
    QuotationsComponent, RequestQuotationTableComponent, ViewRequestComponent, PopUpComponent, ViewResponseComponent
  ],
  providers: [DataTable, InputOutputService, InventoryService, ConfigurationService,
    SalesOrderService, LogisticsService, CustomerService,NotificationService]
})
export class QuotationsModule {
  static routes = routes;
}
