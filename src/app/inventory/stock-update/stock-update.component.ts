import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-stock-update',
  templateUrl: './stock-update.component.html',
  styleUrls: ['./stock-update.component.css']
})
export class StockUpdateComponent implements OnInit {
  stockUpdateForm:FormGroup;
   isShow:boolean;
  
    constructor(private fb:FormBuilder,private route:Router, private inventoryService:InventoryService ) { }
  
    ngOnInit() {
    this.stockUpdateForm = this.fb.group({
        "txtBarcode":[''],
        "txtProduct":[''],
        "txtModel":[''],
        "txtPart":[''],
        "txtSerial":[''],
        "txtStorageLocation":[''],
        "txtStockOnHand":['',Validators.required],
        "txtStockAvailable":['',Validators.required],
        "txtStorageUnit":[''],
        "txtComments":['',Validators.required],
        "txtRecivingDate":['',Validators.required],
        "txtPONo":[''],
        "txtDeliveryNotes":[''],
        
        
      })
     
    }
  
    get txtStockOnHand()  { 
      return this.stockUpdateForm.controls.txtStockOnHand
      }
    get txtStockAvailable()  { 
      return this.stockUpdateForm.controls.txtStockAvailable
      }
    get txtComments()  { 
      return this.stockUpdateForm.controls.txtComments
    }
    get txtRecivingDate()  { 
      return this.stockUpdateForm.controls.txtRecivingDate
    }
   
  
    submit(formValues){
      this.isShow =  true;
      this.inventoryService.modifyStock(formValues).subscribe(res=>{},
      (err)=>{
        if(err instanceof AppError){

        }
      })
      setTimeout(function() { this.isShow = false; }.bind(this), 2000);
    }

}
