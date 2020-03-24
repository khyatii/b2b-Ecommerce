import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InputOutputService } from '../../services/inputOutput.service';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

  customerProfileData: FormGroup;
  isShow: boolean = false;

  constructor(private fb: FormBuilder, private route: Router, private customerService: CustomerService) { }

  ngOnInit() {

    this.customerProfileData = this.fb.group({
      "txtName": ['', Validators.required],
      "txtPhone": [''],
      "txtFax": [''],
      "txtTax": [''],
      "txtWebsite": [''],
      "txtRegistrationNum": ['', Validators.required],
      "txtEmail": ['', Validators.required],
      "txtMobile": ['', Validators.required],
      "txtPostal": ['', Validators.required],
      "txtPhysicalAddress": ['', Validators.required]
    })

  }

  get txtName() {
    return this.customerProfileData.controls.txtName
  }

  get txtRegistrationNum() {
    return this.customerProfileData.controls.txtRegistrationNum
  }

  get txtEmail() {
    return this.customerProfileData.controls.txtEmail
  }

  get txtMobile() {
    return this.customerProfileData.controls.txtMobile
  }

  get txtPostal() {
    return this.customerProfileData.controls.txtPostal
  }

  get txtPhysicalAddress() {
    return this.customerProfileData.controls.txtPhysicalAddress
  }

  showsuccessmodal() {
    this.isShow = true
  }

  submit(formvalue) {
    this.isShow = true;
    //this.showsuccessmodal();
    // setTimeout(() => this.isShow = true, 2000)
    // setTimeout(function(){ this.isShow= true; }, 3000);
    setTimeout(function () { this.isShow = false; }.bind(this), 3000);

  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      var img = (<HTMLInputElement>document.querySelector(".img"));
      var reader = new FileReader();
      reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }



}

