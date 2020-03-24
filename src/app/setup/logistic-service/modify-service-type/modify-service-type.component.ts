import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetupService } from '../../../services/setup.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modify-service-type',
  templateUrl: './modify-service-type.component.html',
  styleUrls: ['./modify-service-type.component.css']
})
export class ModifyServiceTypeComponent implements OnInit {

  logisticServiceForm: FormGroup;
  serviceTypeArray = [];
  logisticTypeArray = [];
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  value: { _id: any; };

  constructor(private fb: FormBuilder, private route: Router, private router: ActivatedRoute,
    private setupService: SetupService) { }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] }
    this.logisticServiceForm = this.fb.group({
      "logistics_type": ['', Validators.required],
      "service_type": ['', Validators.required],
      "service_name": ['', Validators.required],
    })
    this.setupService.getLogisticsTypes().subscribe(res => {
      this.logisticTypeArray = res;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
    this.setupService.getOneServiceType(this.value).subscribe(res => {
      this.logistics_type.setValue(res[0].logistics_type);
      this.service_type.setValue(res[0].service_type);
      this.service_name.setValue(res[0].service_name);
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })

  }

  get logistics_type() {
    return this.logisticServiceForm.controls.logistics_type
  }
  get service_type() {
    return this.logisticServiceForm.controls.service_type
  }
  get service_name() {
    return this.logisticServiceForm.controls.service_name
  }

  logisticType(val) {
    let data = {
      logistics_type: val.value
    }
    this.setupService.getServiceType(data).subscribe(res => {
      this.serviceTypeArray = res;

    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  submit(formValues) {
    formValues._id = this.value._id;
    this.setupService.modifyServiceType(formValues).subscribe(res => {
      this.successMsg = "Service Type is modified.";
      this.showSuccess();
    }, err => {
      if (err.err.status == "409") {
        this.errorMsg = "Service Type Already Exist";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
    })
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.route.navigate(['/app/setup/logistic-service/serviceType'])
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