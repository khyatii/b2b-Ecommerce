import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { AppError } from '../../apperrors/apperror';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.scss']
})
export class CustomerGroupComponent implements OnInit {
  customerServiceArray: any;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  permission;
  constructor(private customerService: CustomerService, private route: Router
    , private permissionService: PermissionService) { }

  ngOnInit() {
    this.customerService.getCustomerGroups().subscribe(res => {
      this.customerServiceArray = res;
    })
  }

  viewCustomerGroup(group) {
    let id = group._id;
    this.route.navigate(['/app/customers/view', { id }]);
  }

  modifyCustomerGroup(group) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        CustomersPermission: resp[0].txtCustomerManagement,
      }
      if (this.permission.CustomersPermission == 'rw') {
        let id = group._id;
        this.route.navigate(['/app/customers/modifyGroup', { id }]);
        this.successMsg = "Success";
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError();
      }
    })

  }

  addGroup() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        CustomersPermission: resp[0].txtCustomerManagement,
      }
      if (this.permission.CustomersPermission == 'rw') {
        this.route.navigate(['/app/customers/addGroup']);
        this.successMsg = "Success";
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
