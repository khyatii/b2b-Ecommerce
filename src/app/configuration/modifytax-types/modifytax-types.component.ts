import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms'; import { ConfigurationService } from '../../services/configuration.service';
import { AppError } from '../../apperrors/apperror';
;

@Component({
  selector: 'app-modifytax-types',
  templateUrl: './modifytax-types.component.html',
  styleUrls: ['./modifytax-types.component.css']
})
export class ModifytaxTypesComponent implements OnInit {

  addTaxTypeForm: FormGroup
  isHide: boolean = false;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  email: string = 'info@nicoza.com';
  id: number = 1;

  constructor(private fb: FormBuilder, private route: Router, private configurationService: ConfigurationService) {

  }

  ngOnInit() {
    this.addTaxTypeForm = this.fb.group({
      "tax_name": ['VAT', Validators.required],
      "tax_code": ['VAT01', Validators.required],
      "computedTax": [''],
      "tax_lines": [''],
      "tax_line_percent": [''],
      "compound_tax": [''],
      "compound_tax_percent": [''],
    })

    this.configurationService.getTaxType().subscribe(res => { },
      err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
        if (err instanceof AppError) {

        }
      }
    )
  }

  get tax_name() {
    return this.addTaxTypeForm.controls.tax_name
  }

  get tax_code() {
    return this.addTaxTypeForm.controls.tax_code
  }

  showCompoundTax() {
    this.isHide = !this.isHide;
  }

  submit(formValues) {
    formValues.email = this.email;
    formValues.id = this.id;
    // this.inputOutputService.priceListArray.push(formValues)
    this.configurationService.modifyTaxType(formValues).subscribe(
      res => {
        this.successMsg = "Tax Type is modified.";
        this.showSuccess();
        this.route.navigate(['/app/config/taxType'])
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
