import { Router } from '@angular/router';
import { LogisticsService } from './../../services/logistics.service';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.scss']
})

export class WarehouseManagementComponent implements OnInit {

  warehouseArray = [];
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  permission;
  searchText;
  successMsg;

  constructor(private logisticsService: LogisticsService,
    private route: Router, private permissionService: PermissionService) {
  }

  ngOnInit(): void {
    this.logisticsService.getWarehouseManagement().subscribe(res => {
      this.warehouseArray = res;
    }, (err) => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  addWarehouse() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        this.route.navigate(['/app/logistics/addwarehouse']);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  modify(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/logistics/modifywarehouse', { id }]);
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
