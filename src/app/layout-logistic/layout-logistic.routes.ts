import { Routes, RouterModule }  from '@angular/router';
import { LayoutLogisticComponent } from './layout-logistic.component';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service'

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'logistic', component: LayoutLogisticComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    // { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
    { path: 'inbox', loadChildren: '../inbox/inbox.module#InboxModule' },
    { path: 'charts', loadChildren: '../charts/charts.module#ChartsModule' },
    { path: 'profile', loadChildren: '../profile/profile.module#ProfileModule' },
    { path: 'forms', loadChildren: '../forms/forms.module#FormModule' },
    { path: 'grid', loadChildren: '../grid/grid.module#GridModule' },
    { path: 'dashboard', loadChildren: '../widgets/widgets.module#WidgetsModule' },
    { path: 'extra', loadChildren: '../extra/extra.module#ExtraModule' },
    { path: 'inventory', loadChildren: '../inventory/inventory.module#InventoryModule' },
    { path: 'salesorders', loadChildren: '../sales-order/sales-order.module#SalesOrderModule' },
    { path: 'purchaseOrders', loadChildren: '../purchase-order/purchase-order.module#PurchaseOrderModule' },
    { path: 'customers', loadChildren: '../customers/customers.module#CustomersModule' },
    { path: 'vendors', loadChildren: '../vendors/vendors.module#VendorsModule' },
    { path: 'setup', loadChildren: '../setup/setup.module#SetupModule' },
    { path: 'logistics', loadChildren: '../logistics/logistics.module#LogisticsModule' },
    { path: 'vasselection', loadChildren: '../vasselection/vasselection.module#VasselectionModule' },
    { path: 'invoices', loadChildren: '../invoice/invoice.module#InvoiceModule' },
    { path: 'config', loadChildren: '../configuration/configuration.module#ConfigurationModule' },
    { path: 'companyDetails', loadChildren: '../comany-details/comany-details.module#ComanyDetailsModule' },
    { path: 'logisticsUser', loadChildren: '../user-logistics/user-logistics.module#UserLogisticsModule' },
  ],canActivate:[AuthGuard]}
];

export const ROUTES = RouterModule.forChild(routes);
