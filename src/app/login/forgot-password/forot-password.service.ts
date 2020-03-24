import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from '../../services/common.service';

@Injectable()
export class ForgotPasswordService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }
    postPassword(loginData){
      return super.postValue(loginData, 'forgotPasswordEmail');
    }
    postPasswordLogistics(loginData){
      return super.postValue(loginData, 'logistics/forgotPasswordLogistic');
    }
}
