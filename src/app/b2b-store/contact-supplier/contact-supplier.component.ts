import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidation } from '../../validators/emailValid';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-contact-supplier',
  templateUrl: './contact-supplier.component.html',
  styleUrls: ['./contact-supplier.component.scss']
})
export class ContactSupplierComponent implements OnInit {
  product: any;
  phone_no: any;
  currentCityLocation: any;
  callingCode: any;
  savedDetails = false;
  contactSupplierForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ContactSupplierComponent>, private notify: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private UserService: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    this.product = this.data['product'];
    this.UserService.getCurrentLocations().subscribe(resp => {
      this.currentCityLocation = resp.city;
      this.callingCode = resp.location.calling_code;
      this.callingCode = '+' + String(this.callingCode);
      this.contactSupplierForm.controls['calling_code'].setValue(this.callingCode);
      this.contactSupplierForm.controls['city'].setValue(this.currentCityLocation);
    })

    this.contactSupplierForm = this.fb.group({
      'email': [null, [Validators.required, EmailValidation.emailValid]],
      'phone': [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      'name': [null, [Validators.required, Validators.minLength(3)]],
      'calling_code': [this.callingCode, Validators.required],
      'city': [this.currentCityLocation, Validators.required],
      'query': [null],
    })

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  submitUserDetails(val) {
    let sellerID = this.product.traderId['_id'];
    val['seller'] = sellerID;
    val['product'] = this.product;

    this.UserService.contactSupplier(val).subscribe(res => {
      this.savedDetails = true;
      this.phone_no = res.data.phone;
      let notification = {};
      notification['recieverId'] = res.data.seller.email;
      notification['senderId'] = val.email;
      notification['notificationMessage'] = 'Buyer ' + val.name + ' has contact you for your product.';
      notification['pageLink'] = 'app/salesorders/enquiry';
      this.notify.sendNotLogedInUserNotification(notification);
      setTimeout(() => {
        this.onNoClick();
      }, 5000);
    })
  }

  keyPress(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  get name() {
    return this.contactSupplierForm.controls.name
  }
  get email() {
    return this.contactSupplierForm.controls.email
  }
  get phone() {
    return this.contactSupplierForm.controls.phone
  }
}
