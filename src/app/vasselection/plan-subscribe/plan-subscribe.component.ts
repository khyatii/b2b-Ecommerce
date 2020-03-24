import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VasSelectionService } from './../../services/vas-selection.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-plan-subscribe',
  templateUrl: './plan-subscribe.component.html',
  styleUrls: ['./plan-subscribe.component.scss']
})
export class PlanSubscribeComponent implements OnInit {
  selectedOption: string;
  printedOption: string;
  isSuccess = true;
  isError = true;
  addServicesForm: FormGroup;
  successMsg: String;
  planService = [];
  Fee: any = null;
  description: any = null
  billingCycle;
  Monthly;
  customerCategory;
  paymentTerms;
  vasType;
  errorMsg;
  constructor(private route: Router, private fb: FormBuilder, private vasSelectionService: VasSelectionService) {

  }

  ngOnInit() {
    this.addServicesForm = this.fb.group({
      customerCat: ['', Validators.required],
      Subscribe: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      serviceFee: ['', Validators.required],
    });
    this.vasSelectionService.getAllVasServices().subscribe(res => {
      res.filter(use => {
        this.planService = this.planService.concat(use.name)
      })
    })
  }
  ServiceName(ev) {

    var id = { name: ev }
    this.vasSelectionService.planVasServiceByName(id).subscribe(res => {
      this.billingCycle = res.data[0].billingCycle;
      this.customerCategory = res.data[0].customerCategory
      this.paymentTerms = res.data[0].paymentTerms
      this.vasType = res.data[0].vasType
      this.Fee = res.data[0].Fee
      this.description = res.data[0].description
    })
  };
  onSubmit(formValues) {
  }

}
