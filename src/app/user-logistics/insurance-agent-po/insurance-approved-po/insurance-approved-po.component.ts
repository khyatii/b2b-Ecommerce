import { Component, OnInit } from '@angular/core';
import { UserLogisticsService } from '../../../services/userLogistics.Service';

@Component({
  selector: 'app-insurance-approved-po',
  templateUrl: './insurance-approved-po.component.html',
  styleUrls: ['./insurance-approved-po.component.css']
})
export class InsuranceApprovedPoComponent implements OnInit {

  approvedInsurance=[];
  constructor(private userLogisticsService:UserLogisticsService) { }
  
  ngOnInit() {
    this.userLogisticsService.getapprovedInsurancePo().subscribe((res)=>{
      this.approvedInsurance=res;
    })
  }
}
