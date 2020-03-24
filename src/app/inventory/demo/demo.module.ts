import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DemoComponent } from './demo.component';
import { FormModule } from '../../forms/forms.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table';
import { ApplicationPipes } from '../../pipes/pipes.module';
import { DataTableModule } from 'angular2-datatable';
import { MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatDatepickerModule, MatFormFieldModule, MatCardModule, MatSliderModule, MatTabsModule, MatProgressBarModule } from '@angular/material';

export const routes = [
  {path: '', component: DemoComponent, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [ApplicationPipes,
    DataTableModule,
    Ng2TableModule,
    FormsModule ,ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule,MatCardModule,
    MatSliderModule, MatTabsModule,MatProgressBarModule,
  ],
})
export class DemoModule {
  static routes = routes;
}


