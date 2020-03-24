import { ActivatedRoute } from '@angular/router';
import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-product-details',
  templateUrl: './view-product-details.component.html',
  styleUrls: ['./view-product-details.component.css']
})
export class ViewProductDetailsComponent implements OnInit {
  productArray: Array<object>;
  viewPoTrackingDetails: Array<object>;
  value: { _id: any; };
  _id: any;

  viewTrackingDetails: boolean = true;

  isPlaced: boolean = false;
  isPacked: boolean = false;
  isShipped: boolean = false;
  isDelievered: boolean = false;

  constructor(private salesOrderService: SalesOrderService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }

    this.salesOrderService.getAllPoProduct(this.value).subscribe(res => {
      this.productArray = res;
    })

    this.salesOrderService.getPoTrackingStatus(this.value).subscribe(res => {
      this.viewPoTrackingDetails = res;

      if (res[0].orderPlaced == "accept") {
        this.isPlaced = true;
      }
      if (res[0].orderPacked == "accept") {
        this.isPacked = true;
      }
      if (res[0].orderShipped == "received") {
        this.isShipped = true;
      }
      if (res[0].orderDelivered == "received") {
        this.isDelievered = true;
      }
    })
  }

}
