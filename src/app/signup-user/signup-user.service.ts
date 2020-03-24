
import { CommonService } from '../services/common.service';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { NotFoundError } from '../apperrors/notfound'
import { DuplicateError } from '../apperrors/duplicateError'
import { AppError } from '../apperrors/apperror'
import { Observable } from "rxjs/Observable";
import { Url } from '../common/serverurl.class';
@Injectable()


export class SignupUser extends CommonService {
  private cities = [];
  constructor(http: Http) {
    super(http);
  }
  postsignup(value) {
    return super.postValue(value, 'trader-registration');
  }

  getCountries() {
    let headers = new Headers();
    headers.append("Access-Control-Allow-Origin", '*');
    headers.append('Authorization', '054a687c5755e22ee8ff91303d538540aaacfaa8');
    headers.append('X-CSRFToken', 'bYe1DbntAm5CLtQ8WE5x0vQNuEqPSG9cpUU8mZXnSz2kcRt5wshVBJFicU1jHbNw');
    headers.append('content-type', 'application/json')
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`http://35.154.11.53/countries/`, options)
      .map(res => res.json())
      .catch((err) => {
        if (err.status == 404)
          return Observable.throw(new NotFoundError())

        else{
              return Observable.throw(new AppError(err))
        }

      })
  }

  getCountry() {
    let headers = new Headers();

    let options = new RequestOptions({ headers: headers });
    return this.http.get(`assets/country.json`, options)
  }

  getCites(country) {
    let headers = new Headers();

    let options = new RequestOptions({ headers: headers });
    return this.http.get(`assets/cities.json`, options).map(res => {
      let city = res.json();
      return city.filter(function (item) {
        return item.country === country.code
      })
    })

  }

  getCurrencyCodes() {
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`assets/currencyCunt.json`, options).map(res => {
      let currency = res.json();
      return currency
    })
  }
}
