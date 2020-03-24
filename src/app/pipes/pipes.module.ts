import { SearchPipes } from "./search-pipe";
import { NgModule } from '@angular/core';
import { SortPipe } from './sort.pipe';
@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [ 
        SearchPipes,SortPipe
    ],
    exports: [
        SearchPipes
    ]
  })
  export class ApplicationPipes {}