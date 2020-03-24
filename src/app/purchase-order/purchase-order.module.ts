import { MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatAutocompleteModule, MatSliderModule, MatCheckboxModule, MatTabsModule, MatSnackBar } from '@angular/material';
import { Ng2TableModule } from 'ng2-table';
import { UtilsModule } from './../layout/utils/utils.module';
import { WidgetModule } from './../layout/widget/widget.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { JqSparklineModule } from './../components/sparkline/sparkline.module';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormModule } from './../forms/forms.module';
import { DataTable, DataTableModule } from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { IssuePurchaseOrderComponent } from './issue-purchase-order/issue-purchase-order.component';
import { PurchaseOrderComponent } from './purchase-order.component';
import { NotificationService } from '../services/notification.service';

export const routes = [
  { path: '', component: PurchaseOrderComponent },
  { path: 'issuePurchaseOrder', component: IssuePurchaseOrderComponent },
];

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
    DataTableModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatAutocompleteModule, MatSliderModule, MatCheckboxModule, MatTabsModule, MatTooltipModule,
  ],

  declarations: [ PurchaseOrderComponent,IssuePurchaseOrderComponent
    ],

  providers: [DataTable, PurchaseOrderService, MatSnackBar,NotificationService]
})
export class PurchaseOrderModule {
  static routes = routes;
}
