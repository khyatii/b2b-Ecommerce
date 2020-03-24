import { AppError } from './../../apperrors/apperror';
import { Component, OnInit, style } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VasSelectionService } from './../../services/vas-selection.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vas-services',
  templateUrl: './vas-services.component.html',
  styleUrls: ['./vas-services.component.css'],
})
export class VasServicesComponent implements OnInit {
  selectedOption: string;
  printedOption: string;
  isSuccess = true;
  errorMsg: string;
  isError: boolean = true;
  addServicesForm: FormGroup;
  successMsg: String;

  constructor(private route: Router, private fb: FormBuilder, private vasSelectionService: VasSelectionService) {
  }
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
    this.addServicesForm = this.fb.group({
      Name: ['', Validators.required],
      customerCat: ['', Validators.required],
      billCycle: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      services: ['', Validators.required],
      subcat: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      slot: [''],
      "items": this.fb.array(
        [this.buildItem()]
      )
    });
  }
  buildItem() {
    return this.fb.group({
      'subcat': [''],
      'price': ['', Validators.required],
      'description': [''],
      'slot': ['']
    })
  }

  addItem() {
    (<FormArray>this.addServicesForm.controls['items']).push(this.buildItem());
  }

  subservicedata(service) {
    if (service.value == 'sales lead') {
      document.getElementById("salesLead").style.display = "block";
      document.getElementById("subservice").style.display = "none";
    }
    if (service.value !== 'sales lead') {
      document.getElementById("salesLead").style.display = "none";
      document.getElementById("subservice").style.display = "block";
    }
  }
  onSubmit(formValues) {
    this.vasSelectionService.postValueAddedServices(formValues).subscribe(resp => {
      this.successMsg = "Service Plan Added";
      this.showSuccess();
      setTimeout(() => {
        this.route.navigateByUrl('/app/vasselection/viewvas');
      }, 2000);
    }, (err) => {
      if (err instanceof AppError) {
        this.errorMsg = "Some Error Occured"
        this.showError();
      }
    })
  }

  removeItem(index) {
    const arrayControl = <FormArray>this.addServicesForm.controls['items'];
    arrayControl.removeAt(index);
  }

  get Name() {
    return this.addServicesForm.controls.Name
  }
  get billCycle() {
    return this.addServicesForm.controls.billCycle
  }
  get customerCat() {
    return this.addServicesForm.controls.customerCat
  }
  get paymentTerms() {
    return this.addServicesForm.controls.paymentTerms
  }
  get services() {
    return this.addServicesForm.controls.services
  }
  get subcat() {
    return this.addServicesForm.controls.subcat
  }
  get price() {
    return this.addServicesForm.controls.price
  }
  get description() {
    return this.addServicesForm.controls.description
  }
  get slot() {
    return this.addServicesForm.controls.slot
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
