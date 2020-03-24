import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService {

  constructor(public auth:AuthService,private router:Router) { }
  canActivate():boolean{
    if(!this.auth.checkExpireToken()){
      this.router.navigate(['login']);
    }
    return true;
  }
}
