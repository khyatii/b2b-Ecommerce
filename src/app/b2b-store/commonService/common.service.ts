import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Url } from '../../common/serverurl.class';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
 clickedSubcategoryId;
  constructor(private http: Http,private route:Router) {  
  }
  private data = new BehaviorSubject<any>(null);
  public data$ = this.data.asObservable();

  setState(state: any) { 
    this.data.next(state);
    this.data = new BehaviorSubject<any>(state);
    this.route.navigateByUrl('/b2b-store/search-results');
  }
  

}
