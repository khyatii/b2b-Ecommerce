import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modify-customerfrom-group',
  templateUrl: './modify-customerfrom-group.component.html',
  styleUrls: ['./modify-customerfrom-group.component.css']
})
export class ModifyCustomerfromGroupComponent implements OnInit {

  
  customerGroupForm:FormGroup;
  options = [
    'One',
    'Two',
    'Three'
  ];
  filteredOptions: Observable<string[]>;

  constructor(private fb:FormBuilder,private route:Router ,private customerService:CustomerService) { }

  ngOnInit() {
  this.customerGroupForm = this.fb.group({
      "txtName":['',Validators.required],
      "txtMember":['',Validators.required],
      "txtStatus":['',Validators.required],
    })
    this.filteredOptions = this.txtMember.valueChanges
    .startWith(null)
    .map(val => val ? this.filter(val) : this.options.slice());
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  get txtMember()  { 
    return this.customerGroupForm.controls.txtMember
    }

  get txtName()  {   
    return this.customerGroupForm.controls.txtName
  }

  get txtStatus()  {   
    return this.customerGroupForm.controls.txtStatus
  }

  submit(formValues){
    this.route.navigate(['/app/customers/customerGroup'])
    this.customerService.modifyCustomerGroups(formValues).subscribe(res=>{
    },
    (err)=>{
      if(err instanceof AppError){
        
      }
    })
    
  }
}
