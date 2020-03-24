import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SetupService } from '../../services/setup.service';

@Component({
	selector: 'app-sub-category',
	templateUrl: './sub-category.component.html',
	styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

	array: Array<number> = [];
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	searchArray: Array<any> = [];
	value;
	priceListArray: Array<object>;

	constructor(private route: Router, private setupService: SetupService) { }

	ngOnInit() {
		this.setupService.getSubCategoryList().subscribe(
			res => {
				this.array = res;
				this.searchArray = res;
			}, err => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})
	}

	fileChoose(file) {
		file.click();
	}

	delete(objData, index) {
		var id = objData._id;
		this.value = { id };
		if (confirm(`Are you sure to delete ` + objData.name + ` ?`)) {
			this.setupService.deleteSubCategory(this.value).subscribe(dataany => {
				this.array.splice(index, 1);
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

	formatDate(temp) {
		let Fulldate = new Date(temp);
		let month = Fulldate.getMonth() + 1;
		let date = Fulldate.getDate();
		let year = Fulldate.getFullYear();
		return month + "/" + date + "/" + year;
	}

	modify(objData) {
		let id = objData._id;
		this.route.navigate(['/app/setup/modifySubCategory', { id }]);

	}

	searchsubCat(eve){
		this.array=[];
		var searchfor=eve.target.value;
		this.searchArray.forEach(resp=>{
			let string=resp['name'].toLowerCase();
			let check=string.indexOf(searchfor.toLowerCase());
			if(check >= 0){
				this.array.push(resp);
			}
		})

	}
}