import { Injectable }     from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()

export class LoginGaurd implements CanActivate {

constructor(private router:Router){}

canActivate() {

    if (!localStorage.getItem('email')) {
        this.router.navigate(['./login']);
    }
    else {
        return true
    }
   
}
}