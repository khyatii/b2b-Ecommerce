import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogisticsService } from '../../../services/userLogistics.Service';
import { SetupService } from '../../../services/setup.service';

@Component({
  selector: 'app-modify-service-catalogue',
  templateUrl: './modify-service-catalogue.component.html',
  styleUrls: ['./modify-service-catalogue.component.css']
})
export class ModifyServiceCatalogueComponent implements OnInit {

  serviceCatalogueForm: FormGroup;
  value: { _id: any };
  ServicesCategories = [];
  logisticsTypeMultiple = [];
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  Units = [];
  ServicesNamedata = [];
  serviceName = [];
  logisticTypeArray = [];
  data;
  logisticsType;

  constructor(private fb: FormBuilder, private router: ActivatedRoute, private route: Router,
    private userLogisticsService: UserLogisticsService, private setupService: SetupService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }

    this.serviceCatalogueForm = this.fb.group({
      "ServiceCategory": ['', Validators.required],
      "ServiceName": ['', Validators.required],
      "ServiceDescription": ['', Validators.required],
      "Unit": ['', Validators.required],
      "PricePerUnit": ['', Validators.required],
      "ServiceUrl": ['', Validators.pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)],
      "PriceRules": [''],
      "logistics_type": ['']
    })

    this.setupService.getLogisticTypes().subscribe(res => {
      this.logisticTypeArray = res[0].logistics_type_multiple;
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


    this.userLogisticsService.GetOneWarehouseCatalogue(this.value).subscribe(
      resp => {
        if (resp[0].logisticsType != undefined) {
          this.logistics_type.setValue(resp[0].logisticsType);
        }
        this.ServiceCategory.setValue(resp[0].ServiceCategory);
        this.ServiceName.setValue(resp[0].ServiceName);
        this.ServiceDescription.setValue(resp[0].ServiceDescription);
        this.Unit.setValue(resp[0].Unit);
        this.PricePerUnit.setValue(resp[0].PricePerUnit);
        this.ServiceUrl.setValue(resp[0].ServiceUrl);
        this.PriceRules.setValue(resp[0].PriceRules);
      })
    this.userLogisticsService.getServicesCategories().subscribe(res => {
      this.ServicesCategories = res[0].type;
      this.ServicesNamedata = res[0];
      this.serviceName = res[0].service
    })

  }


  submit(formValues) {
    formValues._id = this.value._id;
    this.userLogisticsService.UpdateWarehouseCatalogue(formValues).subscribe(res => {
      this.successMsg = "Service Catalogue Updated";
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
