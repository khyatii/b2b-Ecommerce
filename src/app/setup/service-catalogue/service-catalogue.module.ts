import { ServiceCatalogueComponent } from './service-catalogue.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ViewServiceCatalogueComponent } from './view-service-catalogue/view-service-catalogue.component';
import { AddServiceCatalogueComponent } from './add-service-catalogue/add-service-catalogue.component';
import { ModifyServiceCatalogueComponent } from './modify-service-catalogue/modify-service-catalogue.component';
import { CommonModule } from '@angular/common';

export const routes = [
    {path: '', component: ServiceCatalogueComponent,
    children:[
        { path:'',redirectTo:'view'},
        { path:'view',component:ViewServiceCatalogueComponent},
        { path:'add', component: AddServiceCatalogueComponent },
        { path:'modify', component: ModifyServiceCatalogueComponent },
    ]}
  ];
@NgModule({
  imports: [RouterModule.forChild(routes),
    FormsModule,ReactiveFormsModule,CommonModule,
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule,MatCardModule,
    MatSliderModule, MatTabsModule,MatProgressBarModule,
  ],
  declarations: [ServiceCatalogueComponent,ViewServiceCatalogueComponent, AddServiceCatalogueComponent, ModifyServiceCatalogueComponent
    ],
  providers:[]
})
export class ServiceCatalogueModule { }