import { Component, OnInit } from '@angular/core';
import { UserLogisticsService } from '../../../services/userLogistics.Service';

@Component({
  selector: 'app-approved-clearing-po',
  templateUrl: './approved-clearing-po.component.html',
  styleUrls: ['./approved-clearing-po.component.css']
})
export class ApprovedClearingPoComponent implements OnInit {

  completedArray = [];
  

  constructor(private userLogisticsService: UserLogisticsService) { }

  ngOnInit() {
    this.userLogisticsService.getapprovedClearingPo().subscribe(res => {
      this.completedArray = res;
    })
  }

}
