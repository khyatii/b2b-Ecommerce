import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InputOutputService } from '../../services/inputOutput.service';
import { SetupService } from '../../services/setup.service';

@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
	array: Array<number> = [];
	results: Array<any> = [];
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	value;

	priceListArray: Array<object>
	constructor(private fb: FormBuilder, private route: Router, private zone: NgZone, private inputOutputService: InputOutputService,
		private setupService: SetupService) { }

	ngOnInit() {
		this.setupService.getCategoryList().subscribe(
			res => {
				let unsortedCat = res.sort(
					function (a, b) {
						var nameA = a.industryId.name.toLowerCase().trim(), nameB = b.industryId.name.toLowerCase().trim();
						if (nameA < nameB) //sort string ascending
							return -1
						if (nameA > nameB)
							return 1
						return 0 //default return value (no sorting)
					}
				);
				this.array = unsortedCat;
				this.results = res;
			},
			err => {
				this.errorMsg = "Some Error Occured";
				this.showError();
			})
	}

	addProduct() {
		this.route.navigate(['/app/setup/addCategory'])

	}


	searchCategory(eve) {
		this.array = [];
		var string;
		var trimmedString;
		var searchedKeyword = eve.target.value;
		var searchLen = searchedKeyword.length;
		this.results.forEach((resp) => {
			string = resp['name'].toLowerCase();
			let isCheck = string.indexOf(searchedKeyword.toLowerCase())
			if (isCheck >= 0) {
				this.array.push(resp);
			}
			//  trimmedString = string.substring(0,searchLen);
			//  if(trimmedString.toLowerCase() == searchedKeyword.toLowerCase()){
			// 	 this.array.push(resp);
			//  }
		})
	}

	fileChoose(file) {
		file.click();
	}

	delete(objData, index) {
		var id = objData._id;
		this.value = { id };
		if (confirm(`All SubCategories linked with Category will be deleted.
					Are you sure to delete ` + objData.name + ` ?`)) {
			this.setupService.deleteCategory(this.value).subscribe(dataany => {
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
		this.route.navigate(['/app/setup/modifyCategory', { id }]);

	}

}
