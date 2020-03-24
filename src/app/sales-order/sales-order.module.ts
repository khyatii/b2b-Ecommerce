import { ConfigurationService } from './../services/configuration.service';
import { MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatAutocompleteModule, MatSliderModule, MatCheckboxModule, MatTabsModule, MatSnackBar } from '@angular/material';
import { Ng2TableModule } from 'ng2-table';
import { UtilsModule } from './../layout/utils/utils.module';
import { WidgetModule } from './../layout/widget/widget.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { JqSparklineModule } from './../components/sparkline/sparkline.module';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FormModule } from '../forms/forms.module';
import { DataTable, DataTableModule } from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { ReturnsComponent } from './returns/returns.component';
import { CrowdSourcingComponent } from './crowd-sourcing/crowd-sourcing.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PendingReturnsComponent } from './returns/pending-returns/pending-returns.component';
import { CompletedReturnsComponent } from './returns/completed-returns/completed-returns.component';
import { PendingPurchaseComponent } from './purchase-order/pending-purchase/pending-purchase.component';
import { CompletedPurchaseComponent } from './purchase-order/completed-purchase/completed-purchase.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { ViewQuotationDetailsComponent } from './view-quotation-details/view-quotation-details.component';
import { ImageZoomModule } from 'angular2-image-zoom';
import { IssuePoSupplierComponent } from './issue-po-supplier/issue-po-supplier.component';
import { PendingPoComponent } from './purchase-order/pending-po/pending-po.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputOutputService } from './../services/inputOutput.service';
import { SalesOrderService } from "../services/sales-order.service";
import { ApplicationPipes } from '../pipes/pipes.module';
import { InvoicingBuyerComponent } from './purchase-order/invoicing-buyer/invoicing-buyer.component';
import { ViewReturnOrderComponent } from './view-return-order/view-return-order.component';
import { ViewCompletedReturnsComponent } from './returns/view-completed-returns/view-completed-returns.component';
import { InventoryService } from '../services/inventory.service';
import { CompanyDetailService } from '../services/company-details.services';
import { LogisticsService } from '../services/logistics.service';
import { RequestLogisticsServiceComponent } from './request-logistics-service/request-logistics-service.component';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PopupCancelQuotationComponent } from './popup-cancel-quotation/popup-cancel-quotation.component';
import { NotificationService } from '../services/notification.service';
import { EnquiryComponent } from './enquiry/enquiry.component';

export const routes = [


  { path: 'orders', loadChildren: './orders/orders.module#OrdersModule' },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'shipments', component: ShipmentsComponent },
  { path: 'buyerInvoice', component: InvoicingBuyerComponent },
  { path: 'returns', component: ReturnsComponent },
  { path: 'view-returns', component: ViewReturnOrderComponent },
  { path: 'crowdsourcing', component: CrowdSourcingComponent },
  { path: 'purchaseorder', component: PurchaseOrderComponent },
  { path: 'recievingGoods', loadChildren: './receving-good-deliverd/receving-good-deliverd.module#RecevingGoodDeliverdModule' },
  { path: 'quotationDetails', component: QuotationDetailsComponent },
  { path: 'viewQuotationDetails', component: ViewQuotationDetailsComponent },
  { path: 'issuePo', component: IssuePoSupplierComponent },
  { path: 'pendingPurchaseOrder', component: PendingPoComponent },
  { path: 'view-completed-returns', component: ViewCompletedReturnsComponent },
  { path: 'requestlogistics', component: RequestLogisticsServiceComponent },
  { path: 'pop-up', component: PopupCancelQuotationComponent },
  { path: 'enquiry', component: EnquiryComponent },
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
    ImageZoomModule,
    ApplicationPipes,
    MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatAutocompleteModule, MatSliderModule, MatCheckboxModule, MatTabsModule, MatTooltipModule,
  ],
  declarations: [InvoicesComponent, ShipmentsComponent, ReturnsComponent, PendingPurchaseComponent,
    CompletedPurchaseComponent, CrowdSourcingComponent, PurchaseOrderComponent, PendingReturnsComponent, CompletedReturnsComponent,
    QuotationDetailsComponent, IssuePoSupplierComponent, ViewQuotationDetailsComponent,
    PendingPoComponent, InvoicingBuyerComponent, ViewReturnOrderComponent,
    ViewCompletedReturnsComponent, RequestLogisticsServiceComponent, PopupCancelQuotationComponent, EnquiryComponent],


  providers: [DataTable, InputOutputService, MatSnackBar, LogisticsService, PurchaseOrderService,
    SalesOrderService, ConfigurationService, InventoryService, CompanyDetailService, NotificationService]

})
export class SalesOrderModule {
  static routes = routes;
}