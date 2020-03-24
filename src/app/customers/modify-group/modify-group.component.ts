import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InputOutputService } from '../../services/inputOutput.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AppError } from '../../apperrors/apperror';

@Component({
  selector: 'app-modify-group',
  templateUrl: './modify-group.component.html',
  styleUrls: ['./modify-group.component.css']
})
export class ModifyGroupComponent implements OnInit {
  value: { groupId: any; };
  successMsg: string;
  addedMmemberArray;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  isLoading: boolean = false;
  memberArray: any;
  memberdata = [];
  customerGroupForm: FormGroup;
  options = [
    'One',
    'Two',
    'Three'
  ];
  selectedItems = [];
  filteredOptions: Observable<string[]>;

  constructor(private fb: FormBuilder, private route: Router, private customerService: CustomerService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.customerService.getActiveCustomer().subscribe(res => {
      this.memberdata = res.dataItems;
    })
    this.value = { groupId: this.router.snapshot.params['id'] };

    this.customerGroupForm = this.fb.group({
      "name": ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{0,20}$/)]],
      "member": [''],
      "status": ['', Validators.required],
    })
    this.filteredOptions = this.member.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());


    this.customerService.viewMember(this.value).subscribe(
      res => {
        res = res[0].member;
        this.addedMmemberArray = res;
      }
    )
    var that = this
    this.customerService.getOneCustomerGroups(this.value).subscribe(
      resp => {
        let temp2 = resp[0].member;
        that.name.setValue(resp[0].name);
        that.status.setValue(resp[0].status);

        // for(let i=0;i<this.memberdata.length;i++){
        //   for (let j=0;j<temp2.length;){
        //     if(this.memberdata[i]._id == temp2[j].CustomerId){
        //       this.memberdata.splice(i,1);
        //       i=i-1;
        //       j=j+1;
        //       break;       
        //     }  
        //     else{
        //       j=j+1;
        //     }
        //   }	
        // }
      })

  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
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
    this.isLoading = true;
    formValues._id = this.value.groupId;
    this.customerService.modifyCustomerGroups(formValues).subscribe(res => {
      this.successMsg = "Group Details Updated";
      this.showSuccess();
      this.isLoading = false;
      setTimeout(() => {
        this.route.navigate(['/app/customers/customerGroup'])
      }, 2000)
    },
      (err) => {
        this.errorMsg = "Some Error Occured while adding member";
        this.showError();
        this.isLoading = false;
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
