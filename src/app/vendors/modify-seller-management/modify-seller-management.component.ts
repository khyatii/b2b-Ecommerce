import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputOutputService } from '../../services/inputOutput.service';
import { CustomerService } from '../../services/customer.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modify-seller-management',
  templateUrl: './modify-seller-management.component.html',
  styleUrls: ['./modify-seller-management.component.css']
})
export class ModifySellerManagementComponent implements OnInit {
  id: any;
  value: { supplierId: any; };
  productArray: any;
  supplierListArray: any;
  location = [];
  sellerMangementForm: FormGroup;
  isShow: boolean = true;
  successMsg: string;
  productId;
  minDate = new Date();
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  productIdd: any;

  unitsArray = ['Kilogram', 'Nos', 'Pieces', 'Tons', 'Units', '20’ Container', '40’ Container', 'Bags',
    'Bag', 'Barrel', 'Barrels', 'Bottles', 'Boxes', 'Bushel', 'Bushels', 'Cartons', 'Dozen', 'Foot',
    'Gallon', 'Grams', 'Hectare', 'Kilometer', 'Kilowatt', 'Litre', 'Litres', 'Long Ton', 'Meter',
    'Metric Ton', 'Metric Tons', 'Ounce', 'Packets', 'Pack', 'Packs', 'Piece', 'Pounds', 'Reams',
    'Rolls', 'Sets', 'Sheets', 'Short Ton', 'Square Feet', 'Square Metres', 'Watt'
  ];

  constructor(private fb: FormBuilder, private route: Router,
    private customerService: CustomerService, private inventoryService: InventoryService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.value = { supplierId: this.router.snapshot.params['id'] };

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

    this.customerService.getOneSupplier(this.value).subscribe(
      res => {
        this.id = res["0"]._id;

        this.optSupplier.setValue(res[0].optSupplier);
        this.optPriority.setValue(res[0].optPriority);
        this.radioShareStock.setValue(res[0].radioShareStock);
        this.radioReorder.setValue(res[0].radioReorder);
        this.radioMovementAlert.setValue(res[0].radioMovementAlert);

        this.txtOrderQuantity.setValue(res[0].txtOrderQuantity);
        this.txtReorderStock.setValue(res[0].txtReorderStock);
        this.optBranchName.setValue(res[0].optBranchName);
        this.txtstartDate.setValue(res[0].txtstartDate);
        this.optPurchaseUnit.setValue(res[0].optPurchaseUnit);
        this.txtEndDate.setValue(res[0].txtEndDate);
        this.optStorageLocation.setValue(res[0].optStorageLocation);
        this.txtItemSize.setValue(res[0].txtItemSize);
        this.txtItemWeight.setValue(res[0].txtItemWeight);
        this.productId = { productId: res[0].optProduct.productId._id };
        this.inventoryService.getProductOne(this.productId).subscribe(
          res1 => {
            this.productArray = res1;
            this.optProduct.setValue(res1[0].productId.txtProductName);
            this.productIdd = res1[0]._id;
          })
      }
    )
  }
  productdetails(data) {
    this.productId = { traderId: data.value }
    this.inventoryService.getProductList(this.productId).subscribe(
      res1 => {
        this.productArray = res1;
      })
  }

  submit(formvalue) {
    this.isLoading = true;
    formvalue._id = this.id;
    formvalue.productIdd = this.productIdd;
    this.customerService.updateSupplier(formvalue).subscribe(
      res => {
        this.successMsg = "Supplier is updated.";
        this.showSuccess();
        this.isLoading = false;
        setTimeout(() => {
          this.route.navigate(['/app/vendors/sellermanagementtable']);
        }, 2000)

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
  getProductId(x) {
    this.productIdd = x._id;
  }
  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  get txtItemSize() {
    return this.sellerMangementForm.controls.txtItemSize
  }

  get txtItemWeight() {
    return this.sellerMangementForm.controls.txtItemWeight
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
