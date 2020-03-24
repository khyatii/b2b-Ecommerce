import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetupService } from '../../../services/setup.service';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.css']
})
export class ServiceTypeComponent implements OnInit {

  serviceTypeArray: Array<object>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  searchText:any;
  isError: boolean = true;
  value;

  constructor(private route: Router, private setupService: SetupService) { }

  ngOnInit() {
    this.setupService.getService().subscribe(res => {
      this.serviceTypeArray = res;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  modify(objData) {
    let id = objData._id;
    this.route.navigate(['/app/setup/logistic-service/modify', { id }]);
  }

  delete(objData, index) {
		var id = objData._id;
		this.value = { id };
		if (confirm(`Are you sure to delete ` + objData.service_type + ` ?`)) {
			this.setupService.deleteServiceType(this.value).subscribe(dataany => {
				this.serviceTypeArray.splice(index, 1);
			}, err => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})
		}
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
