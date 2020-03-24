import {Pipe, PipeTransform} from '@angular/core';

   @Pipe({name: 'category'})
   export class TestPipe implements PipeTransform {
     transform(categories: any, searchText: any): any {
        var returnedArray= categories.filter(function(category){
            return category.toLowerCase().indexOf(searchText.toLowerCase())==0 
        })
        if(searchText == null) return categories;
        
        if(returnedArray.length==0)
        return categories

        else if(returnedArray.length>0)
        return returnedArray
      
     }
   }