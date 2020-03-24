import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TeamMemberService } from '../../services/teamMember.service';

@Component({
  selector: 'app-modify-team-members',
  templateUrl: './modify-team-members.component.html',
  styleUrls: ['./modify-team-members.component.css']
})
export class ModifyTeamMembersComponent implements OnInit {
  valueId: any;
  value: { _id: any; };
  imagePath: any;
  imageUploaded: FormData;
  imageArray: any = [];
  idRes: any;
  permissionForm: FormGroup;
  searchProductForm: FormGroup;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private teamMember: TeamMemberService, private router: ActivatedRoute,
    private route: Router) {
    this.permissionForm = this.fb.group({
      "txtFirstName": [{ value: '', disabled: '' }],
      "txtEmail": [{ value: '', disabled: true }],
      "txtPhone": ['',],
      "txtFax": ['',],
      "txtPostalAddress": ['',],
      "txtPhysicalAddress": ['',],
      "txtPaymentDetails": ['',],
      "txtID": ['',],
      "txtTaxNumber": ['',],
      "txtDob": ['',],
      "txtUsername": ['',],
      "txtInventoryPermission": [''],
      "txtSettingsPermission": ['',],
      "txtStockPermission": ['',],
      // "txtReportsPermission":['',],
      "txtCustomerManagement": ['',],
      "VendorsPermission": [''],
      "PurchaseOrderPermission": [''],
      "SalesOrderPermission": [''],
      "txtLogisticsPermission": ['',],
    })
  }

  ngOnInit() {
    this.value = { _id: this.router.snapshot.params['id'] };
    this.valueId = this.router.snapshot.params['id'];
    this.teamMember.getOne(this.value).subscribe(
      res => {
        res = res.doc['0'];
        this.permissionForm.controls['txtFirstName'].setValue(res.firstName);
        this.permissionForm.controls['txtEmail'].setValue(res.email);
        this.permissionForm.controls['txtPhone'].setValue(res.txtPhone);
        this.permissionForm.controls['txtFax'].setValue(res.txtFax);
        this.permissionForm.controls['txtPostalAddress'].setValue(res.txtPostalAddress);
        this.permissionForm.controls['txtPhysicalAddress'].setValue(res.txtPhysicalAddress);
        this.permissionForm.controls['txtPaymentDetails'].setValue(res.txtPaymentDetails);
        this.permissionForm.controls['txtID'].setValue(res.txtID);
        this.permissionForm.controls['txtTaxNumber'].setValue(res.txtTaxNumber);
        this.permissionForm.controls['txtDob'].setValue(res.txtDob);
        this.permissionForm.controls['txtUsername'].setValue(res.txtUsername);
        this.permissionForm.controls['txtInventoryPermission'].setValue(res.txtInventoryPermission);
        this.permissionForm.controls['txtSettingsPermission'].setValue(res.txtSettingsPermission);
        this.permissionForm.controls['txtStockPermission'].setValue(res.txtStockPermission);
        // this.permissionForm.controls['txtReportsPermission'].setValue(res.txtReportsPermission);
        this.permissionForm.controls['txtCustomerManagement'].setValue(res.txtCustomerManagement);
        this.permissionForm.controls['txtLogisticsPermission'].setValue(res.txtLogisticsPermission);
        this.permissionForm.controls['VendorsPermission'].setValue(res.VendorsPermission);
        this.permissionForm.controls['PurchaseOrderPermission'].setValue(res.PurchaseOrderPermission);
        this.permissionForm.controls['SalesOrderPermission'].setValue(res.SalesOrderPermission);

        this.imagePath = res.photo;

        this.idRes = res._id;
      }
    )
  }

  get txtFirstName() {
    return this.searchProductForm.controls.txtFirstName
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
    let count = fileList.length;
    let imgArray = fileList[0];
    this.imageArray.push(imgArray);
  }

  submit(formValues) {
    formValues._id = this.idRes;
    this.isLoading = true;
    let fileCount: number = this.imageArray.length;
    this.imageUploaded = new FormData();
    if (fileCount > 0) {
      for (let i = 0; i < fileCount; i++) {
        this.imageUploaded.append('photo', this.imageArray[i]);
      }

    }
    else {
      this.imageUploaded = null;
    }

    this.teamMember.updateOne(formValues).subscribe(res => {
      if (this.imageUploaded != undefined || this.imageUploaded != null) {
        this.teamMember.updatePhoto(this.valueId, this.imageUploaded).subscribe(
          res => {
            this.successMsg = "Photo updated";
            this.showSuccess();
            this.isLoading = false;
            setTimeout(() => {
              this.route.navigate(['app/companyDetails/teamMembers'])
              this.successMsg = "Member permissions are updated."
              this.showSuccess();
            }, 2000)
          }, err => {
            this.errorMsg = "Some error Occured.";
            this.showError();
            this.isLoading = false;
          }
        )
      }
      else {
        this.isLoading = false;
        setTimeout(() => {
          this.route.navigate(['app/companyDetails/teamMembers'])
          this.successMsg = "Member permissions are updated."
          this.showSuccess();
        }, 2000)
      }



    },
      err => {
        this.errorMsg = "Some error Occured"
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
