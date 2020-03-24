import { LogisticsService } from './../../services/logistics.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-insurance-management',
  templateUrl: './insurance-management.component.html',
  styleUrls: ['./insurance-management.component.scss']
})
export class InsuranceManagementComponent implements OnInit {

  insuranceArray: Array<number> = [];
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  permission;
  searchText;
  successMsg;

  constructor(private route: Router, private logisticsService: LogisticsService,
    private permissionService: PermissionService) { }

  ngOnInit() {
    this.logisticsService.getInsuranceManagement().subscribe(res => {
      this.insuranceArray = res;
    })
  }

  modify(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/logistics/modifyInsurance', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  addInsurance() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        LogisticsPermission: resp[0].txtLogisticsPermission,
      }
      if (this.permission.LogisticsPermission == 'rw') {
        this.route.navigate(['/app/logistics/addInsurance']);
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
