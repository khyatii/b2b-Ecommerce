import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();

@Injectable()
export class AuthService {

  constructor() { }
  checkExpireToken(){
    let token = localStorage.getItem('token');
    let isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }
}
