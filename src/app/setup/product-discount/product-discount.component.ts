import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../services/setup.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-product-discount',
  templateUrl: './product-discount.component.html',
  styleUrls: ['./product-discount.component.scss']
})
export class ProductDiscountComponent implements OnInit {

  discountArray: Array<object>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  searchText:any;
  isError: boolean = true;
  value;
  permission;

  constructor(private setupService: SetupService, private route: Router,
    private permissionService: PermissionService) { }

  ngOnInit() {
    this.setupService.getDiscount().subscribe(res => {
      this.discountArray = res;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  add() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        InventoryPermission: resp[0].txtInventoryPermission,
      }
      if (this.permission.InventoryPermission == 'rw') {
        this.route.navigate(['/app/setup/adddiscount']);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  delete(objData, index) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        InventoryPermission: resp[0].txtInventoryPermission,
      }
      if (this.permission.InventoryPermission == 'rw') {
        var id = objData._id;
        this.value = { id };
        if (confirm(`Are you sure to delete Group ` + objData.customerGroupId.name + ` with Product ` + objData.productId.txtProductName + ` ?`)) {
          this.setupService.deleteDiscount(this.value).subscribe(dataany => {
            this.discountArray.splice(index, 1);
            this.successMsg = "Product Discount is Deleted"
          }, err => {
            this.errorMsg = "Some Error Occured";
            this.showError();
          })
        }
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
        InventoryPermission: resp[0].txtInventoryPermission,
      }
      if (this.permission.InventoryPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/setup/modifydiscount', { id }]);
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
