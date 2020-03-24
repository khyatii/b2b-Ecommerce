import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { NotFoundError } from '../../apperrors/notfound';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-customer',
  templateUrl: './invite-customer.component.html',
  styleUrls: ['./invite-customer.component.css']
})
export class InviteCustomerComponent implements OnInit {

  constructor(private fb: FormBuilder, private customerService: CustomerService, private route: Router) { }
  invitationForm: any;
  customerGroupArray = [];
  customerArray = [];
  traderType: string;
  traderPhone: string;
  txtBuyerName: string;
  customerId;
  isShow: boolean = true;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  ngOnInit() {

    this.invitationForm = this.fb.group({
      "traderId": ['', Validators.required],
      "txtBuisnessEmail": ['', [Validators.required, Validators.email]],
      "txtCustomerGroup": ['']
    })

    this.customerService.getCustomerGroupsActive().subscribe(
      res => {
        this.customerGroupArray = res;
      })

    this.customerService.getActiveCustomer().subscribe(
      res => {
        this.customerArray = res;
      }
    )
  }

  get traderId() {
    return this.invitationForm.controls.traderId
  }

  get txtBuisnessEmail() {
    return this.invitationForm.controls.txtBuisnessEmail
  }

  get txtCustomerGroup() {
    return this.invitationForm.controls.txtCustomerGroup
  }

  submit(values) {
    values.txtTraderType = this.traderType;
    values.txtBuisnessPhone = this.traderPhone;
    values.txtBusinessName = this.txtBuyerName;
    values.customerId = this.customerId;
    this.customerService.postInvitationExisting(values).subscribe(
      res => {
        this.successMsg = "Customer has been added to the Group";
        this.showSuccess();
        this.isLoading = false;
      },
      err => {
        if (err.err.status == 401) {
          this.errorMsg = "This Customer Already added to this Group";
          this.showError();
          this.isLoading = false;
        }
        else {
          this.errorMsg = "Some Error Occured";
          this.showError();
          this.isLoading = false;
        }
      })
  }

  getCustomerDetails(buyerVal) {
    let data = {
      buyerId: buyerVal.value
    }
    this.customerService.getCustomerDetails(data).subscribe(res => {
      this.txtBuisnessEmail.setValue(res[0].txtBuisnessEmail);
      this.traderType = res[0].txtTraderType;
      this.traderPhone = res[0].txtBuisnessPhone;
      this.txtBuyerName = res[0].txtBusinessName;
      this.customerId = res[0]._id;
    })
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
      this.route.navigateByUrl('/app/customers/allCustomer');
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
