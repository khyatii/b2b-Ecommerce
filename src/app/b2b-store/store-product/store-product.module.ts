import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreProductComponent } from "./store-product.component";
import { RouterModule } from "@angular/router";

export const routes = [
  { path: '', component: StoreProductComponent}]

@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),MatListModule,MatCardModule,MatButtonModule
  ],
  declarations: [StoreProductComponent]
})
export class StoreProductModule { }
