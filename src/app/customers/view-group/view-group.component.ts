import { Router } from '@angular/router';
import { CustomerService } from './../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {
  memberArray: any;
  GroupName;
  customerGrpNameArray: any;
  value: { groupId: any; };
  isSuccess: boolean = true;
  errorMsg: string;
  successMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  permission;
  
  constructor(private router: ActivatedRoute, private customerService: CustomerService,
    private route: Router, private permissionService: PermissionService) { }

  ngOnInit() {
    this.value = { groupId: this.router.snapshot.params['id'] };
    this.customerService.viewMember(this.value).subscribe(
      res => {
        res = res[0].member
        this.memberArray = res;
      }
    )

    this.customerService.getOneCustomerGroups(this.value).subscribe(res => {
      this.customerGrpNameArray = res;
      this.GroupName = res[0].name;
    }, err => {

    })
  }

  modifyCustomer(customer) {
    this.permissionService.getModulePermissions().subscribe(resp => {
      this.permission = {
        txtCustomerManagement: resp[0].txtCustomerManagement,
      }
      if (this.permission.txtCustomerManagement == 'rw') {
        let id = customer.CustomerId._id;
        this.route.navigate(['/app/customers/modifyCustomer', { id }]);
      }
      else {
        this.errorMsg = "You Don't have the appropriate permission"
        this.showError();
      }
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
