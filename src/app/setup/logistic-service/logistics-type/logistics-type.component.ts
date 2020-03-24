import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetupService } from '../../../services/setup.service';

@Component({
  selector: 'app-logistics-type',
  templateUrl: './logistics-type.component.html',
  styleUrls: ['./logistics-type.component.css']
})
export class LogisticsTypeComponent implements OnInit {

  logisticTypeArray: Array<object>;
  successMsg: string;
  isSuccess: boolean = true;
  errorMsg: string;
  isError: boolean = true;
  value;

  constructor(private route: Router, private setupService: SetupService) { }

  ngOnInit() {
    this.setupService.getLogisticsTypes().subscribe(res => {
      this.logisticTypeArray = res;
    }, err => {
      this.errorMsg = "Some Error Occured";
      this.showError();
    })
  }

  modify(objData) {
    let id = objData._id;
    this.route.navigate(['/app/setup/logistic-service/modifyLogistics', { id }]);
  }

  delete(objData, index) {
		var id = objData._id;
		this.value = { id };
		if (confirm(`Are you sure to delete ` + objData.logistics_type + ` ?`)) {
			this.setupService.deleteLogisticsType(this.value).subscribe(dataany => {
				this.logisticTypeArray.splice(index, 1);
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
