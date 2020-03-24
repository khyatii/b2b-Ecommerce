import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { NotificationService } from './../../services/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {

  enquiryArray = [];
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  successMsg;
  searchText;
  
  constructor(private notify: NotificationService, private route: Router,
    private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getContactSupplier().subscribe(res => {
      this.enquiryArray = res;
    }, (err) => {
      this.errorMsg = "Some Error Occured";
      this.showError();
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
