import { SalesOrderService } from './../../services/sales-order.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery-note',
  templateUrl: './delivery-note.component.html',
  styleUrls: ['./delivery-note.component.css']
})
export class DeliveryNoteComponent implements OnInit {
  value: { _id: any; };
  productArray: Array<object>;
  BuyerName;
  BuyerEmail;
  BuyerContact;
  SupplierName;
  SupplierEmail;
  SupplierConatct;
  createdAt;
  orderNumber;
  invoiceNumber;
  total;
  tax;

  constructor(private router: ActivatedRoute, private salesOrderService: SalesOrderService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    const localThis = this;

    this.salesOrderService.getAllPoProduct(this.value).subscribe(res => {
      this.productArray = res;
      localThis.BuyerName = res[0]['buyerId'].company_name;
      localThis.BuyerEmail = res[0]['buyerId'].email;
      localThis.BuyerContact = res[0]['buyerId'].phone_number;
      localThis.SupplierName = res[0]['supplierId'].company_name;
      localThis.SupplierEmail = res[0]['supplierId'].email;
      localThis.SupplierConatct = res[0]['supplierId'].phone_number;
      localThis.createdAt = res[0].createdAt;
      localThis.orderNumber = res[0].orderNumber;
      localThis.invoiceNumber = res[0].invoiceNumber;

      let sum = 0;
      for (let i = 0; i < localThis.productArray.length; i++) {
        let subTotal = localThis.productArray[i]['txtUnitPrice'] * localThis.productArray[i]['txtNoOfItems'];
        sum += subTotal;
      }
      this.total = sum;

      this.tax = this.total * 10 / 100
    })

  }

  print() {
    window.print();
  }

}
