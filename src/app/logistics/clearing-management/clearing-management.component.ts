import { Router } from '@angular/router';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-clearing-management',
  templateUrl: './clearing-management.component.html',
  styleUrls: ['./clearing-management.component.scss']
})
export class ClearingManagementComponent implements OnInit {

  clearingArray: Array<number> = [];
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  permission;
  searchText;
  successMsg;
    constructor(private logisticsService: LogisticsService,
    private route: Router, private permissionService: PermissionService) { }

  ngOnInit() {
    this.logisticsService.getClearingManagement().subscribe(res => {
      this.clearingArray = res;
    })
  }

  modify(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/logistics/modifyclearing', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  addClearing() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        this.route.navigate(['/app/logistics/addclearing']);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
    }, 2000);
  }
  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }

}
