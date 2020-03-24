import { Component, OnInit } from '@angular/core';
import { LogisticsService } from '../../services/logistics.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-pending-logistics-po',
  templateUrl: './pending-logistics-po.component.html',
  styleUrls: ['./pending-logistics-po.component.css']
})
export class PendingLogisticsPoComponent implements OnInit {

  pendingWarehousePoArray = [];

  constructor(private spinnerService: Ng4LoadingSpinnerService, private logisticsService: LogisticsService, private route: Router) { }

  ngOnInit() {
    this.spinnerService.show()
    this.logisticsService.getPendingWarehousePo().subscribe(res => {
      this.pendingWarehousePoArray = res;
      this.spinnerService.hide()
    })

  }

  accept(objData) {
    let id = objData._id;
    this.route.navigate(['/logistic/logisticsUser/accept-po', { id }]);
  }

}
