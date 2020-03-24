import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettlementFromVasComponent } from './settlement-from-vas/settlement-from-vas.component';
import { RouterModule } from '@angular/router';
import { SettlementFromLogisticsComponent } from './settlement-from-logistics/settlement-from-logistics.component';
import { SettlementFromSellerComponent } from './settlement-from-seller/settlement-from-seller.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../forms/forms.module';
import { JqSparklineModule } from '../components/sparkline/sparkline.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { WidgetModule } from '../layout/widget/widget.module';
import { Ng2TableModule } from 'ng2-table';
import { UtilsModule } from '../layout/utils/utils.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import {
  MatButtonModule, MatInputModule, MatSelectModule, MatAutocomplete, MatAutocompleteModule,
  MatDatepickerModule, MatSliderModule, MatTabsModule, MatFormFieldModule, MatCheckboxModule, MatTooltipModule, MatProgressBarModule, MatCardModule
} from '@angular/material';
import { PendingInvoiceComponent } from './settlement-from-seller/pending-invoice/pending-invoice.component';
import { SettelmentInvoiceComponent } from './settlement-from-seller/settelment-invoice/settelment-invoice.component';
import { PendingLogisticsInvoiceComponent } from './settlement-from-logistics/pending-logistics-invoice/pending-logistics-invoice.component';
import { ApprovedLogisticsInvoiceComponent } from './settlement-from-logistics/approved-logistics-invoice/approved-logistics-invoice.component';
import { PendingVasInvoiceComponent } from './settlement-from-vas/pending-vas-invoice/pending-vas-invoice.component';
import { ApprovedVasInvoiceComponent } from './settlement-from-vas/approved-vas-invoice/approved-vas-invoice.component';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceDetailsComponent } from './settlement-from-logistics/invoice-details/invoice-details.component';

export const routes = [
  { path: '', redirectTo: 'settelmentVAS', pathMatch: 'full' },
  { path: 'invoice-details', component: InvoiceDetailsComponent },
  { path: 'settlementVAS', component: SettlementFromVasComponent },
  { path: 'settlementFromSeller', component: SettlementFromSellerComponent },
  { path: 'settlementFromLogistics', component: SettlementFromLogisticsComponent },

]

@NgModule({
  imports: [
    CommonModule, FormModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    JqSparklineModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    WidgetModule,
    UtilsModule,
    Ng2TableModule,
    MatTabsModule,
    DataTableModule,
    MatCheckboxModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule, MatCardModule,
    MatSliderModule, MatProgressBarModule, MatTooltipModule,
  ],
  declarations: [SettlementFromVasComponent, SettlementFromSellerComponent, SettlementFromLogisticsComponent, PendingInvoiceComponent,
    SettelmentInvoiceComponent, PendingLogisticsInvoiceComponent, ApprovedLogisticsInvoiceComponent,
    PendingVasInvoiceComponent, ApprovedVasInvoiceComponent, InvoiceDetailsComponent],
  providers: [DataTable, InvoiceService]

})
export class InvoiceModule { }
