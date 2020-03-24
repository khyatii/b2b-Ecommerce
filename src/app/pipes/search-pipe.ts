import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'search'})
export class SearchPipes implements PipeTransform {
  

  transform(search: any, searchText: any): any {
      var dataReturned=[]
      if(searchText == null) return search;
    
    search.filter(function(search){
      let keepgoing:boolean = true;
      return Object.keys(search).map(function(key){ 
        if((Number.isInteger(search[key]))||(search[key]==null)||(key == "imageFile")||(search[key]=="approvalStatus")
        ||(key == "document")||(key == "txtProductCategory")||(key == "txtProductSubCategory")){
          return;
        }
        if((search[key].toLowerCase().indexOf(searchText.toLowerCase()) > -1) && (keepgoing==true)){
          dataReturned.push(search) ;
          keepgoing = false;
        }            
      })
    })
    return dataReturned;
  }
}