import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { AppError } from '../../apperrors/apperror';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { ConfigurationService } from '../../services/configuration.service';
import { CompanyDetailService } from '../../services/company-details.services';

@Component({
  selector: 'app-pop-up-request-quotation',
  templateUrl: './pop-up-request-quotation.component.html',
  styleUrls: ['./pop-up-request-quotation.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PopUpRequestQuotationComponent implements OnInit {

  quoutationForm: FormGroup;
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isShow: boolean = true;
  currencyArray = [];
  LocationArray = [];
  minDate = new Date();

  constructor(private route: Router, private configurationService: ConfigurationService,
    public dialogRef: MatDialogRef<PopUpRequestQuotationComponent>, private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private companyDetailService: CompanyDetailService) { }

  ngOnInit() {
    this.quoutationForm = this.fb.group({
      "txtCurrency": ['', Validators.required],
      "txtPaymentTerms": ['', Validators.required],
      "txtClosingDate": ['', Validators.required],
      "txtDeliveryLocation": ['', Validators.required],
      "txtShipping": ['', Validators.required],
      "txtOrderQuantity": ['', Validators.required],
    })

    this.configurationService.getCurrency().subscribe(resp => {
      this.currencyArray = resp;
    })

    this.companyDetailService.getLocation().subscribe(res => {
      this.LocationArray = res
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  submit(formValues) {
    formValues.data = this.data.resultArray;
    this.isShow = true;
    this.inventoryService.postSearchSupplierQuotations(formValues).subscribe(res => {
      this.successMsg = 'Quotation request is sent Successfully.';
      this.showSuccess();
    }, (err) => {
      if (err instanceof AppError) {
        this.errorMsg = "Some error occured"
        this.showError();
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  get txtCurrency() {
    return this.quoutationForm.controls.txtCurrency
  }
  get txtPaymentTerms() {
    return this.quoutationForm.controls.txtPaymentTerms
  }
  get txtClosingDate() {
    return this.quoutationForm.controls.txtClosingDate
  }
  get txtDeliveryLocation() {
    return this.quoutationForm.controls.txtDeliveryLocation
  }
  get txtShipping() {
    return this.quoutationForm.controls.txtShipping
  }
  get txtOrderQuantity() {
    return this.quoutationForm.controls.txtOrderQuantity
  }
  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
      this.dialogRef.close();
      this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
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
