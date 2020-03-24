import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { B2bStoreComponent } from './b2b-store.component';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ROUTES } from './b2b-store.routes';
import { StoreFooterComponent } from './store-footer/store-footer.component';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { SubcategoryListingComponent } from './subcategory-listing/subcategory-listing.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchStringComponent } from './search-string/search-string.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ContactSupplierComponent } from './contact-supplier/contact-supplier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './sharedModule.module';
import { ShowAllIndustriesComponent } from './show-all-industries/show-all-industries.component';


@NgModule({
  imports: [
    CommonModule, MatButtonModule, MatInputModule, MatAutocompleteModule, MatFormFieldModule,
    MatMenuModule, MatGridListModule, MatDialogModule, FormsModule, ReactiveFormsModule, SharedModule,
    ROUTES
  ],
  declarations: [B2bStoreComponent, HeaderComponent, StoreFooterComponent,
    CategoryListingComponent, SubcategoryListingComponent, SearchResultsComponent,
    SearchStringComponent, ContactSupplierComponent, ShowAllIndustriesComponent],
  entryComponents: [
    ContactSupplierComponent
  ]

})
export class B2bStoreModule { }
