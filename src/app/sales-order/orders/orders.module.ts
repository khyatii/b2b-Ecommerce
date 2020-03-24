
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormModule } from '../../forms/forms.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table';
import { ApplicationPipes } from '../../pipes/pipes.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { InputOutputService } from '../../services/inputOutput.service';
import { InventoryService } from '../../services/inventory.service';
import { OrdersComponent } from './orders.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { AddordersComponent } from './addorders/addorders.component';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { ReturnOrderComponent } from './return-order/return-order.component';
import { ViewProductDetailsComponent } from './view-product-details/view-product-details.component';
import { SharedModule } from '../../b2b-store/sharedModule.module';

export const routes = [
    {path: '', component: OrdersComponent,
    children:[
        {path:'',redirectTo:'view'},
        { path:'view',component:ViewOrdersComponent},
        { path:'addorders',component:AddordersComponent},
        { path:'cancelOrder',component:CancelOrderComponent},
        {path:'returnOrder',component:ReturnOrderComponent},
        {path:'viewProductDetails',component:ViewProductDetailsComponent},
    ]
  }
  ];
@NgModule({
  imports: [ApplicationPipes,
    DataTableModule,
    Ng2TableModule,
    FormsModule ,ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule,MatCardModule,
    MatSliderModule, MatTabsModule,MatProgressBarModule,MatCheckboxModule, SharedModule
  ],
  declarations: [
    OrdersComponent,AddordersComponent, CancelOrderComponent,ReturnOrderComponent, ViewProductDetailsComponent
  ],
  providers:[DataTable,InputOutputService, InventoryService]
})

export class OrdersModule { static routes = routes; }
