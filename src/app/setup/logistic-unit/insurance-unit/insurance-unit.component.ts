import { Component, OnInit } from '@angular/core';
import { AppError } from '../../../apperrors/apperror';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SetupService } from '../../../services/setup.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-insurance-unit',
  templateUrl: './insurance-unit.component.html',
  styleUrls: ['./insurance-unit.component.css']
})
export class InsuranceUnitComponent implements OnInit {

  warehouseUnitForm: FormGroup;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;

  constructor(private fb: FormBuilder, private route: Router, private setupService: SetupService) { }

  ngOnInit() {
    this.warehouseUnitForm = this.fb.group({
      "unit": [''],
      "type": "Insurance",
      "items": this.fb.array(
        [this.buildItem()]
      )
    })
  }

  get unit() {
    return this.warehouseUnitForm.controls.unit
  }

  submit(formValues) {
    this.setupService.addLogisticsUnits(formValues).subscribe(
      res => {
        this.successMsg = "Insurance Unit Added";
        this.showSuccess();
        setTimeout(function () {
          this.isShow = false;
          this.route.navigate(['/app/setup/logistic-unit/ViewInsurance'])
        }.bind(this), 2000);
      }, err => {
        this.errorMsg = "Unit Already Exists";
        this.showError();
        if (err instanceof AppError) { }
      })
  }
  buildItem() {
    return this.fb.group({
      "unit": ['', Validators.required],
    })
  }
  addItem() {
    (<FormArray>this.warehouseUnitForm.controls['items']).push(this.buildItem());
  }
  removeItem(index) {
    // this.options.splice(index, 1)
    (<FormArray>this.warehouseUnitForm.controls['items']).removeAt(index);
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
