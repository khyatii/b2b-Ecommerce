import { InputOutputService } from './../services/inputOutput.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { RouterModule } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { FormModule } from '../forms/forms.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatSliderModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { CurrenciesComponent } from './currencies/currencies.component';
import { FileUploadModule } from 'ng2-file-upload';
import { JqSparklineModule } from '../components/sparkline/sparkline.module';
import { AlertModule, TooltipModule, ButtonsModule, BsDropdownModule, PaginationModule } from 'ngx-bootstrap';
import { WidgetModule } from '../layout/widget/widget.module';
import { UtilsModule } from '../layout/utils/utils.module';
import { Ng2TableModule } from 'ng2-table';
import { DataTableModule, DataTable } from 'angular2-datatable';
import { ModifyCurrencyComponent } from './modify-currency/modify-currency.component';
import { AddCurrencyComponent } from './add-currency/add-currency.component';
import { TaxTypesComponent } from './tax-types/tax-types.component';
import { ModifytaxTypesComponent } from './modifytax-types/modifytax-types.component';
import { AddtaxTypesComponent } from './addtax-types/addtax-types.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { AddPaymentTermsComponent } from './add-payment-terms/add-payment-terms.component';
import { ModifyPaymentTermsComponent } from './modify-payment-terms/modify-payment-terms.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { ModifyPaymentMethodComponent } from './modify-payment-method/modify-payment-method.component';
import { SetupDefaultsComponent } from './setup-defaults/setup-defaults.component';
import { ConfigurationService } from '../services/configuration.service';
import { CurrencyPipe } from './add-currency/currency.pipe';

export const routes = [
  { path: '', component: ConfigurationComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'currency', component: CurrenciesComponent },
  { path: 'modifyCurrency', component: ModifyCurrencyComponent },
  { path: 'addCurrency', component: AddCurrencyComponent },
  { path: 'taxType', component: TaxTypesComponent },
  { path: 'modifyTaxType', component: ModifytaxTypesComponent },
  { path: 'addTaxType', component: AddtaxTypesComponent },
  { path: 'paymentTerms', component: PaymentTermsComponent },
  { path: 'addPaymentTerms', component: AddPaymentTermsComponent },
  { path: 'modifyPaymentTerms', component: ModifyPaymentTermsComponent },
  { path: 'paymentMethod', component: PaymentMethodComponent },
  { path: 'addpaymentMethod', component: AddPaymentMethodComponent },
  { path: 'modifypaymentMethod', component: ModifyPaymentMethodComponent },
  { path: 'default', component: SetupDefaultsComponent },

]
@NgModule({
  imports: [
    FileUploadModule,
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
    DataTableModule,
    CommonModule, FormModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule,
    MatDatepickerModule, MatSliderModule, MatRadioModule, MatCheckboxModule
  ],
  declarations: [ConfigurationComponent, CurrencyPipe, GeneralComponent, CurrenciesComponent, ModifyCurrencyComponent, AddCurrencyComponent, TaxTypesComponent,
    ModifytaxTypesComponent, AddtaxTypesComponent, PaymentTermsComponent, AddPaymentTermsComponent, ModifyPaymentTermsComponent, PaymentMethodComponent, AddPaymentMethodComponent, ModifyPaymentMethodComponent, SetupDefaultsComponent],
  providers: [DataTable, InputOutputService, ConfigurationService]
})
export class ConfigurationModule { }
