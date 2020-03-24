import { Component, OnInit } from '@angular/core';
import { LogisticsService } from '../../services/logistics.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-approved-logistics-po',
  templateUrl: './approved-logistics-po.component.html',
  styleUrls: ['./approved-logistics-po.component.css']
})
export class ApprovedLogisticsPoComponent implements OnInit {

  completedWarehousePoArray = [];

  constructor(private spinnerService: Ng4LoadingSpinnerService,private logisticsService: LogisticsService) { }

  ngOnInit() {
    this.spinnerService.show()
    this.logisticsService.getcompletedWarehousePo().subscribe(res => {
      this.completedWarehousePoArray = res;
      this.spinnerService.hide()
    })

  }

}
