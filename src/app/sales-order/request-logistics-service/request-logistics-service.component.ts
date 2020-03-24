import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../services/sales-order.service';
import { LogisticsService } from '../../services/logistics.service';
import { NotificationService } from '../../services/notification.service';


@Component({
	selector: 'app-request-logistics-service',
	templateUrl: './request-logistics-service.component.html',
	styleUrls: ['./request-logistics-service.component.css']
})
export class RequestLogisticsServiceComponent implements OnInit {

	issuePoSupplierForm: FormGroup
	isShow: boolean;
	logisticsId: any;
	value: { _id: any; };
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
	successMsg: string;
	isSuccess: boolean = true;
	errorMsg: string;
	isError: boolean = true;
	poProductArray = [];
	BuyerEmail;

	constructor(private fb: FormBuilder, private salesOrderService: SalesOrderService, private route: Router,
		private router: ActivatedRoute, private LogisticsService: LogisticsService, private NotificationService: NotificationService) { }

	ngOnInit() {
		this.issuePoSupplierForm = this.fb.group({
			"txtWarehouse": [null],
			"txtTransportation": [null],
			"txtFrightRate": [null],
			"txtClearing": [null],
			"txtInsurance": [null],
			"txtWarehouseType": [null],
			"txtWarehouseService": [null],
			"TransportType": [null],
			"TransportName": [null],
			"txtClearingType": [null],
			"txtClearingName": [null],
			"txtInsuranceType": [null],
			"txtInsuranceName": [null],
		})
		this.value = { _id: this.router.snapshot.params['id'] }
		// this.salesOrderService.getSupplierDetail(this.value).subscribe(res => {
		// this.supplierValue = { supplierId: res[0].supplierId._id };
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
		// })
		const localThis = this;
		this.salesOrderService.getPendingPOdetails(this.value).subscribe(res => {
			this.poProductArray = res;
			localThis.BuyerEmail = res[0]['buyerId'].email;
		});
	}
	submit(formValues) {
		formValues._id = this.value._id;
		let notification = {};
		notification['recieverId'] = this.BuyerEmail;
		notification['notificationMessage'] = 'your product is processed';
		notification['pageLink'] = 'app/salesorders/orders/view';
		this.salesOrderService.postWarehousePo(formValues).subscribe(res => {
			this.successMsg = 'PO Accepted.';
			this.showSuccess();
			this.NotificationService.sendUserNotification(notification);
			this.sendNotificationLogistic(formValues);
		}, (err) => {
			this.errorMsg = "Some Error Occured.";
			this.showError();
		});
	}

	public sendNotificationLogistic(formValues) {
		if (formValues.txtWarehouse !== "") { //if warehouse selected with other
			let notification = {};
			notification['notificationMessage'] = 'a seller have requested for your warehouse';
			notification['pageLink'] = 'logistic/logisticsUser/Warehouse';
			let selectedWarehouse = this.warehouse.filter(obj => {
				if (obj._id == formValues.txtWarehouse) return obj.email;
			})
			notification['recieverId'] = selectedWarehouse[0].email;
			this.NotificationService.sendUserNotification(notification);
		}

		// if warehouse null and transport selected
		if (formValues.txtTransportation !== "" && formValues.txtWarehouse == "") {
			let notification = {};
			notification['notificationMessage'] = '';
			notification['pageLink'] = 'logistic/logisticsUser/transport-po';
			let selectedTransport = this.tranport.filter(obj => {
				if (obj._id == formValues.txtTransportation) return obj.email;
			})
			notification['recieverId'] = selectedTransport[0].email;
			this.NotificationService.sendUserNotification(notification);
		}
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
			this.route.navigate(['/app/salesorders/purchaseorder']);
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
