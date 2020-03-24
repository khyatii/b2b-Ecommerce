import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SetupService } from '../../services/setup.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {
  approvalForm:FormGroup;
  traderType
  constructor(private fb:FormBuilder,private route:Router, 
    public userService:UserService,private SetupService:SetupService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(res=>{
      res = res.doc;
      this.traderType = res[0].trader_type;
    })
    this.SetupService.getApproval().subscribe(res=>{
      this.approvalForm.controls.txtProduct.setValue(res[0].txtProduct)
      this.approvalForm.controls.txtCategorry.setValue(res[0].txtCategorry)
      this.approvalForm.controls.txtPriceList.setValue(res[0].txtPriceList)
      this.approvalForm.controls.txtDiscount.setValue(res[0].txtDiscount)
    })
    this.approvalForm = this.fb.group({
      "txtProduct":[''],
      "txtCategorry":[''],
      "txtPriceList":[''],
      "txtDiscount":[''],
		})
  }
	get txtProduct()  { 
    return this.approvalForm.controls.txtProduct
  }

  submit(formValues){
    this.SetupService.addApproval(formValues).subscribe(res=>{
    })
  }
}
