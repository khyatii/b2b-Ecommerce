import { Router } from '@angular/router';
import { CustomerService } from './../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { InputOutputService } from '../../services/inputOutput.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {
  customerArray = [];
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  permission;
  constructor(private customerService: CustomerService,
    private route: Router, private permissionService: PermissionService) { }

  ngOnInit() {
    this.customerService.getAllCustomer().subscribe(res => {
      this.customerArray = res;
    })
  }
  addCustomer() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        InventoryPermission: resp[0].txtInventoryPermission,
        SettingsPermission: resp[0].txtSettingsPermission,
        CustomersPermission: resp[0].txtCustomerManagement,
        LogisticsPermission: resp[0].txtLogisticsPermission,
        // txtStockPermission:resp[0].txtStockPermission,
        // txtReportsPermission:resp[0].txtReportsPermission,
      }
      if (this.permission.CustomersPermission == 'rw') {
        this.route.navigate(['/app/customers/invite']);
        this.successMsg = "Success";
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  addInvitation() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        CustomersPermission: resp[0].txtCustomerManagement,
      }
      if (this.permission.CustomersPermission == 'rw') {
        this.route.navigate(['/app/customers/invite-customer']);
        this.successMsg = "Success";
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  modifyCustomer(customer) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        CustomersPermission: resp[0].txtCustomerManagement,
      }
      if (this.permission.CustomersPermission == 'rw') {
        let id = customer._id;
        this.route.navigate(['/app/customers/modifyCustomer', { id }]);
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
