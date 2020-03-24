import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  array:any
  productArray:Array<object>;
  data:any;
  gridView:boolean=true;
  tableView:boolean=true;
  searchText;
  isHide:boolean=false;
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
