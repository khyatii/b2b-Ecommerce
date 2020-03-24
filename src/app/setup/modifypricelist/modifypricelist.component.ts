import { ConfigurationService } from './../../services/configuration.service';
import { CustomerService } from './../../services/customer.service';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modifypricelist',
  templateUrl: './modifypricelist.component.html',
  styleUrls: ['./modifypricelist.component.css']
})
export class ModifypricelistComponent implements OnInit {
  value: { _id: any; };
  currencyArray: any = [];
  customerArray: any = [];
  productArray: any = [];
  USD = 'USD'
  priceListForm: FormGroup;
  options = [
    'One',
    'Two',
    'Three'
  ];
  filteredOptions: Observable<string[]>;
  successMsg: string;
  minDate = new Date();
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  email: string = "info@nicoza.com";
  id: number = 1;

  constructor(private fb: FormBuilder, private route: Router, private inputOutputService: InputOutputService,
    private setupService: SetupService, private inventoryService: InventoryService, private customerService: CustomerService,
    private configurationService: ConfigurationService, private router: ActivatedRoute) { }

  ngOnInit() {

    this.value = { _id: this.router.snapshot.params['id'] }

    this.priceListForm = this.fb.group({
      "product": ['', Validators.required],
      "customerGroup": ['', Validators.required],
      "price": ['', Validators.required],
      "currency": ['', Validators.required],
      "quantity_per_unit": ['', Validators.required],
      "txtMinOrderQuantity": ['', Validators.required],
      "start_date": ['', Validators.required],
      "end_date": ['', Validators.required],
    })
    this.filteredOptions = this.product.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());

    this.setupService.getOnePriceList(this.value).subscribe(
      res => {
        this.product.setValue(res[0].product);
        this.customerGroup.setValue(res[0].customerGroup);
        this.price.setValue(res[0].price);
        this.currency.setValue(res[0].currency);
        this.quantity_per_unit.setValue(res[0].quantity_per_unit);
        this.txtMinOrderQuantity.setValue(res[0].txtMinOrderQuantity);
        this.start_date.setValue(res[0].start_date);
        this.end_date.setValue(res[0].end_date);
        this.id = res[0]._id;
      },
      err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
        if (err instanceof AppError) {

        }
      }
    )

    this.inventoryService.getProduct().subscribe(
      res1 => {
        this.productArray = res1;
      }
    )

    this.customerService.getCustomerGroupsActive().subscribe(
      res2 => {
        this.customerArray = res2;
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

  get txtMinOrderQuantity() {
    return this.priceListForm.controls.txtMinOrderQuantity
  }

  submit(formValues) {
    formValues._id = this.id;
    this.setupService.modifyPriceList(formValues).subscribe(
      res => {
        this.successMsg = "Price List is modified.";
        this.showSuccess();
        this.route.navigate(['/app/setup/product-list'])
      },
      err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
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
