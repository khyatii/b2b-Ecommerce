import { SalesOrderService } from './../../services/sales-order.service';
import { InputOutputService } from './../../services/inputOutput.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl,} from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule  } from '@angular/material';
import { EmailValidation } from '../../validators/emailValid';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  issueDates: string[];
  priceLists: string[];
  customerNames: string[];
  orderNos:string[];
  orderArray:Array<object>

  public isHide:boolean = false;  
  data=[];
  count:number=0;

  constructor(private inputOutputService:InputOutputService,private salesOrderService:SalesOrderService) { }

  ngOnInit() { 
    this.data = this.inputOutputService.orderArray;
    // this.salesOrderService.getOrder().subscribe(res=>{},
    //   (err)=>{

    //   }
    // )
  }  

  editData(Expand){ 
    Expand.isHide = true;
  }    
  
}