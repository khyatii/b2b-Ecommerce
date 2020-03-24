import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PermissionService } from './permission.service';

@Injectable()

export class PermissionGaurd implements CanActivate {

    constructor(private router: Router, private permissionService: PermissionService) {
    }

    canActivate() {
        // var permission
        // if (this.getPermission()) {
            // this.router.navigate(['./login']);
        // }
        // else {
            return true
        // }
    }

    // getPermission() {
        // this.permissionService.subject.subscribe(res=>{
        // return true
        // })
    // }
}

