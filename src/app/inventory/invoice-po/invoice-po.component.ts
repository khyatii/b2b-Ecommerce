import { Router, ActivatedRoute } from '@angular/router';
import { SalesOrderService } from './../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-po',
  templateUrl: './invoice-po.component.html',
  styleUrls: ['./invoice-po.component.css']
})
export class InvoicePoComponent implements OnInit {
completedPoProductArray:Array<object>;
value: { _id: any; };
BuyerName;
BuyerEmail;
BuyerContact;
SupplierName;
SupplierEmail;
SupplierConatct;
createdAt;
orderNumber;
total;
tax;

  constructor(private salesOrderService:SalesOrderService,private router:ActivatedRoute) { }

  ngOnInit() {
    this.value = {_id:this.router.snapshot.params['id']}
    const localThis = this;
    this.salesOrderService.getCompletedPOdetails(this.value).subscribe(res=>{
        this.completedPoProductArray=res;
        localThis.BuyerName = res[0]['buyerId'].company_name;
        localThis.BuyerEmail = res[0]['buyerId'].email;
        localThis.BuyerContact = res[0]['buyerId'].phone_number;
        localThis.SupplierName = res[0]['supplierId'].company_name;
        localThis.SupplierEmail = res[0]['supplierId'].email;
        localThis.SupplierConatct = res[0]['supplierId'].phone_number;
        localThis.createdAt = res[0].createdAt;
        localThis.orderNumber = res[0].orderNumber;

        let sum = 0;
        for(let i = 0; i < localThis.completedPoProductArray.length; i++) {
           let subTotal =  localThis.completedPoProductArray[i]['txtTotalPrice'];
           sum += subTotal;
        }
        this.total = sum;
        this.tax=this.total*10/100
      })

  }

  print() {
    window.print();
  }

}
