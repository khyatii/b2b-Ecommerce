import { LoadersCssModule } from 'angular2-loaders-css';
import { ReactiveFormsModule,FormControl} from '@angular/forms';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { VasformComponent } from './vasform.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export const routes = [
  { path: '', component: VasformComponent,},
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), MatButtonModule, MatInputModule, ReactiveFormsModule,
    LoadersCssModule,
  ],
  declarations: [VasformComponent]
})
export class VasformModule { }
