import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesOrderService } from '../../../services/sales-order.service';

@Component({
  selector: 'app-view-completed-returns',
  templateUrl: './view-completed-returns.component.html',
  styleUrls: ['./view-completed-returns.component.css']
})
export class ViewCompletedReturnsComponent implements OnInit {

  productArray: Array<object>;
  value: { _id: any; };
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  total;
  tax;

  constructor(private router: ActivatedRoute, private salesOrderService: SalesOrderService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;

    this.salesOrderService.getAllCompletedReturnsProduct(this.value).subscribe(res => {
      this.productArray = res;

      localThis.BuyerName = res[0]['buyerId'].company_name;
      localThis.BuyerEmail = res[0]['buyerId'].email;
      localThis.BuyerContact = res[0]['buyerId'].phone_number;
      localThis.SupplierName = res[0]['supplierId'].company_name;
      localThis.SupplierEmail = res[0]['supplierId'].email;
      localThis.SupplierConatct = res[0]['supplierId'].phone_number;
      localThis.createdAt = res[0].createdAt;

      let sum = 0;
      for (let i = 0; i < localThis.productArray.length; i++) {
        let subTotal = localThis.productArray[i]['txtTotalPrice'];
        sum += subTotal;
      }
      this.total = sum;

      this.tax = this.total * 10 / 100
    })
  }


}
