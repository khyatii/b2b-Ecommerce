import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { InputOutputService } from '../../services/inputOutput.service';
import { NotFoundError } from '../../apperrors/notfound';

@Component({
  selector: 'app-modify-customer',
  templateUrl: './modify-customer.component.html',
  styleUrls: ['./modify-customer.component.css']
})
export class ModifyCustomerComponent implements OnInit {
  customerGroupArray: any;
  id: any;
  value: { _id: any; };
  invitationForm: FormGroup;
  isShow: boolean = true;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private route: Router, private customerService: CustomerService, private inputOutputService: InputOutputService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.customerService.getCustomerGroups().subscribe(res => {
      this.customerGroupArray = res;
    })
    this.invitationForm = this.fb.group({
      "txtBusinessName": [''],
      "txtBuisnessEmail": [''],
      "txtTraderType": [''],
      "txtBuisnessPhone": [''],
      "txtContactName": [''],
      // "txtCustomerGroup":[''],
      "txtContactEmail": [''],
      "txtPostalAdress": [''],
      "txtPhysicalAddress": [''],
      "txtWebsite": [''],
      "txtPhone": ['']
    })

    this.value = { _id: this.router.snapshot.params['id'] };

    this.customerService.getOneCustomer(this.value).subscribe(
      resp => {
        this.txtBusinessName.setValue(resp[0].txtBusinessName);
        this.txtBuisnessEmail.setValue(resp[0].txtBuisnessEmail);
        this.txtTraderType.setValue(resp[0].txtTraderType);
        this.txtBuisnessPhone.setValue(resp[0].txtBuisnessPhone);
        this.txtContactName.setValue(resp[0].txtContactName);
        // this.txtCustomerGroup.setValue(resp[0].txtCustomerGroup);
        this.txtContactEmail.setValue(resp[0].txtContactEmail);
        this.txtPostalAdress.setValue(resp[0].txtPostalAdress);
        this.txtPhysicalAddress.setValue(resp[0].txtPhysicalAddress);
        this.txtWebsite.setValue(resp[0].txtWebsite);
        this.txtPhone.setValue(resp[0].txtPhone);
        this.id = resp[0]._id
      }
    )
  }

  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // keyPress(event: any) {
  //   if (!((event.keyCode > 95 && event.keyCode < 106)
  //     || (event.keyCode > 47 && event.keyCode < 58)
  //     || event.keyCode == 8)) {
  //     event.preventDefault();
  //   }
  // }

  get txtBusinessName() {
    return this.invitationForm.controls.txtBusinessName
  }

  get txtBuisnessEmail() {
    return this.invitationForm.controls.txtBuisnessEmail
  }

  get txtTraderType() {
    return this.invitationForm.controls.txtTraderType
  }

  get txtBuisnessPhone() {
    return this.invitationForm.controls.txtBuisnessPhone
  }

  get txtContactName() {
    return this.invitationForm.controls.txtContactName
  }

  // get txtCustomerGroup()  {   
  //   return this.invitationForm.controls.txtCustomerGroup
  // }

  get txtContactEmail() {
    return this.invitationForm.controls.txtContactEmail
  }

  get txtPostalAdress() {
    return this.invitationForm.controls.txtPostalAdress
  }

  get txtPhysicalAddress() {
    return this.invitationForm.controls.txtPhysicalAddress
  }

  get txtWebsite() {
    return this.invitationForm.controls.txtWebsite
  }

  get txtPhone() {
    return this.invitationForm.controls.txtPhone
  }

  modify(formValues) {
    formValues._id = this.id;
    this.isLoading = true;

    this.customerService.modifyCustomer(formValues).subscribe(
      res => {
        this.successMsg = "Customer Details Updated";
        this.showSuccess();
        this.isLoading = false;

      },
      err => {
        this.errorMsg = "Some Error Occured";
        this.showError();
        this.isLoading = false;
      }
    )
  }

  showSuccess() {
    window.scrollTo(500, 0);
    this.isSuccess = false;
    setTimeout(() => {
      this.isSuccess = true;
      this.route.navigate(['/app/customers/allCustomer']);
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
