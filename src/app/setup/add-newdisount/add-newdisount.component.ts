import { CustomerService } from './../../services/customer.service';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../services/setup.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-add-newdisount',
  templateUrl: './add-newdisount.component.html',
  styleUrls: ['./add-newdisount.component.css']
})
export class AddNewdisountComponent implements OnInit {

  priceListForm: FormGroup;
  filteredOptions: Observable<string[]>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  minDate = new Date();
  email: string = "info@nicoza.com";
  //Extra fields in API
  active: boolean = true;
  code: string = "code";
  description: string = "description";
  productArray = [];
  customerGroupArray = [];

  constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService
    , private inventoryService: InventoryService, private customerService: CustomerService) { }

  ngOnInit() {
    this.priceListForm = this.fb.group({
      "productId": ['', Validators.required],
      "customerGroupId": ['', Validators.required],
      "discount": ['', Validators.required],
      "minimumOrder": ['', Validators.required],
      "start_date": ['', Validators.required],
      "end_date": ['', Validators.required],
    })
    // this.filteredOptions = this.productId.valueChanges
    // .startWith(null)
    // .map(val => val ? this.filter(val) : this.options.slice());

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
  }

  // filter(val: string): string[] {
  //   return this.options.filter(option =>
  //     option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  // }

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

  get productId() {
    return this.priceListForm.controls.productId
  }

  get customerGroupId() {
    return this.priceListForm.controls.customerGroupId
  }

  get discount() {
    return this.priceListForm.controls.discount
  }

  get minimumOrder() {
    return this.priceListForm.controls.minimumOrder
  }

  get start_date() {
    return this.priceListForm.controls.start_date
  }

  get end_date() {
    return this.priceListForm.controls.end_date
  }

  submit(formValues) {
    this.setupService.addNewDiscount(formValues).subscribe(
      res => {
        this.successMsg = "New discount is added.";
        this.showSuccess();
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
      this.route.navigate(['/app/setup/product-discount'])
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
