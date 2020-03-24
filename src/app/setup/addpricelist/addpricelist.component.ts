import { ConfigurationService } from './../../services/configuration.service';
import { CustomerService } from './../../services/customer.service';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-addpricelist',
  templateUrl: './addpricelist.component.html',
  styleUrls: ['./addpricelist.component.css']
})
export class AddpricelistComponent implements OnInit {
  priceListForm: FormGroup;
  options = [
    'Shoe',
    'T-Shirt',
    'Tie'
  ];
  filteredOptions: Observable<string[]>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  minDate = new Date();
  isError: boolean = true;
  email: string = "info@nicoza.com";
  productArray = [];
  customerGroupArray = [];
  currencyArray = [];

  constructor(private fb: FormBuilder, private route: Router, private inputOutputService: InputOutputService,
    private setupService: SetupService, private inventoryService: InventoryService, private customerService: CustomerService,
    private configurationService: ConfigurationService) { }

  ngOnInit() {
    this.priceListForm = this.fb.group({
      "product": ['', Validators.required],
      "customerGroup": ['', Validators.required],
      "price": ['', Validators.required],
      "currency": ['', Validators.required],
      "quantity_per_unit": ['', Validators.required],
      "start_date": ['', Validators.required],
      "end_date": ['', Validators.required],
    })
    this.filteredOptions = this.product.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());

    this.inventoryService.getProduct().subscribe(
      res1 => {
        this.productArray = res1;
      }
    )

    this.customerService.getCustomerGroupsActive().subscribe(
      res2 => {
        this.customerGroupArray = res2;
      }
    )

    this.configurationService.getCurrency().subscribe(
      res3 => {
        this.currencyArray = res3;
      }
    )
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // keyPress(event: any) {
  //   if (!((event.keyCode > 95 && event.keyCode < 106)
  //     || (event.keyCode > 47 && event.keyCode < 58)
  //     || event.keyCode == 8)) {
  //     event.preventDefault();
  //   }
  // }

  get product() {
    return this.priceListForm.controls.product
  }

  get customerGroup() {
    return this.priceListForm.controls.customerGroup
  }

  get price() {
    return this.priceListForm.controls.price
  }

  get currency() {
    return this.priceListForm.controls.currency
  }

  get quantity_per_unit() {
    return this.priceListForm.controls.quantity_per_unit
  }

  get start_date() {
    return this.priceListForm.controls.start_date
  }

  get end_date() {
    return this.priceListForm.controls.end_date
  }

  submit(formValues) {
    this.setupService.addNewPriceList(formValues).subscribe(
      res => {
        this.successMsg = "Price List is added.";
        this.showSuccess();
        this.route.navigate(['/app/setup/product-list'])
      },
      err => {
        if (err.err.status == "400") {
          this.errorMsg = "Product and Customer Group Already Exists";
          this.showError();
        }
        else {
          this.errorMsg = "Some Error Occured";
          this.showError();
        }

        if (err instanceof AppError) {

        }
      }
    )
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
