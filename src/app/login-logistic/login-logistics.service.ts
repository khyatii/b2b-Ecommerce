import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from '../services/common.service';
@Injectable()
export class LoginLogisticsService extends CommonService{

  constructor(http:Http) {
    super(http);
  }
  postLogin(loginData){
    return super.postValue(loginData, 'logistics/loginToken');
  }
}

