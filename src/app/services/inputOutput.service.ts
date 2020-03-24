import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

import { Subject } from "rxjs/Subject";

@Injectable()
export class InputOutputService {
        formValues:Subject<any> = new Subject();
       public orderNo:string; 
       public priceListArray = [];
       public inventoryArray = [];
       public warehouseArray = [];
       public WarehouseArray = [];
       public transportArray = [];
       public TransportArray = [];
       public clearingArray = [];
       public ClearingArray = [];
       public insuranceArray = [];
       public InsuranceArray = [];
       public orderArray=[{txtOrderNo:'OR7457',txtCustomerName:'Dell Industries',txtPriceList:'$ 456.99',txtIssueDate:'3/7/2017'},
       {txtOrderNo:'OR74897',txtCustomerName:'Linc Foundation',txtPriceList:'$ 49.99',txtIssueDate:'8/7/2017'},
       {txtOrderNo:'OR2457',txtCustomerName:'Nestle Foods',txtPriceList:'$ 156.99',txtIssueDate:'5/7/2017'}];
       public currencyArray=[];
       public paymentArray=[];
       public paymentTermArray=[];
       public taxTypeArray=[];
       public discountArray=[];
       public addLocationArray=[];
       public sellerManagementArray=[];
       public array=[{file:'./assets/img/product/laptop.jpg',txtProductName: 'Laptop',txtProductCategory: 'Electronics',
       txtBrand:'Dell',txtStockAvailable:"25",txtSupplier:"Dell Industries Pvt. Ltd "},
       {file:'./assets/img/product/jeans.jpg',txtProductName: 'Jeans',txtProductCategory: 'Clothing'
       ,txtBrand:'Levis',txtStockAvailable:"75",txtSupplier:"Universal"},
       {file:'./assets/img/product/tshirt.jpg',txtProductName: 'TShirt',txtProductCategory: 'Clothing'
       ,txtBrand:'Lee',txtStockAvailable:"754",txtSupplier:"Universal"},
       {file:'./assets/img/product/watch.jpg',txtProductName: 'Watch',txtProductCategory: 'Accesories'
       ,txtBrand:'Titan',txtStockAvailable:"54",txtSupplier:"Universal"},
       {file:'./assets/img/product/iphonex.jpg',txtProductName: 'Iphone',txtProductCategory: 'Mobile'
       ,txtBrand:'Apple',txtStockAvailable:"24",txtSupplier:"Apple"},
       {file:'./assets/img/product/jacket.jpg',txtProductName: 'Jacket',txtProductCategory: 'Clothing'
       ,txtBrand:'Northern',txtStockAvailable:"75",txtSupplier:"Supplier"}]    
       public vasArray=[
           { txtServicePlan: 'Sales leads' , txtLocation: 'Business', txtPrice: '49.99' },
           { txtServicePlan: 'Advertising spots' , txtLocation: 'Portal', txtPrice: '53.99' },
           { txtServicePlan: 'Broadcast emails' , txtLocation: 'Portal', txtPrice: '47.99' },
           { txtServicePlan: 'Demand Forecasting' , txtLocation: 'Reports', txtPrice: '55.99' }];
        public customerArray=[];    
        broadcastObjectChange(text:any) {
            this.formValues.next(text);
            
        }

   
}