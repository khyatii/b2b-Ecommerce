import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { AppError } from '../../../apperrors/apperror';
import { Router } from '@angular/router';
import { SetupService } from '../../../services/setup.service';


@Component({
  selector: 'app-add-service-catalogue',
  templateUrl: './add-service-catalogue.component.html',
  styleUrls: ['./add-service-catalogue.component.css']
})
export class AddServiceCatalogueComponent implements OnInit {

  serviceCatalogueForm: FormGroup;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  logisticsTypeMultiple = [];
  ServicesCategories = [];
  serviceName = [];
  Units = [];
  currencyArray = [];
  logisticTypeArray = [];
  logisticsTypeArr = [];
  resultArray = [];
  logisticsType;
  logisticTypee;

  constructor(private fb: FormBuilder, private userLogisticsService: UserLogisticsService,
    private route: Router, private setupService: SetupService) { }

  ngOnInit() {
    this.serviceCatalogueForm = this.fb.group({
      "ServiceCategory": ['', Validators.required],
      "ServiceName": ['', Validators.required],
      "ServiceDescription": ['', Validators.required],
      // "ServiceDescription": ['', Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)],
      "Unit": ['', Validators.required],
      "PricePerUnit": ['', Validators.required],
      "ServiceUrl": ['', Validators.pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)],
      "PriceRules": [''],
      "logistics_type": ['', Validators.required]
    })

    this.setupService.getLogisticTypes().subscribe(res => {
      this.logisticTypeArray = res[0].logistics_type;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })

    this.userLogisticsService.getServicesCategories().subscribe(res => {
      this.logisticsType = res[0].logistics_type;
      this.ServicesCategories = res[0].type;
      this.serviceName = res[0].service;

      this.userLogisticsService.getUnits().subscribe(resp => {
        this.Units = resp;
      })
    })

  }

  logisticChange(e) {
    this.logisticTypee = { logistic_type: e.value };

    // this.userLogisticsService.getServicesCategoryByType(this.logisticTypee).subscribe(res => {
    // })
    // var service_type = { service_type: e.value }
    // this.setupService.getType(service_type).subscribe(res => {
    //   this.logisticsTypeArr = res;
    //   for (let i = 0; i < this.logisticsTypeArr.length; i++) {
    //     for (let j = 0; j < this.ServicesCategories.length; j++) {
    //       if (res[i].service_type == this.ServicesCategories[j]) {
    //         this.resultArray = this.resultArray.concat(this.ServicesCategories[j]);
    //       }
    //     }
    //   }
    // })
  }

  getLogiUnits(x) {
  }

  submit(formValues) {
    formValues.logisticTypee=this.logisticTypee
    this.userLogisticsService.addWarehouseCatalogue(formValues).subscribe(res => {
      this.successMsg = "Service Catalogue Added";
      this.showSuccess();
    }, err => {
      if (err.err.status == "502") {
        this.errorMsg = "Service Name Already Exists";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
    })
  }

  get ServiceCategory() {
    return this.serviceCatalogueForm.controls.ServiceCategory
  }
  get ServiceName() {
    return this.serviceCatalogueForm.controls.ServiceName
  }
  get ServiceDescription() {
    return this.serviceCatalogueForm.controls.ServiceDescription
  }
  get Unit() {
    return this.serviceCatalogueForm.controls.Unit
  }
  get PricePerUnit() {
    return this.serviceCatalogueForm.controls.PricePerUnit
  }
  get ServiceUrl() {
    return this.serviceCatalogueForm.controls.ServiceUrl
  }
  get PriceRules() {
    return this.serviceCatalogueForm.controls.PriceRules
  }
  get logistics_type() {
    return this.serviceCatalogueForm.controls.logistics_type
  }

  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
      this.route.navigate(['/logistic/setup/service-catalogue/view'])
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
