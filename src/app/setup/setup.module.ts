import { ConfigurationService } from '../services/configuration.service';
import { CustomerService } from '../services/customer.service';
import { InventoryService } from '../services/inventory.service';
import { FormModule } from './../forms/forms.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import "froala-editor/js/froala_editor.pkgd.min.js";
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { PriceListComponent } from './price-list/price-list.component';
import { ProductDiscountComponent } from './product-discount/product-discount.component';
import {
  MatButtonModule, MatInputModule, MatSelectModule,
  MatAutocompleteModule, MatDatepickerModule, MatTabsModule, MatSlideToggleModule, MatFormFieldModule,
  MatCardModule, MatSliderModule, MatProgressBarModule, MatCheckboxModule, MatRadioModule,
} from '@angular/material';
// import { TinymceModule } from 'angular2-tinymce';
import { InputOutputService } from '../services/inputOutput.service';
import { AddpricelistComponent } from './addpricelist/addpricelist.component';
import { ModifypricelistComponent } from './modifypricelist/modifypricelist.component';
import { ModifyDisountComponent } from './modify-disount/modify-disount.component';
import { AddNewdisountComponent } from './add-newdisount/add-newdisount.component';
import { CustomTemplatesComponent } from './custom-templates/custom-templates.component';
import { EmailTemplateComponent } from './custom-templates/email-template/email-template.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SmsTemplateComponent } from './custom-templates/sms-template/sms-template.component';
import { SetupService } from '../services/setup.service';
import { TemplateContentService } from './custom-templates/email-template/templateContent.service';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { ModifySubCategoryComponent } from './modify-sub-category/modify-sub-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ModifyCategoryComponent } from './modify-category/modify-category.component';
import { KeypressNumDirective } from '../keypress-num.directive';
import { IndustryComponent } from './industry/industry.component';
import { AddIndustryComponent } from './add-industry/add-industry.component';
import { ModifyIndustryComponent } from './modify-industry/modify-industry.component';
import { DataTable, DataTableModule } from 'angular2-datatable';
import { ApplicationPipes } from '../pipes/pipes.module';
import { ModifyEmailTemplateComponent } from './custom-templates/email-template/modify-email-template/modify-email-template.component';

export const routes = [
  // { path: '', redirectTo: 'product-category', pathMatch: 'full' },
  // { path: 'product-category', component: ProductCategoryComponent },
  // { path: 'product-sub-category', component: ProductSubCategoryComponent },
  { path: 'product-list', component: PriceListComponent },
  { path: 'product-discount', component: ProductDiscountComponent },
  { path: 'addpricelist', component: AddpricelistComponent },
  { path: 'modifypricelist', component: ModifypricelistComponent },
  { path: 'adddiscount', component: AddNewdisountComponent },
  { path: 'modifydiscount', component: ModifyDisountComponent },
  { path: 'templates', component: CustomTemplatesComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'industry', component: IndustryComponent },
  { path: 'addIndustry', component: AddIndustryComponent },
  { path: 'modifyIndustry', component: ModifyIndustryComponent },
  { path: 'addCategory', component: AddCategoryComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'modifyCategory', component: ModifyCategoryComponent },
  { path: 'modifySubCategory', component: ModifySubCategoryComponent },

  { path: 'subCategory', component: SubCategoryComponent },
  { path: 'addSubCategory', component: AddSubCategoryComponent },
  { path: 'modifyEmailTemplate', component: ModifyEmailTemplateComponent },
  { path: 'modifypricelist', component: ModifypricelistComponent },
  { path: 'service-catalogue', loadChildren: './service-catalogue/service-catalogue.module#ServiceCatalogueModule' },
  { path: 'logistic-unit', loadChildren: './logistic-unit/logistic-unit.module#LogisticUnitModule' },
  { path: 'logistic-service', loadChildren: './logistic-service/logistic-service.module#LogisticServiceModule' }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, FormModule, DataTableModule, ApplicationPipes,
    MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule,
    MatTabsModule, MatSlideToggleModule, MatFormFieldModule, MatCardModule,
    MatSliderModule, MatProgressBarModule, MatCheckboxModule, MatRadioModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
    // TinymceModule.withConfig({})
  ],
  declarations: [PriceListComponent,
    ProductDiscountComponent, AddpricelistComponent, ModifypricelistComponent,
    ModifyDisountComponent, AddNewdisountComponent, CustomTemplatesComponent,
    EmailTemplateComponent, SubscriptionComponent, SmsTemplateComponent, KeypressNumDirective, CategoryComponent,
    SubCategoryComponent, AddSubCategoryComponent, ModifySubCategoryComponent,
    AddCategoryComponent, ModifyCategoryComponent, IndustryComponent, AddIndustryComponent,
    ModifyIndustryComponent,
    ModifyEmailTemplateComponent],

  providers: [InputOutputService, SetupService, TemplateContentService, InventoryService,
    ConfigurationService, CustomerService, DataTable]
})
export class SetupModule {
  static routes = routes;
}
