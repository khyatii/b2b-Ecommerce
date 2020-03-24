import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';

@Component({
  selector: 'app-seller-management',
  templateUrl: './seller-management.component.html',
  styleUrls: ['./seller-management.component.css']
})
export class SellerManagementComponent implements OnInit {
  productArray: any;
  branchArray: any;
  supplierListArray: any;
  sellerMangementForm: FormGroup;
  isShow: boolean = true;
  successMsg: string;
  productId;
  minDate = new Date();
  branchId;
  location: any
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  isbystepper: boolean = false;
  @Output() notify:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @select() isStepper: Observable<boolean>;


  unitsArray = ['Kilogram', 'Nos', 'Pieces', 'Tons', 'Units', '20’ Container', '40’ Container', 'Bags',
    'Bag', 'Barrel', 'Barrels', 'Bottles', 'Boxes', 'Bushel', 'Bushels', 'Cartons', 'Dozen', 'Foot',
    'Gallon', 'Grams', 'Hectare', 'Kilometer', 'Kilowatt', 'Litre', 'Litres', 'Long Ton', 'Meter',
    'Metric Ton', 'Metric Tons', 'Ounce', 'Packets', 'Pack', 'Packs', 'Piece', 'Pounds', 'Reams',
    'Rolls', 'Sets', 'Sheets', 'Short Ton', 'Square Feet', 'Square Metres', 'Watt'
  ];

  constructor(private fb: FormBuilder, private route: Router,
    private customerService: CustomerService, private inventoryService: InventoryService,
    private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.sellerMangementForm = this.fb.group({
      "optSupplier": ['', Validators.required],
      "optPriority": ['', Validators.required],
      "radioShareStock": ['', Validators.required],
      "radioReorder": ['', Validators.required],
      "radioMovementAlert": ['', Validators.required],
      "optProduct": ['', Validators.required],
      "txtOrderQuantity": ['', Validators.required],
      "txtReorderStock": ['', Validators.required],
      "optBranchName": ['', Validators.required],

      "optPurchaseUnit": ['', Validators.required],
      "txtstartDate": ['', Validators.required],
      "txtEndDate": ['', Validators.required],
      "optStorageLocation": ['', Validators.required],
      "txtItemSize": [''],
      "txtItemWeight": [''],
    })

    this.customerService.getSupplierList().subscribe(res => {
      this.supplierListArray = res;
    })
    this.inventoryService.getUserLocation().subscribe(res => {
      this.location = res;
    })

    this.isStepper.subscribe(res => {
      this.isbystepper = res;
    })
  }
  productdata(data) {
    this.productId = { traderId: data.value }
    this.inventoryService.getProductList(this.productId).subscribe(res => {
      this.productArray = res;
    })
  }
  Locationdata(data) {
    this.branchId = { traderId: data.value }
    this.inventoryService.getBranchList(this.branchId).subscribe(res => {
      this.branchArray = res;
    })

  }
  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  submit(formvalue) {
    this.isLoading = true;
    this.customerService.addSupplier(formvalue).subscribe(
      res => {
        if(this.isbystepper){
          this.successMsg = "Supplier is added.";
          this.showSuccess();
          this.isLoading = false;
          setTimeout(() => {
            this.route.navigate(['/app/vendors/sellermanagementtable']);
          }, 2000)
        }else{
          this.successMsg = "Supplier is added.";
          this.showSuccess();
          this.isLoading = false;
          setTimeout(() => {
            this.route.navigate(['/app/vendors/sellermanagementtable']);
          }, 2000)
        }
      }, err => {
        if (err.err.status = '502') {
          this.errorMsg = "Supplier with same Product Already Exists";
          this.showError();
        } else {
          this.errorMsg = "Some error occured.";
          this.showError();
        }
        this.isLoading = false;
      }
    )
  }

  get optSupplier() {
    return this.sellerMangementForm.controls.optSupplier
  }
  get optPriority() {
    return this.sellerMangementForm.controls.optPriority
  }
  get radioShareStock() {
    return this.sellerMangementForm.controls.radioShareStock
  }
  get radioReorder() {
    return this.sellerMangementForm.controls.radioReorder
  }
  get radioMovementAlert() {
    return this.sellerMangementForm.controls.radioMovementAlert
  }
  get optProduct() {
    return this.sellerMangementForm.controls.optProduct
  }
  get txtOrderQuantity() {
    return this.sellerMangementForm.controls.txtOrderQuantity
  }
  get txtReorderStock() {
    return this.sellerMangementForm.controls.txtReorderStock
  }
  get optBranchName() {
    return this.sellerMangementForm.controls.optBranchName
  }
  get txtstartDate() {
    return this.sellerMangementForm.controls.txtstartDate
  }
  get optPurchaseUnit() {
    return this.sellerMangementForm.controls.optPurchaseUnit
  }
  get txtEndDate() {
    return this.sellerMangementForm.controls.txtEndDate
  }
  get optStorageLocation() {
    return this.sellerMangementForm.controls.optStorageLocation
  }
  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
    }, 2000);
  }
  showError() {
    window.scrollTo(500, 0);
    this.isError = false;
    setTimeout(() => {
      this.isError = true;
    }, 2000);
  }
}
