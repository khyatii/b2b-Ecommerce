import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppError } from './../../../apperrors/apperror';
import { LogisticsService } from '../../../services/logistics.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
	selector: 'app-pop-up',
	templateUrl: './pop-up.component.html',
	styleUrls: ['./pop-up.component.css'],
	encapsulation: ViewEncapsulation.None,
})

export class PopUpComponent implements OnInit {
	warehouse: any[] = [];
	tranport: any[] = [];
	clearance: any[] = [];
	insurance: any[] = [];
	warehouseService: any[] = [];
	warehouseType: any[] = [];
	transportType: any[] = [];
	transportName: any[] = [];
	ClearingType: any[] = [];
	ClearingName: any[] = [];
	InsuranceType: any[] = [];
	InsuranceName: any[] = [];
	warehouseCountryName;
	warehousetxtTown;
	txtTown;
	txtCountryName;
	cltxtTown;
	cltxtCountryName;
	intxtTown;
	intxtCountryName;
	supplierValue;
	isSuccess: boolean = true;
	errorMsg: string;
	successMsg: string;
	isError: boolean = true;
	isShow: boolean = true;
	showSuccessMessage: boolean;
	issuePoSupplierForm: FormGroup;

	constructor(private LogisticsService: LogisticsService, private route: Router,
		private NotificationService: NotificationService, private fb: FormBuilder,
		private salesOrderService: SalesOrderService,
		public dialogRef: MatDialogRef<PopUpComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.issuePoSupplierForm = this.fb.group({
			"txtWarehouse": [''],
			"txtTransportation": [''],
			"txtFrightRate": [''],
			"txtClearing": [''],
			"txtInsurance": [''],
			"txtWarehouseType": [''],
			"txtWarehouseService": [''],
			"TransportType": [''],
			"TransportName": [''],
			"txtClearingType": [''],
			"txtClearingName": [''],
			"txtInsuranceType": [''],
			"txtInsuranceName": [''],
		})
		this.supplierValue = { supplierId: this.data.responseQuotationArray[0].supplierId._id };

		this.LogisticsService.getWarehouseOption().subscribe(response => {
			this.warehouse = response;
		});
		this.LogisticsService.getTransportOption().subscribe(res => {
			this.tranport = res;
		});
		this.LogisticsService.getClearingOption().subscribe(res => {
			this.clearance = res;
		});
		this.LogisticsService.getInsuranceOption().subscribe(res => {
			this.insurance = res;
		});
	}

	submit(formValues) {
		let notification = {};
		notification['recieverId'] = this.data.responseQuotationArray[0].supplierId.email;
		notification['notificationMessage'] = 'buyer have issued purchase order for your products';
		notification['pageLink'] = 'app/salesorders/purchaseorder';
		formValues.data = this.data.responseQuotationArray;
		this.isShow = true;
		this.salesOrderService.postIssuePo(formValues).subscribe(res => {
			this.NotificationService.sendUserNotification(notification);
			this.successMsg = 'Issue Po sent sucessfully.';
			this.showSuccess();
			setTimeout(function () {
				this.dialogRef.close();
				this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
			}.bind(this), 2000);
		}, (err) => {
			if (err instanceof AppError) {
				this.errorMsg = "Some error occured"
				this.showError();
			}
		})
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	getService(warehouse) {
		let data = { warehouseType: warehouse.value }
		this.LogisticsService.warehouseService(data).subscribe(response => {
			this.warehouseType = response;
		});
	}
	getServiceName(warehouse) {
		let data = { warehouseName: warehouse.ServiceCategory, logisticsId: warehouse.logisticsId }
		this.LogisticsService.warehouseServiceName(data).subscribe(res => {
			this.warehouseService = res;
		})
	}

	getServiceTransport(transport) {
		let data = { transportType: transport.value }
		this.LogisticsService.transportService(data).subscribe(response => {
			this.transportType = response;
		});
	}
	getTransportService(transport) {
		let data = { transportService: transport.ServiceCategory, logisticsId: transport.logisticsId }
		this.LogisticsService.transportServiceName(data).subscribe(res => {
			this.transportName = res;
		})
	}

	getClearing(ClearingService) {
		let data = { ClearingType: ClearingService.value }
		this.LogisticsService.ClearingService(data).subscribe(response => {
			this.ClearingType = response;
		});
	}
	getClearingService(ClearingService) {
		let data = { ClearingService: ClearingService.ServiceCategory, logisticsId: ClearingService.logisticsId }
		this.LogisticsService.clearingServiceName(data).subscribe(res => {
			this.ClearingName = res;
		})
	}

	getInsurance(Insurance) {
		let data = { InsuranceType: Insurance.value }
		this.LogisticsService.insuranceService(data).subscribe(response => {
			this.InsuranceType = response;
		});
	}
	getInsuranceService(Insurance) {
		let data = { Insurance: Insurance.ServiceCategory, logisticsId: Insurance.logisticsId }
		this.LogisticsService.insuranceServiceName(data).subscribe(res => {
			this.InsuranceName = res;
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
