import { Component, OnInit } from '@angular/core';
import { LogisticsService } from '../../../services/logistics.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-approved-po',
  templateUrl: './approved-po.component.html',
  styleUrls: ['./approved-po.component.css']
})
export class ApprovedPoComponent implements OnInit {

  constructor(private spinnerService: Ng4LoadingSpinnerService,private logisticsService: LogisticsService) { }
  completedTransportPoArray = [];

  ngOnInit() {
    this.spinnerService.show()
    this.logisticsService.getCompletedTransportPo().subscribe(res => {
      this.completedTransportPoArray = res;
      this.spinnerService.hide()
    })
  }

}
