import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AppError } from '../../apperrors/apperror';


@Component({
  selector: 'app-add-newgroup',
  templateUrl: './add-newgroup.component.html',
  styleUrls: ['./add-newgroup.component.css']
})
export class AddNewgroupComponent implements OnInit {

  customerGroupForm: FormGroup;
  memberArray: any;
  filteredOptions: Observable<string[]>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private route: Router, private customerService: CustomerService) { }

  ngOnInit() {
    this.customerGroupForm = this.fb.group({
      "name": ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)]],
      "member": ['', Validators.required],
      "status": ['', Validators.required],
    })
    this.customerService.getActiveCustomer().subscribe(
      res => {
        this.memberArray = res;
      })
  }

  get member() {
    return this.customerGroupForm.controls.member
  }
  get name() {
    return this.customerGroupForm.controls.name
  }
  get status() {
    return this.customerGroupForm.controls.status
  }
  submit(formValues) {
    this.customerService.addCustomerGroups(formValues).subscribe((res) => {
      this.successMsg = "Customer Group Added";
      this.showSuccess();
      this.isLoading = false;
      this.route.navigate(['/app/customers/customerGroup'])
    }, (err) => {
      if (err.err.status == '401') {
        this.errorMsg = "CustomerGroup Already available";
        this.showError();
      }
      this.isLoading = false;
      if (err instanceof AppError) { }
    })
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
