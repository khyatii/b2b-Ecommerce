import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
@Injectable()


export class CountriesService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }

    getCountries(){
      return super.getValue('countries');
    }
}
