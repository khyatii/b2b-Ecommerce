import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-seller-managemnet-table',
  templateUrl: './seller-managemnet-table.component.html',
  styleUrls: ['./seller-managemnet-table.component.css']
})
export class SellerManagemnetTableComponent implements OnInit {

  sellerManagementArray: Array<number> = [];
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  permission;

  constructor(private customerService: CustomerService,
    private route: Router, private permissionService: PermissionService) { }

  ngOnInit() {
    this.customerService.getAllSupplier().subscribe(res => {
      this.sellerManagementArray = res;
    })
  }
  add() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        VendorsPermission: resp[0].VendorsPermission,
      }
      if (this.permission.VendorsPermission == 'rw') {
        this.route.navigate(['/app/vendors/sellermanagement']);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }
  modifySupplier(supplier) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        VendorsPermission: resp[0].VendorsPermission,
      }
      if (this.permission.VendorsPermission == 'rw') {
        let id = supplier._id;
        this.route.navigate(['/app/vendors/modifySellermanagement', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  dateFormat(value) {
    let temp = new Date(value);
    let year = temp.getFullYear();
    let month = temp.getMonth() + 1;
    let date = temp.getDate();
    return value = month + '/' + date + '/' + year;
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
