import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CustomerService } from '../../services/customer.service';
import { SalesOrderService } from '../../services/sales-order.service';
import { Observable } from 'rxjs';
import { NotFoundError } from '../../apperrors/notfound';
import { SignupUser } from '../../signup-user/signup-user.service';
import { ConfigurationService } from '../../services/configuration.service';
import { PopUpRequestQuotationComponent } from '../pop-up-request-quotation/pop-up-request-quotation.component';
import { PermissionService } from '../../services/permission.service';


@Component({
  selector: 'app-supplier-search',
  templateUrl: './supplier-search.component.html',
  styleUrls: ['./supplier-search.component.css']
})
export class SupplierSearchComponent implements OnInit {

  isHide: boolean = true;
  searchSupplierForm: FormGroup;
  minValue = 0;
  maxValue = 100;
  thumbLabel = true;
  searchSupplier: boolean;
  showMessage: boolean = false;
  optionsArray = [];
  countryArray: any;
  countryName: any;
  citiesArray: any;
  productNameArray: Observable<string[]>;
  resultArray = [];
  currencyArray = [];
  filteredOptions: Observable<string[]>;
  filteredCity: Observable<string[]>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  permission;
  step:1;

  constructor(private fb: FormBuilder, private route: Router, private signupUser: SignupUser,
    private salesOrderService: SalesOrderService, private configurationService: ConfigurationService,
    private customerService: CustomerService, public dialog: MatDialog,
    private permissionService: PermissionService) { }

  ngOnInit() {
    this.searchSupplierForm = this.fb.group({
      "txtProductName": ['', Validators.required],
      "txtCountry": ['',],
      "txtCity": ['',],
      "txtMinPriceRange": ['',],
      "txtMaxPriceRange": ['',],
      "txtCurrency": ['',],
    })
    this.signupUser.getCountry().subscribe(res => {
      res = res.json()
      this.countryArray = res;
      this.filteredOptions = this.txtCountry.valueChanges
        .startWith(null)
        .map(val => val ? this.filterCountry(val) : this.countryArray.slice());
    })
    this.configurationService.getCurrency().subscribe(resp => {
      this.currencyArray = resp;
    })

    this.salesOrderService.getAllProductList().subscribe(res => {
      this.optionsArray = res;
      this.productNameArray = this.txtProductName.valueChanges
        .startWith(null)
        .map(val => val ? this.filter(val) : this.optionsArray.slice());
    })
  }

  filter(val: string): string[] {
    return this.optionsArray.filter(option =>
      option.productId.txtProductName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  filterCountry(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.countryArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
  }

  get txtProductName() {
    return this.searchSupplierForm.controls.txtProductName
  }
  get txtCountry() {
    return this.searchSupplierForm.controls.txtCountry
  }
  get txtCity() {
    return this.searchSupplierForm.controls.txtCity
  }

  onInputMinChange(e) {
    this.minValue = e.value
  }
  onInputMaxChange(e) {
    this.maxValue = e.value
  }

  submit(formValues) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        VendorsPermission: resp[0].VendorsPermission,
      }
      if (this.permission.VendorsPermission == 'rw') {

        formValues.countryName = this.countryName;
        this.isHide = false;
        this.showMessage = false;
        this.searchSupplier = true;
        this.customerService.searchSupplier(formValues).subscribe(res => {
          this.resultArray = res;
          if (this.resultArray.length == 0) this.searchSupplier = false;
        }, err => {
          if (err instanceof NotFoundError) {
            this.searchSupplierForm.setErrors({ "notauser": true })
            setTimeout(() => this.showMessage = true, 2000)
          }
        })
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError()
      }
    })

  }

  /*pop-up for Selecting rfq details*/
  openDialog(): void {
    let dialogRef = this.dialog.open(PopUpRequestQuotationComponent, {
      width: '650px',
      data: { resultArray: this.resultArray }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  countryChanged(country) {
    this.signupUser.getCites(country).subscribe(res => {
      this.citiesArray = res;
      this.filteredCity = this.txtCity.valueChanges
        .startWith(null)
        .map(val => val ? this.filtercity(val) : this.citiesArray.slice());
    });
    this.countryName = country.name;
  }
  filtercity(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.citiesArray.filter
      (function (Product) {
        return Product.name.toLowerCase().includes(filterValue);
      })
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
