import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from '../../services/common.service';

@Injectable()
export class PasswordService extends CommonService {

  constructor(http: Http) {
    super(http);
  }

  postPassword(loginData) {
    return super.postValue(loginData, 'setPassword');
  }

  postLogisticPassword(loginData) {
    return super.postValue(loginData, 'logistics/setPassword');
  }

  checkTokenExpire(loginData) {
    return super.postValue(loginData, 'checkTokenExpire');
  }

  checkTokenExpireSignUp(data) {
    return super.postValue(data, 'checkTokenExpireSignUp');
  }

  confirmLogin(data) {
    return super.postValue(data, 'confirmLogin');
  }

  checkTokenExpireSignUpLogistic(data) {
    return super.postValue(data, 'logistics/checkTokenExpireSignUp');
  }

  checkTokenExpireLogistic(data) {
    return super.postValue(data, 'logistics/checkTokenExpireLogistic');
  }

  confirmLogisticLogin(data) {
    return super.postValue(data, 'logistics/confirmLogisticLogin');
  }


}
