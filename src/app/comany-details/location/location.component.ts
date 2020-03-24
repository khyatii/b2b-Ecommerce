import { Router } from '@angular/router';
import { CompanyDetailService } from './../../services/company-details.services';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  addLocationArray: Array<number> = [];
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  permission;

  constructor(private companyDetailService: CompanyDetailService, private route: Router,
    private permissionService: PermissionService) { }

  ngOnInit() {
    this.companyDetailService.getLocation().subscribe(res => {
      this.addLocationArray = res
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }
  add() {
    this.route.navigate(['/app/companyDetails/addLocation']);
    // this.permissionService.getModulePermissions().subscribe(resp => {
    //
    //   this.permission = {
    //     SettingsPermission: resp[0].txtSettingsPermission,
    //   }
    //   if (this.permission.SettingsPermission == 'rw') {
    //     this.route.navigate(['/app/companyDetails/addLocation']);
    //   }
    //   else {
    //     this.errorMsg = "You Don't have the appropriate permission"
    //     this.showError()
    //   }
    // })
  }
  modify(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        SettingsPermission: resp[0].txtSettingsPermission,
      }
      if (this.permission.SettingsPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/companyDetails/modifyLocation', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError();
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
