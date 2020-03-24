import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from '../../../services/setup.service';

@Component({
  selector: 'app-add-logistics',
  templateUrl: './add-logistics.component.html',
  styleUrls: ['./add-logistics.component.css']
})
export class AddLogisticsComponent implements OnInit {

  logisticServiceForm: FormGroup;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;

  constructor(private fb: FormBuilder, private route: Router,private setupService: SetupService) { }

  ngOnInit() {
    this.logisticServiceForm = this.fb.group({
      "logistics_type": ['', Validators.required],
    })
  }

  submit(formValues) {
    this.setupService.addLogisticsType(formValues).subscribe(res => {
      this.successMsg = "Logistic Type is added.";
      this.showSuccess();
    }, err => {
      if (err.err.status == "409") {
        this.errorMsg = "Logistic Type Already Exist";
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