import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputOutputService } from '../../../services/inputOutput.service';
import { InventoryService } from '../../../services/inventory.service';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.css']
})
export class ViewInventoryComponent implements OnInit {

  array = [];
  locationArray: Array<object>;
  permission;
  isHide:boolean=false;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  constructor(private route: Router, private inventoryService: InventoryService,
    private permissionService: PermissionService) { }

  ngOnInit() {

    this.inventoryService.getLocation().subscribe(res => {
      this.locationArray = res;
    })
  }

  add() {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        InventoryPermission: resp[0].txtInventoryPermission,
      }
      if (this.permission.InventoryPermission == 'rw') {
        this.route.navigate(['/app/inventory/manage-inventory/add']);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  modifyProduct(objData) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        InventoryPermission: resp[0].txtInventoryPermission,
      }
      if (this.permission.InventoryPermission == 'rw') {
        let id = objData._id;
        this.route.navigate(['/app/inventory/manage-inventory/modify', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })
  }

  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }

}
