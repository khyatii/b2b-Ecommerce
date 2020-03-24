import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from '../../../apperrors/apperror';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completed-returns',
  templateUrl: './completed-returns.component.html',
  styleUrls: ['./completed-returns.component.css']
})
export class CompletedReturnsComponent implements OnInit {
  completedReturnArray: any;

  constructor(private salesOrderService: SalesOrderService, private route: Router) { }

  ngOnInit() {
    this.salesOrderService.getReturnsCompleted().subscribe(res => {
      this.completedReturnArray = res;
    },
      err => {
        if (err instanceof AppError) {
        }
      })
  }

  viewDetails(objData) {
    let id = objData._id;
    this.route.navigate(['/app/salesorders/view-completed-returns', { id }]);
  }



}
