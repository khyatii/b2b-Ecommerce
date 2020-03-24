import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
@Injectable()


export class UserService extends CommonService {

  constructor(http: Http) {
    super(http);
  }

  getLogisticData() {
    return super.getValue('logistics/logisticData')
  }
  getCurrentLocations() {
    return super.getCurrentIpLocation();
  }
  contactSupplier(data) {
    return super.postValue(data, 'contactSupplier/postContactSupplier')
  }

  setUserData(data) {
    localStorage.setItem['user'] = {};
    localStorage.setItem['user']['email'] = data.email;
    localStorage.setItem['user']['token'] = data.token;
    localStorage.setItem['user']['type'] = data.token;
  }
  getUser() {
    return super.getValue('userData')
  }
  getContactSupplier() {
    return super.getValue('contactSupplier/getContactSupplier')
  }

  updateProfile(vals){
    console.log('vals iniside the servise', vals);
    return super.postValue(vals, 'update-profile');
  }
}
