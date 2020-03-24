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
  selector: 'app-modify-disount',
  templateUrl: './modify-disount.component.html',
  styleUrls: ['./modify-disount.component.css']
})
export class ModifyDisountComponent implements OnInit {
  idRes: any;
  value: { _id: any; };

  priceListForm: FormGroup;
  options = [
    'One',
    'Two',
    'Three'
  ];
  filteredOptions: Observable<string[]>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  minDate = new Date();
  email: string = "info@nicoza.com";
  id: number = 1;
  //Extra fields in API
  active: boolean = true;
  code: string = "code";
  description: string = "description";
  productArray = [];
  customerGroupArray = [];

  constructor(private fb: FormBuilder, private route: Router, private inputOutputService: InputOutputService,
    private setupService: SetupService, private router: ActivatedRoute,
    private inventoryService: InventoryService, private customerService: CustomerService) { }

  ngOnInit() {

    this.value = { _id: this.router.snapshot.params['id'] }

    this.priceListForm = this.fb.group({
      "productId": ['', Validators.required],
      "customerGroupId": ['', Validators.required],
      "discount": ['', Validators.required],
      "minimumOrder": ['', Validators.required],
      "start_date": ['', Validators.required],
      "end_date": ['', Validators.required],
    })
    this.filteredOptions = this.productId.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());

    this.setupService.getOneProductDiscount(this.value).subscribe(
      res => {
        this.productId.setValue(res[0].productId._id);
        this.customerGroupId.setValue(res[0].customerGroupId._id);
        this.discount.setValue(res[0].discount);
        this.minimumOrder.setValue(res[0].minimumOrder);
        this.start_date.setValue(res[0].start_date);
        this.end_date.setValue(res[0].end_date);
        this.idRes = res[0]._id
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
        this.customerGroupArray = res2;
      }
    )
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

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

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
    formValues._id = this.idRes;
    this.setupService.modifyDiscount(formValues).subscribe(
      res => {
        this.successMsg = "New discount is modified.";
        this.showSuccess();
        this.route.navigate(['/app/setup/product-discount'])
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
