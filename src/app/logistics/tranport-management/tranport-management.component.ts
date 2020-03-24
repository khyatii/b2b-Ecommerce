import { Router } from '@angular/router';
import { LogisticsService } from './../../services/logistics.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';



@Component({
  selector: 'app-tranport-management',
  templateUrl: './tranport-management.component.html',
  styleUrls: ['./tranport-management.component.scss']
})
export class TranportManagementComponent implements OnInit {

  transportArray: Array<number> = [];
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
    this.logisticsService.getTransportManagement().subscribe(res => {
      this.transportArray = res;
    })
  }

  modify(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/logistics/modifytransportmanagement', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  addTransport() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        this.route.navigate(['/app/logistics/addtransportmanagement']);
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
