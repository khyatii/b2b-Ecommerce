import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotFoundError } from '../../apperrors/notfound';
import { AppError } from '../../apperrors/apperror';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  successMsg: string;
  updateProduct: any;
  searchProduct: boolean;
  product: any;
  productId: any;
  productNameArray = [];
  filterOptionProduct;
  resultArray: any;
  locationArray: any;
  minAmount: any;
  maxAmount: any;
  isShow: boolean = false
  isHide: boolean = true;
  isUpdate: boolean = true;
  searchProductForm: FormGroup;
  searchProductFormUpdate: FormGroup;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  stockOnHandInital = 0
  stockOnAvailable = 0;
  permission;
  step: 1;
  thumbLabel;
  unitsArray = ['Kilogram', 'Nos', 'Pieces', 'Tons', 'Units', '20’ Container', '40’ Container', 'Bags',
    'Bag', 'Barrel', 'Barrels', 'Bottles', 'Boxes', 'Bushel', 'Bushels', 'Cartons', 'Dozen', 'Foot',
    'Gallon', 'Grams', 'Hectare', 'Kilometer', 'Kilowatt', 'Litre', 'Litres', 'Long Ton', 'Meter',
    'Metric Ton', 'Metric Tons', 'Ounce', 'Packets', 'Pack', 'Packs', 'Piece', 'Pounds', 'Reams',
    'Rolls', 'Sets', 'Sheets', 'Short Ton', 'Square Feet', 'Square Metres', 'Watt'
  ];

  constructor(private fb: FormBuilder, private permissionService: PermissionService,
    private inventoryService: InventoryService, private route: Router) { }

  ngOnInit() {
    // this.inventoryService.priceRange().subscribe(res => {
    //   this.maxAmount = res[0].maxAmount
    //   this.minAmount = res[0].minAmount
    // })
    this.inventoryService.getLocation().subscribe(res => { this.locationArray = res; })
    this.searchProductForm = this.fb.group({
      "txtProductName": ['', Validators.required],
      "txtModel": ['',],
      "txtPartNo": ['',],
      "txtMinPriceRange": ['',],
      "txtMaxPriceRange": ['',],
      "txtSerialNo": ['',],
      "txtStorageLocation": ['', Validators.required],

    })

    this.searchProductFormUpdate = this.fb.group({
      "txtProductName": [{ value: '', disabled: true }],
      "txtModelCode": [{ value: '', disabled: true }],
      "txtPartNo": [{ value: '', disabled: true }],
      "txtSerialNo": [{ value: '', disabled: true }],
      "txtStockAvailable": [{ value: this.stockOnAvailable, disabled: true }],
      "txtStockOnHand": [{ value: this.stockOnHandInital, disabled: true }],
      "txtStorageLocation": [{ value: '', disabled: true }],
      "txtPrice": [{ value: '', disabled: true }],
      "txtQuantityChange": ['', Validators.required],
      "txtStorageUnitOfMeasure": ['', Validators.required],
      "txtReason": ['', Validators.required],
      "txtComments": ['', Validators.required],
      "txtAdjustedDate": ['',],
    })

    this.inventoryService.getProduct().subscribe(res1 => {
      this.filterOptionProduct = res1;
      this.productNameArray = res1;
    })
  }

  changeProduct(option) {
    this.productId = option._id
  }

  filterProductName(val: string) {
    var a = this.filterOptionProduct.filter(option =>
      option.productId.txtProductName.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
    this.productNameArray = a;
  }
  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  get txtProductName() {
    return this.searchProductForm.controls.txtProductName
  }

  get txtStorageLocation() {
    return this.searchProductForm.controls.txtStorageLocation
  }

  get txtStockAvailable() {
    return this.searchProductFormUpdate.controls.txtStockAvailable
  }
  submit(formValues) {

    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        txtStockPermission: resp[0].txtStockPermission,
      }
      if (this.permission.txtStockPermission == 'rw') {

        this.isUpdate = false;
        this.searchProduct = true;
        this.searchProductFormUpdate.reset();
        this.inventoryService.searchProduct(formValues).subscribe
          (res => {
            this.resultArray = res;
            if (this.resultArray.length == 0) this.searchProduct = false;
          },
          (err) => {
            if (err instanceof NotFoundError) {
              this.searchProductForm.setErrors({ "notauser": true })
              setTimeout(() => this.isShow = true, 2000)
            }
          }
          )
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })


  }

  updateForm(product, quantityChange) {
    if (product != null) {
      this.updateProduct = product
      this.searchProductFormUpdate.controls.txtStockAvailable.setValue(product.txtStockAvailable)
      this.searchProductFormUpdate.controls.txtStockOnHand.setValue(product.txtStockOnHand)
      this.searchProductFormUpdate.controls.txtModelCode.setValue(product.txtModelCode)
      this.searchProductFormUpdate.controls.txtPartNo.setValue(product.txtPartNo)
      this.searchProductFormUpdate.controls.txtProductName.setValue(product.productId.txtProductName)
      this.searchProductFormUpdate.controls.txtPrice.setValue(product.txtPrice)
      this.searchProductFormUpdate.controls.txtSerialNo.setValue(product.txtSerialNo)
      this.searchProductFormUpdate.controls.txtStorageLocation.setValue(product.txtStorageLocation.locationName)
    }
    else {
      this.searchProductFormUpdate.controls.txtStockAvailable.
        patchValue(this.updateProduct.txtStockAvailable + parseInt(quantityChange))

      this.stockOnAvailable = this.updateProduct.txtStockAvailable + parseInt(quantityChange)

      this.searchProductFormUpdate.controls.txtStockOnHand.
        patchValue(this.updateProduct.txtStockOnHand + parseInt(quantityChange))

      this.stockOnHandInital = this.updateProduct.txtStockOnHand + parseInt(quantityChange)
    }
  }

  updateStock(formValues) {
    formValues._id = this.product._id;
    formValues.txtStockAvailable = this.stockOnAvailable
    formValues.txtStockOnHand = this.stockOnHandInital
    this.inventoryService.updateProductStock(formValues).subscribe(
      res => {
        this.successMsg = "Stock updated Succesfully";
        this.showSuccess();
        this.isHide = true
      }
    ),
      (err) => {
        if (err instanceof AppError) {

        }
      }
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
