
import { SignupUser } from './../signup-user/signup-user.service';
import { InputOutputService } from './../services/inputOutput.service';
import { DataTable, DataTableModule } from 'angular2-datatable';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from './../forms/forms.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocomplete, MatAutocompleteModule, MatDatepickerModule, MatSliderModule, MatRadioModule, MatTabsModule, MatCheckboxModule, MatSlideToggleModule } from '@angular/material';
import { LogisticsPoComponent } from './logistics-po/logistics-po.component';
import { PendingLogisticsPoComponent } from './pending-logistics-po/pending-logistics-po.component';
import { ApprovedLogisticsPoComponent } from './approved-logistics-po/approved-logistics-po.component';
import { AcceptPoComponent } from './accept-po/accept-po.component';
import { TransportPoComponent } from './transport-po/transport-po.component';
import { PendingTransportPoComponent } from './transport-po/pending-transport-po/pending-transport-po.component';
import { ApprovedPoComponent } from './transport-po/approved-po/approved-po.component';
import { ClearingagentPoComponent } from './clearingagent-po/clearingagent-po.component';
import { PendingClearingPoComponent } from './clearingagent-po/pending-clearing-po/pending-clearing-po.component';
import { ApprovedClearingPoComponent } from './clearingagent-po/approved-clearing-po/approved-clearing-po.component';
import { InsuranceAgentPoComponent } from './insurance-agent-po/insurance-agent-po.component';
import { InsurancePendingPoComponent } from './insurance-agent-po/insurance-pending-po/insurance-pending-po.component';
import { InsuranceApprovedPoComponent } from './insurance-agent-po/insurance-approved-po/insurance-approved-po.component';
import { UserLogisticsComponent } from './user-logistics.component';
import { InsurancePoComponent } from './insurance-agent-po/insurance-po/insurance-po.component';
import { ClearingPoComponent } from './clearingagent-po/clearing-po/clearing-po.component';
import { TransportPurchaseorderComponent } from './transport-po/transport-purchaseorder/transport-purchaseorder.component';
import { UserLogisticsService } from '../services/userLogistics.Service';
import { LogisticsService } from '../services/logistics.service';
// import { MultipleLogisticsPoComponent } from './multiple-logistics-po/multiple-logistics-po.component';
// import { MultiplePendingPoComponent } from './multiple-logistics-po/multiple-pending-po/multiple-pending-po.component';
// import { MultipleApprovedPoComponent } from './multiple-logistics-po/multiple-approved-po/multiple-approved-po.component';
// import { MultipleAcceptPoComponent } from './multiple-logistics-po/multiple-accept-po/multiple-accept-po.component';
import { ApproveWarehouseRequstComponent } from './approve-warehouse-requst/approve-warehouse-requst.component';
// import { MultiTransportComponent } from './multiple-logistics-po/multi-transport/multi-transport.component';
import { NotificationService } from '../services/notification.service';

export const routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'logistics-po', component: LogisticsPoComponent },
  { path: 'accept-po', component: AcceptPoComponent },
  { path: 'transport-po', component: TransportPoComponent },
  { path: 'clearingAgent-po', component: ClearingagentPoComponent },
  { path: 'insuranceAgent-po', component: InsuranceAgentPoComponent },
  { path: 'insurance-po', component: InsurancePoComponent },
  { path: 'clearing-po', component: ClearingPoComponent },
  { path: 'transport-purchase', component: TransportPurchaseorderComponent },
  { path: 'Warehouse', component: LogisticsPoComponent },
  { path: 'Transport', component: TransportPoComponent },
  { path: 'Clearing', component: ClearingagentPoComponent },
  { path: 'Insurance', component: InsuranceAgentPoComponent },

  // { path: 'accept-multipleLogistic', component: MultipleAcceptPoComponent },
  { path: 'approve-Logistic-request', component:ApproveWarehouseRequstComponent} //to modify the request of buyers when buyer add logistic
]

@NgModule({
  imports: [
    CommonModule, FormModule, ReactiveFormsModule,
    RouterModule.forChild(routes), DataTableModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule,
    MatSliderModule, MatRadioModule, MatTabsModule, MatCheckboxModule, MatSlideToggleModule
  ],
  declarations: [LogisticsPoComponent, PendingLogisticsPoComponent, ApprovedLogisticsPoComponent,
    AcceptPoComponent, TransportPoComponent, PendingTransportPoComponent, ApprovedPoComponent,
    ClearingagentPoComponent, PendingClearingPoComponent, ApprovedClearingPoComponent,
    InsuranceAgentPoComponent, InsurancePendingPoComponent, InsuranceApprovedPoComponent, UserLogisticsComponent,
    InsurancePoComponent, ClearingPoComponent, TransportPurchaseorderComponent, ApproveWarehouseRequstComponent,
    ],

  providers: [DataTable, InputOutputService, UserLogisticsService,
    SignupUser, LogisticsService,NotificationService]
})
export class UserLogisticsModule { }
