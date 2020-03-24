import { Component, OnInit } from '@angular/core';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-pending-po',
  templateUrl: './insurance-pending-po.component.html',
  styleUrls: ['./insurance-pending-po.component.css']
})
export class InsurancePendingPoComponent implements OnInit {

  pendingInsurance=[];

  constructor(private userLogisticsService:UserLogisticsService,private route:Router) { }
  
  ngOnInit() {
    this.userLogisticsService.getpendingInsurancePo().subscribe((res)=>{
      this.pendingInsurance=res;
    })
  }

  accept(objData){
    let id = objData._id;
		this.route.navigate(['/logistic/logisticsUser/insurance-po',{id}]);
  }
}
