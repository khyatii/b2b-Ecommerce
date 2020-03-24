import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SetupService } from '../../../services/setup.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modify-logistics',
  templateUrl: './modify-logistics.component.html',
  styleUrls: ['./modify-logistics.component.css']
})
export class ModifyLogisticsComponent implements OnInit {

  logisticServiceForm: FormGroup;
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
    })

    this.setupService.getOneLogisticsType(this.value).subscribe(res => {
      this.logistics_type.setValue(res[0].logistics_type);
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  submit(formValues) {
    formValues._id = this.value._id;
    this.setupService.modifyLogisticsType(formValues).subscribe(res => {
      this.successMsg = "Logistics Type is modified.";
      this.showSuccess();
    }, err => {
      if (err.err.status == "409") {
        this.errorMsg = "Logistics Type Already Exist";
        this.showError();
      } else {
        this.errorMsg = "Some Error Occured";
        this.showError();
      }
    })
  }

  get logistics_type() {
    return this.logisticServiceForm.controls.logistics_type
  }
  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.route.navigate(['/app/setup/logistic-service/logisticsType'])
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