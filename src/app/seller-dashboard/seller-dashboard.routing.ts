import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellerDashboardComponent } from './seller-dashboard.component';
import { CreateProductsComponent } from './create-products/create-products.component';
import { HomeComponent } from './home/home.component';
import { ManageStockMovementsComponent } from './manage-stock-movements/manage-stock-movements.component';
import { CustomerAndSupplierComponent } from './customer-and-supplier/customer-and-supplier.component'
import { AddSuppliersComponent } from './add-suppliers/add-suppliers.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CreatePoComponent } from './create-po/create-po.component';

const routes: Routes = [
    {
        path: '', component:SellerDashboardComponent ,
        children: [
            { path: '', component: HomeComponent},
            { path: 'create-products', component: CreateProductsComponent },
            { path: 'customer-and-supplier', component: CustomerAndSupplierComponent },
            { path:'manage-stock', component:ManageStockMovementsComponent},
            { path: 'add-suppliers', component: AddSuppliersComponent},
            { path: 'add-customer', component:AddCustomerComponent },
            { path: 'create-po', component:CreatePoComponent}
        ]
    },

];
export const SellerDashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);