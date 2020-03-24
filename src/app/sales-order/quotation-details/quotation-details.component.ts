import { SalesOrderService } from './../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from '../../apperrors/apperror';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PopupCancelQuotationComponent } from '../popup-cancel-quotation/popup-cancel-quotation.component';

@Component({
	selector: 'app-quotation-details',
	templateUrl: './quotation-details.component.html',
	styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit {

	quotationDetailArray: Array<object>

	constructor(private salesOrderService: SalesOrderService, private route: Router,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.salesOrderService.getQuotation().subscribe(res => {
			this.quotationDetailArray = res;
		})
	}

	getQuotation(objData) {
		let id = objData._id;
		this.route.navigate(['/app/salesorders/viewQuotationDetails', { id }]);
	}

	//pop-up for Reject Quotation
	openDialog(objData): void {
		let dialogRef = this.dialog.open(PopupCancelQuotationComponent, {
			width: '700px',
			data: { id: objData._id }
		});
		dialogRef.afterClosed().subscribe(result => {
		});
	}

}
