import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import 'rxjs/add/operator/map';
import { Router } from "@angular/router";
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {

  currencyArray: Array<number> = [];
  currencyAll;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  permission;

  constructor(private configurationService: ConfigurationService,
    private route: Router, private permissionService: PermissionService) { }

  ngOnInit() {
    this.configurationService.getCurrency().subscribe(res => {
      this.currencyArray = res;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  deleteCurrency(values) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        SettingsPermission: resp[0].txtSettingsPermission,
      }
      if (this.permission.SettingsPermission == 'rw') {
        this.configurationService.deleteCurrency(values).subscribe(res => {
          this.successMsg = "Currency is added.";
          this.showSuccess();
        }, err => {
          this.errorMsg = "Some Error Occured";
          this.showError();
        })
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })

  }

  modifyCurrency(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        SettingsPermission: resp[0].txtSettingsPermission,
      }
      if (this.permission.SettingsPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/config/modifyCurrency', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  addCurrency() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        SettingsPermission: resp[0].txtSettingsPermission,
      }
      if (this.permission.SettingsPermission == 'rw') {
        this.route.navigate(['/app/config/addCurrency']);
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
