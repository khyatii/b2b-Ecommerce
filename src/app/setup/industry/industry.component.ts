import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../services/setup.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-industry',
	templateUrl: './industry.component.html',
	styleUrls: ['./industry.component.css']
})

export class IndustryComponent implements OnInit {
	industryArray: Array<object>;
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	searchArray: Array<any> = [];
	value;

	constructor(private route: Router, private setupService: SetupService) { }

	ngOnInit() {
		this.setupService.getIndustry().subscribe(res => {
			let unsortedInd = res.sort(
				function(a, b){
					var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
					if (nameA < nameB) //sort string ascending
						return -1 
					if (nameA > nameB)
						return 1
					return 0 //default return value (no sorting)
				}
			);
			this.industryArray=unsortedInd;
			this.searchArray = res;
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

	formatDate(temp) {
		let Fulldate = new Date(temp);
		let month = Fulldate.getMonth() + 1;
		let date = Fulldate.getDate();
		let year = Fulldate.getFullYear();
		return month + "/" + date + "/" + year;
	}

	modify(objData) {
		let id = objData._id;
		this.route.navigate(['/app/setup/modifyIndustry', { id }]);
	}

	delete(objData, index) {
		var id = objData._id;
		this.value = { id };
		if (confirm(`All Categories and SubCategories linked with Industry will be deleted.
					Are you sure to delete ` + objData.name + ` ?`)) {
			this.setupService.deleteIndustry(this.value).subscribe(dataany => {
				this.industryArray.splice(index, 1);
			}, err => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})
		}
	}

	searchIndustry(eve){
		this.industryArray=[];
		var searchFor= eve.target.value;
		this.searchArray.forEach(resp=>{
			let string=resp['name'].toLowerCase();
			var validCheck=string.indexOf(searchFor.toLowerCase())
			if(validCheck >= 0){
				this.industryArray.push(resp);
			}
		})
	}
}
