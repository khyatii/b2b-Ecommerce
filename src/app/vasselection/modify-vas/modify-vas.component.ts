import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VasSelectionService } from './../../services/vas-selection.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-modify-vas',
  templateUrl: './modify-vas.component.html',
  styleUrls: ['./modify-vas.component.css']
})
export class ModifyVasComponent implements OnInit {
  modifyServicesForm: FormGroup;
  oneVasdata: any;
  name = [];
  serviceFeeData = [];
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  value;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private vasSelectionService: VasSelectionService, private router: Router) { }

  customerCategoryy = [
    { value: 'seller', viewValue: 'Seller' },
    { value: 'buyers', viewValue: 'Buyers' },
    { value: 'logistic', viewValue: 'Logistic Service Providers' }
  ];
  Services = [
    { value: 's1', viewValue: 'sales lead' },
    { value: 's2', viewValue: 'Advertising spots on portal  ' },
    { value: 's3', viewValue: 'Broadcast emails on new products' },
  ];
  billingCycle = [
    { value: 'monthly', viewValue: 'Monthly' },
    { value: 'peruse', viewValue: 'Per Use' },
  ];
  paymentTermss = [
    { value: 'pre', viewValue: 'Pre Pay' },
    { value: 'post', viewValue: 'Post Pay' },
  ]

  ngOnInit() {
    const localThis = this;
    this.value = { _id: this.route.snapshot.params['id'] }
    this.vasSelectionService.getoneVasService(this.value).subscribe(resp => {
      this.oneVasdata = resp;
      this.serviceFeeData = resp.serviceCat;
      this.modifyServicesForm.patchValue({
        Name: resp.name,
        customerCategory: resp.customerCategory,
        billCycle: resp.billingCycle,
        paymentTerms: resp.paymentTerms,
        services: resp.vasType
      })
      this.bindProduct();
      for (var i = 0; i < localThis.serviceFeeData.length; i++) {
        this.name.push(resp.serviceCat[i])
        localThis.modifyServicesForm.controls.items['controls'][i].controls.subcat['value'] = resp.serviceCat[i]['subcat'];
        localThis.modifyServicesForm.controls.items['controls'][i].controls.price['value'] = resp.serviceCat[i].price;
        localThis.modifyServicesForm.controls.items['controls'][i].controls.description['value'] = resp.serviceCat[i].description;

        localThis.modifyServicesForm.controls.items['controls'][i].controls.subcat['status'] = "VALID";
        localThis.modifyServicesForm.controls.items['controls'][i].controls.price['status'] = "VALID";
        localThis.modifyServicesForm.controls.items['controls'][i].controls.description['status'] = "VALID";
      }
    });
    this.modifyServicesForm = this.fb.group({
      'Name': ['', Validators.required],
      'customerCategory': ['', Validators.required],
      'billCycle': ['', Validators.required],
      'paymentTerms': ['', Validators.required],
      'services': ['', Validators.required],
      "items": this.fb.array(
        []
      ),
      'slot': [''],
      'subcat': [''],
      'price': ['', Validators.required],
      'description': [''],
    });
  }
  bindProduct() {
    const localThis = this;
    this.serviceFeeData.forEach(function (v, i) {
      (<FormArray>localThis.modifyServicesForm.controls['items']).push(localThis.buildItem());
      localThis.modifyServicesForm.controls.items['controls'][i].controls._id['value'] = v['_id'];
      localThis.modifyServicesForm.controls.items['controls'][i].controls._id['status'] = 'VALID';
    });
  }

  onSubmit(formval) {
    formval._id = this.oneVasdata._id;
    this.vasSelectionService.updateVasServices(formval).subscribe(resp => {
      this.successMsg = 'Service Plan Updated';
      this.showSuccess();
      setTimeout(function () {
        // this.router.navigateByUrl('/app/vasselection/viewvas');
      }.bind(this), 2000);
    }, (err) => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }
  buildItem() {
    return this.fb.group({
      "_id": [''],
      'slot': [''],
      'subcat': [''],
      "hiddenId": [''],
      'price': ['', Validators.required],
      'description': [''],
    })
  }
  get Name() {
    return this.modifyServicesForm.controls.Name
  }
  get _id() {
    return this.modifyServicesForm.controls._id
  }
  get billCycle() {
    return this.modifyServicesForm.controls.billCycle
  }
  get customerCategory() {
    return this.modifyServicesForm.controls.customerCategory
  }
  get paymentTerms() {
    return this.modifyServicesForm.controls.paymentTerms
  }
  get services() {
    return this.modifyServicesForm.controls.services
  }
  get subcat() {
    return this.modifyServicesForm.controls.subcat
  }
  get price() {
    return this.modifyServicesForm.controls.price
  }
  get description() {
    return this.modifyServicesForm.controls.description
  }
  get slot() {
    return this.modifyServicesForm.controls.slot
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
