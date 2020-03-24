import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogisticsService } from '../../../services/logistics.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-pending-transport-po',
  templateUrl: './pending-transport-po.component.html',
  styleUrls: ['./pending-transport-po.component.css']
})
export class PendingTransportPoComponent implements OnInit {

  constructor(private spinnerService: Ng4LoadingSpinnerService,private route:Router,private logisticsService:LogisticsService) { }

  pendingTransportPoArray=[];

  ngOnInit() {
    this.spinnerService.show()
    this.logisticsService.getPendingTransportPo().subscribe(res => {
      this.pendingTransportPoArray = res;
      this.spinnerService.hide()
    })
  }
  locationinfo(a){
  }

  accept(objData){
    let id = objData._id;
		this.route.navigate(['/logistic/logisticsUser/transport-purchase',{id}]);
  }

}
