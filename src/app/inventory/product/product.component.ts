import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit, ViewEncapsulation, NgZone,} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl,} from '@angular/forms';
import { MatButtonModule, MatInputModule, MatSelectModule  } from '@angular/material';
import { Router } from '@angular/router';
import { InputOutputService } from '../../services/inputOutput.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  array:any
  productArray:Array<object>;
  data:any;
  gridView:boolean=false;
  tableView:boolean=true;
  constructor(private fb:FormBuilder,private route:Router,private zone:NgZone, 
    private inputOutputService:InputOutputService,private inventoryService:InventoryService) {

  }
  ngOnInit() {   
    this.inventoryService.getProduct().subscribe(res=>{this.productArray=res;})
    this.array = this.inputOutputService.array;   
    this.data =this.inputOutputService.array;   
  }

  addProduct(){
    this.route.navigate(['/app/inventory/addProduct'])
    
  }
  changeView(grid:boolean,table:boolean){
    this.gridView=grid;
    this.tableView=table
  }

  
}