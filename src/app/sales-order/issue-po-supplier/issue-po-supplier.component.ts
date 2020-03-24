import { SalesOrderService } from './../../services/sales-order.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LogisticsService } from '../../services/logistics.service';

@Component({
	selector: 'app-issue-po-supplier',
	templateUrl: './issue-po-supplier.component.html',
	styleUrls: ['./issue-po-supplier.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class IssuePoSupplierComponent implements OnInit {
	issuePoSupplierForm: FormGroup
	isShow: boolean
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

	constructor(private fb: FormBuilder, private salesOrderService: SalesOrderService, private route: Router,
		private router: ActivatedRoute, private LogisticsService: LogisticsService) { }

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
		this.value = { _id: this.router.snapshot.params['id'] }
		this.salesOrderService.getSupplierDetail(this.value).subscribe(res => {
			this.supplierValue = { supplierId: res[0].supplierId._id };
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
		})
	}
	submit(formValues) {
		formValues.requestQuotationSupplierId = this.value._id;
		this.salesOrderService.postIssuePoCrowd(formValues).subscribe(res => {
			this.successMsg = 'PO is issued.';
			this.showSuccess();

		}, (err) => {
			this.errorMsg = "Some Error Occured.";
			this.showError();
		})

	}
	
	getService(warehouse) {
		let data = { warehouseType: warehouse.value }
		this.LogisticsService.warehouseService(data).subscribe(response => {
			let dataArr = response.map(function (w) {
                return w['ServiceCategory'].toString();
			})
			var serviceType =  Array.from(new Set(dataArr ));
			this.warehouseType = serviceType;
		}); 
	}
	getServiceName(warehouse){
		let data = { warehouseName: warehouse.value }
		this.LogisticsService.warehouseServiceName(data).subscribe(res => {
			this.warehouseService = res;
		})
	}

	getServiceTransport(transport) {
		let data = { transportType: transport.value }
		this.LogisticsService.transportService(data).subscribe(response => {
			let dataArr = response.map(function (w) {
                return w['ServiceCategory'].toString();
			})
			var serviceType =  Array.from(new Set(dataArr ));
			this.transportType = serviceType;
		});
	}
	getTransportService(transport){
		let data = { transportService: transport.value }
		this.LogisticsService.transportServiceName(data).subscribe(res => {
			this.transportName = res;
		})
	}

	getClearing(ClearingService) {
		let data = { ClearingType: ClearingService.value }
		this.LogisticsService.ClearingService(data).subscribe(response => {
			let dataArr = response.map(function (w) {
                return w['ServiceCategory'].toString();
			})
			var serviceType =  Array.from(new Set(dataArr ));
			this.ClearingType = serviceType;
		});
	}
	getClearingService(ClearingService){
		let data = { ClearingService: ClearingService.value }
		this.LogisticsService.clearingServiceName(data).subscribe(res => {
			this.ClearingName = res;
		})
	}
	
	getInsurance(Insurance) {
		let data = { InsuranceType: Insurance.value }
		this.LogisticsService.insuranceService(data).subscribe(response => {
			let dataArr = response.map(function (w) {
                return w['ServiceCategory'].toString();
			})
			var serviceType =  Array.from(new Set(dataArr ));
			this.InsuranceType = serviceType;
		});
	}
	getInsuranceService(Insurance) {
		let data = { Insurance: Insurance.value }
		this.LogisticsService.insuranceServiceName(data).subscribe(res => {
			this.InsuranceName = res;
		})
	}

	showSuccess() {
		window.scrollTo(500, 0);
		this.isSuccess = false;
		setTimeout(() => {
			this.isSuccess = true;
			this.route.navigate(['/app/inventory/quotations/request-quotation-table']);
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
