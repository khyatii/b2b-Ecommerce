
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormModule } from '../../forms/forms.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table';
import { ApplicationPipes } from '../../pipes/pipes.module';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule } from '@angular/material';
import { InputOutputService } from '../../services/inputOutput.service';
import { InventoryService } from '../../services/inventory.service';
import { OrdersComponent } from './orders.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { AddordersComponent } from './addorders/addorders.component';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { ReturnOrderComponent } from './return-order/return-order.component';
import { RecevingGoodDeliverdComponent } from './receving-good-deliverd.component';
import { ViewAllGoodsComponent } from './view-all-goods/view-all-goods.component';
import { ViewRecievingGoodDelieveredComponent } from './view-recieving-good-delievered/view-recieving-good-delievered.component';
export const routes = [
    {path: '', component: RecevingGoodDeliverdComponent,
    children:[
        {path:'',redirectTo:'view'},
        { path:'view',component:ViewAllGoodsComponent},
        {path:'viewRecievingGoods',component:ViewRecievingGoodDelieveredComponent},
        
        // { path:'addorders',component:AddordersComponent},
        // { path:'cancelOrder',component:CancelOrderComponent},
        // {path:'returnOrder',component:ReturnOrderComponent},  
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
    MatSliderModule, MatTabsModule,MatProgressBarModule,
  ],
  declarations: [ 
    RecevingGoodDeliverdComponent, ViewAllGoodsComponent,ViewRecievingGoodDelieveredComponent
  ],
  providers:[DataTable,InputOutputService, InventoryService]
})

export class RecevingGoodDeliverdModule { static routes = routes; }
