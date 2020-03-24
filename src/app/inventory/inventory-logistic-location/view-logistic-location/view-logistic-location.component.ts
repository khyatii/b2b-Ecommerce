import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-view-logistic-location',
  templateUrl: './view-logistic-location.component.html',
  styleUrls: ['./view-logistic-location.component.css']
})
export class ViewLogisticLocationComponent implements OnInit {

  locationArray: Array<object>
  logisticsType;
  isHide:boolean=false;
  constructor(private route: Router, private userService: UserService,
    private inventoryService: InventoryService) { }

  ngOnInit() {
    this.inventoryService.getLogisticsLocation().subscribe(res => {
      this.locationArray = res;
    })
    this.userService.getLogisticData().subscribe(res => {
      if (res[0].logistics_type.length === 1) {
        this.logisticsType = res[0].logistics_type;
      } else {
        this.logisticsType = 'Multiple Logistics';
      }
    })
  }

  modifyProduct(objData) {
    let id = objData._id;
    this.route.navigate(['/logistic/inventory/manage-logistic-inventory/modify', { id }]);
  }
}
