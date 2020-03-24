import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetupService } from '../../../services/setup.service';

@Component({
	selector: 'app-view-warehouse-unit',
	templateUrl: './view-warehouse-unit.component.html',
	styleUrls: ['./view-warehouse-unit.component.css']
})
export class ViewWarehouseUnitComponent implements OnInit {

	industryArray: Array<object>;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	value;
	type;

	constructor(private route: Router, private setupService: SetupService) { }

	ngOnInit() {
		this.type = { type: "Warehouse" }

		this.setupService.getLogisticsUnit(this.type).subscribe(res => {
			this.industryArray = res;
		}, err => {
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

	modify(objData) {
		let id = objData._id;
		this.route.navigate(['/app/setup/modifyIndustry', { id }]);
	}

	delete(objData, index) {
		var id = objData._id;
		this.value = { id };
		this.setupService.deleteUnits(this.value).subscribe(dataany => {
			this.industryArray.splice(index, 1);
		}, err => {
			this.errorMsg = "Some Error Occured";
			this.showError();
		})
	}

}
