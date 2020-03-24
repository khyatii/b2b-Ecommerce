import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../../services/sales-order.service';
import { AppError } from '../../../apperrors/apperror';

@Component({
  selector: 'app-view-all-goods',
  templateUrl: './view-all-goods.component.html',
  styleUrls: ['./view-all-goods.component.css']
})
export class ViewAllGoodsComponent implements OnInit {
  testDate: any = '';
  showSearch: Array<object> = [];
  onloadShow: boolean = true;
  filterByDate: boolean = false;
  recievingGoodsArray: Array<Object>;
  toshowArray: Array<object> = []

  constructor(private salesOrderService: SalesOrderService, private route: Router) { }

  ngOnInit() {
    this.salesOrderService.getAllRecievingGoods().subscribe(res => {
      this.recievingGoodsArray = res;
      this.showSearch = res;
    })
  }

  searchforDate(e) {
    this.showSearch = [];
    this.testDate = String(e.target.value);
    var DateTosearch = this.convert(this.testDate);
    this.recievingGoodsArray.forEach(resp => {
      let Createdon = resp['createdAt'].split('T');
      if (DateTosearch == Createdon[0]) {
        this.showSearch.push(resp);
      }
    })
    if (this.testDate == 'null') {
      this.showSearch = this.recievingGoodsArray;
    }
  }

  viewRecievingGoods(objData) {
    let id = objData._id;
    this.route.navigate(['/app/salesorders/recievingGoods/viewRecievingGoods', { id }]);
  }

  public convert(str) {
    var mnths = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = str.split(" ");
    return [date[3], mnths[date[1]], date[2]].join("-");
  }
}
