import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerDashboardRouting } from './seller-dashboard.routing';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { CreateProductsComponent } from './create-products/create-products.component';
import { HomeComponent } from './home/home.component';
import { MatStepperModule } from '@angular/material/stepper'; 
import { SharedModule } from '../b2b-store/sharedModule.module';
import { CustomerAndSupplierComponent } from './customer-and-supplier/customer-and-supplier.component';
import { ManageStockMovementsComponent } from './manage-stock-movements/manage-stock-movements.component';
import { AddSuppliersComponent } from './add-suppliers/add-suppliers.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CreatePoComponent } from './create-po/create-po.component'



@NgModule({
  imports: [
    CommonModule,
    SellerDashboardRouting,
    MatStepperModule,
    SharedModule
  ],
  declarations: [SellerDashboardComponent, CreateProductsComponent, HomeComponent, CustomerAndSupplierComponent, ManageStockMovementsComponent, AddSuppliersComponent, AddCustomerComponent, CreatePoComponent],
  exports:[]
})
export class SellerDashboardModule { 
  
}
