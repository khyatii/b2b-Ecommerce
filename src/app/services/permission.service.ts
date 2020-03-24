import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable()


export class PermissionService extends CommonService {
    constructor(http:Http) {
        super(http);
      }

    getPermissions(data) {
        return super.postValue(data,'notification/getPermissions')
    }
    getModulePermissions() {
        return super.getValue('notification/getModulePermissions')
    }
   
}    