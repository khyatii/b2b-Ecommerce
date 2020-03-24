import { SalesOrderService } from './../services/sales-order.service';
import { CompanyDetailService } from './../services/company-details.services';
// import { ClickOutsideModule } from 'ng4-click-outside';
import { LoadersCssModule } from 'angular2-loaders-css';
import { FormModule } from './../forms/forms.module';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocomplete, MatAutocompleteModule,
   MatDatepickerModule, MatSliderModule, MatTabsModule, MatFormFieldModule } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table';
import { UtilsModule } from './../layout/utils/utils.module';
import { WidgetModule } from './../layout/widget/widget.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JqSparklineModule } from './../components/sparkline/sparkline.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { InputOutputService } from '../services/inputOutput.service';
import { FileUploadModule } from 'ng2-file-upload';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { InvoiceComponent } from "./invoice/invoice.component";
import { StockUpdateComponent } from './stock-update/stock-update.component';
import { InvoicePoComponent } from './invoice-po/invoice-po.component';
import { InvoiceCreditnoteComponent } from './invoice-creditnote/invoice-creditnote.component';
import { DeliveryNoteComponent } from './delivery-note/delivery-note.component';
import { InventoryService } from '../services/inventory.service';
import { ApplicationPipes } from '../pipes/pipes.module';
import { InventoryComponent } from './inventory.component';
import { StockTakeComponent } from './stock-take/stock-take.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { LogisticsService } from '../services/logistics.service';

export const routes = [
  { path: '', component:InventoryComponent,
  children:[
  { path: '', redirectTo: 'product', pathMatch: 'full' },
  { path: 'product',  loadChildren: './product/product.module#ProductModule'},
  { path: 'stock', component: StockComponent },
  { path: 'quotations', loadChildren: './quotations/quotations.module#QuotationsModule' },
  { path: 'search-product', component: SearchProductComponent },
  { path: 'manage-inventory', loadChildren: './inventory-location/inventory-location.module#InventoryLocationModule' },
  { path: 'manage-logistic-inventory', loadChildren: './inventory-logistic-location/inventory-logistic-location.module#InventoryLogisticLocationModule' },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'stock-take', component: StockTakeComponent },
  { path: 'stock-update', component: StockUpdateComponent },
  { path: 'invoice-po', component: InvoicePoComponent },
  { path: 'invoice-creditnote', component: InvoiceCreditnoteComponent },
  { path: 'deliverynote', component: DeliveryNoteComponent },
  ]},

];

@NgModule({
  imports: [FileUploadModule,
    CommonModule,FormModule ,ReactiveFormsModule,
    RouterModule.forChild(routes),
    JqSparklineModule,
    FormsModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    WidgetModule,
    UtilsModule,LoadersCssModule,
    Ng2TableModule,
    DataTableModule,
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule,MatCardModule,
    MatSliderModule, MatTabsModule,ApplicationPipes,MatProgressBarModule,MatTooltipModule,

  ],
  declarations: [InventoryComponent,
    StockComponent,
    SearchProductComponent,
    InvoiceComponent,
    StockUpdateComponent,
    InvoicePoComponent,
    InvoiceCreditnoteComponent,
    DeliveryNoteComponent,
    StockTakeComponent,



  ],
  providers:[DataTable,InputOutputService, InventoryService, CompanyDetailService,
    SalesOrderService,LogisticsService]
})

export class InventoryModule {
  static routes = routes;
 }
