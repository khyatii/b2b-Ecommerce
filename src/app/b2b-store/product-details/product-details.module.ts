import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatInputModule, MatFormFieldModule,MatListModule,MatIconModule } from '@angular/material';
import { ProductDetailsComponent } from "./product-details.component";
import { ProductDescriptionComponent } from './product-description/product-description.component';
import { ProductIntrestedComponent } from './product-intrested/product-intrested.component';
import { CarouselModule } from 'ngx-bootstrap'
export const routes = [
  { path: '', component: ProductDetailsComponent}]

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), MatButtonModule,MatInputModule,MatFormFieldModule,MatIconModule,CarouselModule.forRoot()
  ],
  declarations: [ProductDetailsComponent, ProductDescriptionComponent, ProductIntrestedComponent]
})
export class ProductDetailsModule { }
