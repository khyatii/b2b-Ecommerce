import { Component, OnInit } from '@angular/core';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-clearing-po',
  templateUrl: './pending-clearing-po.component.html',
  styleUrls: ['./pending-clearing-po.component.css']
})
export class PendingClearingPoComponent implements OnInit {

  pendingClearingPoArray = [];

  constructor(private userLogisticsService: UserLogisticsService, private route: Router) { }

  ngOnInit() {
    this.userLogisticsService.getpendingClearingPo().subscribe(res => {
      this.pendingClearingPoArray = res;
    })
  }
  accept(objData) {
    let id = objData._id;
    this.route.navigate(['/logistic/logisticsUser/clearing-po', { id }]);
  }

}
