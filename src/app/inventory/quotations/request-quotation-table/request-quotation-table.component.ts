
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-request-quotation-table',
	templateUrl: './request-quotation-table.component.html',
	styleUrls: ['./request-quotation-table.component.css']
})
export class RequestQuotationTableComponent implements OnInit {
	requestQuotationArray: Array<object>;
	responseQuotationArray: Array<object>;
	tempreqarr = [];
	tempresarr = [];
	selectedTab = 0;

	constructor(private spinnerService: Ng4LoadingSpinnerService, private inventoryService: InventoryService, private route: Router, public dialog: MatDialog) { }

	ngOnInit() {
		this.spinnerService.show()
		this.inventoryService.getRequstQuotations().subscribe(res => {
			this.requestQuotationArray = res;
			this.tempreqarr = res;
			this.spinnerService.hide();

		})
		this.inventoryService.getResponseQuotations().subscribe(res => {
			this.responseQuotationArray = res;
			this.tempresarr = res;
			this.spinnerService.hide();

		})
	}

	//View Request Quotation Product Details
	viewDetail(objData) {
		let id = objData._id;
		this.route.navigate(['/app/inventory/quotations/view-request', { id }]);
	}

	//View Response Quotation Product Details ans IssuePO
	viewDetailResponse(objData) {
		let id = objData._id;
		this.route.navigate(['/app/inventory/quotations/view-response', { id }]);
	}
	searchQuotations(event) {
		this.requestQuotationArray = []
		if (this.selectedTab === 0) {
			let searchFor = event.target.value.toLowerCase();
			this.tempreqarr.forEach(resp => {
				let str = resp["supplierId"]["company_name"].toLowerCase();
				let foundindex = str.indexOf(searchFor)
				if (foundindex >= 0) {
					this.requestQuotationArray.push(resp);
				}
			})
		} else {
			this.responseQuotationArray = [];
			let searchFor = event.target.value.toLowerCase();
			this.tempresarr.forEach(resp => {
				let str = resp["supplierId"]["company_name"].toLowerCase();
				let foundindex = str.indexOf(searchFor)
				if (foundindex >= 0) {
					this.responseQuotationArray.push(resp);
				}
			})
		}
	}

	onLinkClick(event: MatTabChangeEvent) {

		var tabindex = event.index;
		if (tabindex == 1) {
			this.selectedTab = 1;
		} else if (tabindex == 0) {
			this.selectedTab = 0;
		}
	}

}
