import { Routes, RouterModule }  from '@angular/router';
import { Layout } from './layout.component';
import { B2bStoreComponent } from './b2b-store.component';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { SubcategoryListingComponent } from './subcategory-listing/subcategory-listing.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchStringComponent } from './search-string/search-string.component';
import { ShowAllIndustriesComponent } from './show-all-industries/show-all-industries.component';
import {} from '../profile/profile.module'

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    { path: '', component: B2bStoreComponent,
    children:[
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {path:'home',loadChildren:'./home-page/home-page.module#HomePageModule'},
      {path:'product',loadChildren:'./store-product/store-product.module#StoreProductModule'},
      {path:'product-details',loadChildren:'./product-details/product-details.module#ProductDetailsModule'},
      {path:'categoryListing',component:CategoryListingComponent},
      {path:'subCategoryListing',component:SubcategoryListingComponent},
      {path:'search-results/:id',component:SearchResultsComponent},
      {path:'search-string',component: SearchStringComponent},
      {path:'industries', component:ShowAllIndustriesComponent},
      {path: 'profie', loadChildren:'../profile/profile.module#ProfileModule'}
    ]
   
  },
 
  ];

export const ROUTES = RouterModule.forChild(routes);
