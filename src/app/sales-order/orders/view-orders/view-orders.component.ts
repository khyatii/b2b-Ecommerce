import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../../services/sales-order.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  issueDates: string[];
  priceLists: string[];
  customerNames: string[];
  orderNos: string[];
  orderArray: Array<object>
  AccpetedPoArray: Array<object>
  completedPoArray: Array<object>
  trackArray: Array<object>
  date: any = 'jan';
  pendingArr: Array<object> = [];
  completedArr: Array<object> = [];
  searchText:any

  public isHide: boolean = false;
  data = [];
  count: number = 0;

  constructor(private salesOrderService: SalesOrderService, private route: Router) { }

  ngOnInit() {

    this.salesOrderService.getAcceptedPo().subscribe(res => {
      this.AccpetedPoArray = res;
      this.pendingArr = res;
    })

    this.salesOrderService.completedPoArray().subscribe(res => {
      this.completedPoArray = res;
      this.completedArr = res;
    })
  }

  searchforName(e) {
    this.AccpetedPoArray = [];
    let searchKeyword = e.target.value.toLowerCase();
    this.pendingArr.forEach(resp => {
      let string = resp['supplierId']['company_name'].toLowerCase();
      let CheckIndex=string.indexOf(searchKeyword);
      if( CheckIndex >= 0 ){
        this.AccpetedPoArray.push(resp);
      }
    })
  }

  searchforCompleted(e) {
    this.completedPoArray = [];
    let searchKeyword = e.target.value.toLowerCase();
    this.completedArr.forEach(resp => {
      let string = resp['supplierId']['company_name'].toLowerCase();
      let foundIndexStr=string.indexOf(searchKeyword);
      if(foundIndexStr >= 0 ){
        this.completedPoArray.push(resp);
      }
    })
  }


  viewDetails(objData) {
    let id = objData._id;
    this.route.navigate(['/app/salesorders/orders/viewProductDetails', { id }]);
  }

  cancelOrder(objData) {
    let id = objData._id;
    this.route.navigate(['/app/salesorders/orders/cancelOrder', { id }]);
  }

  notCancel(objData) {
    let id = objData._id;
    alert("Order Already Delivered")
  }

  returnOrder(objData) {
    let id = objData._id;
    this.route.navigate(['/app/salesorders/orders/returnOrder', { id }]);
  }

  editData(Expand) {
    Expand.isHide = true;
  }

}
