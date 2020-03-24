import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SalesOrderService } from './../../../services/sales-order.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from '../../../apperrors/apperror';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-pending-po',
    templateUrl: './pending-po.component.html',
    styleUrls: ['./pending-po.component.css']
})
export class PendingPoComponent implements OnInit {

    value: { _id: any; };
    statusPo: { _id: any; status: any, email: any, warehouseEmail: any, logisticsId: any };
    pendingPoProductArray: Array<object>;
    logisticArray: Array<object>;
    BuyerName;
    BuyerEmail;
    BuyerContact;
    SupplierName;
    SupplierEmail;
    SupplierConatct;
    createdAt;
    total;
    tax;
    orderNumber;
    isSuccess: boolean = true;
    errorMsg: string;
    successMsg: string;
    isError: boolean = true;
    isShow: boolean = true;
    warehouseEmail;
    logisticsId;
    shipping;
    Warehouse
    CountryName
    Town
    Priority
    charges
    TransporterName
    TransporterCountry
    TransporterTown
    TransporterPriority
    ClearingName
    ClearingCountry
    ClearingTown
    ClearingPriority
    InsuranceAgentName
    InsuranceCountry
    InsuranceTown
    InsurancePriority

    constructor(private salesOrderService: SalesOrderService, private router: ActivatedRoute,
     private route: Router,private NotificationService: NotificationService) { }

    ngOnInit() {
        this.value = { _id: this.router.snapshot.params['id'] }
        const localThis = this;
        //get PendingPO details
        this.salesOrderService.getPendingPOdetails(this.value).subscribe(res => {
            this.pendingPoProductArray = res;
            localThis.BuyerName = res[0]['buyerId'].company_name;
            localThis.BuyerEmail = res[0]['buyerId'].email;
            localThis.BuyerContact = res[0]['buyerId'].phone_number;
            localThis.SupplierName = res[0]['supplierId'].company_name;
            localThis.SupplierEmail = res[0]['supplierId'].email;
            localThis.SupplierConatct = res[0]['supplierId'].phone_number;
            localThis.shipping = res[0]['requestQuotationId'].shipping;
            localThis.createdAt = res[0].createdAt;
            localThis.orderNumber = res[0].orderNumber;

            let sum = 0;
            for (let i = 0; i < localThis.pendingPoProductArray.length; i++) {
                let subTotal = localThis.pendingPoProductArray[i]['txtTotalPrice'];
                sum += subTotal;
            }
            this.total = sum;

            this.tax = this.total * 10 / 100
        })

        this.salesOrderService.getLogisticsDetails(this.value).subscribe(res => {
            this.logisticArray = res;
            if (res[0]['txtWarehouse'] != undefined) {
                localThis.warehouseEmail = res[0]['txtWarehouse'].email;
                localThis.logisticsId = res[0]['txtWarehouse']._id;
            }
            if (res[0]['txtTransportation'] != undefined) {
                localThis.TransporterName = res[0]['txtTransportation'].txtTransporterName;
                localThis.TransporterCountry = res[0]['txtTransportation'].txtCountryName;
                localThis.TransporterTown = res[0]['txtTransportation'].txtTown;
                localThis.TransporterPriority = res[0]['txtTransportation'].txtPriority;
            }
            if (res[0]['txtClearing'] != undefined) {
                localThis.ClearingName = res[0]['txtClearing'].txtClearingName;
                localThis.ClearingCountry = res[0]['txtClearing'].txtCountryName;
                localThis.ClearingTown = res[0]['txtClearing'].txtTown;
                localThis.ClearingPriority = res[0]['txtClearing'].txtPriority;
            }
            if (res[0]['txtInsurance'] != undefined) {
                localThis.InsuranceAgentName = res[0]['txtInsurance'].txtInsuranceAgentName;
                localThis.InsuranceCountry = res[0]['txtInsurance'].txtCountryName;
                localThis.InsuranceTown = res[0]['txtInsurance'].txtTown;
                localThis.InsurancePriority = res[0]['txtInsurance'].txtPriority;
            }
        })
    }

    acceptOrder() {
        let notification ={};
        notification['recieverId'] = this.pendingPoProductArray[0]['buyerId'].email;
        notification['notificationMessage'] = 'Your Order is Processed by Seller';
        notification['pageLink'] = 'app/salesorders/orders/view';
        this.statusPo = { _id: this.router.snapshot.params['id'], status: "accept", email: this.BuyerEmail, warehouseEmail: this.warehouseEmail, logisticsId: this.logisticsId }
        if (this.shipping == "FOB") {
            this.salesOrderService.postSupplierPoStatus(this.statusPo).subscribe(res => {
                this.successMsg = 'PO Accepted.';
                this.showSuccess();
                setTimeout(() => {
                    this.NotificationService.sendUserNotification(notification);
                    this.route.navigate(['/app/salesorders/purchaseorder']);
                }, 2000);
            }, (err) => {
                if (err instanceof AppError) {
                    this.errorMsg = "Some error occured"
                    this.showError();
                }
            })
        } else {
            let id = this.value._id;
            this.route.navigate(['/app/salesorders/requestlogistics', { id }]);
        }
    }

    rejectOrder() {
        let notification ={};
        notification['recieverId'] = this.pendingPoProductArray[0]['buyerId'].email;
        notification['notificationMessage'] = 'Your Order is Rejected by Seller.';
        notification['pageLink'] = 'app/inventory/quotations/request-quotation-table';
        this.statusPo = { _id: this.router.snapshot.params['id'], status: "reject", email: this.BuyerEmail, warehouseEmail: this.warehouseEmail, logisticsId: this.logisticsId }
        this.salesOrderService.postSupplierPoStatus(this.statusPo).subscribe(res => {
            this.successMsg = 'PO Rejected.';
            this.showSuccess();
            this.NotificationService.sendUserNotification(notification);
            setTimeout(() => {
                this.route.navigate(['/app/salesorders/purchaseorder']);
            }, 2000);
        }, (err) => {
            if (err instanceof AppError) {
                this.errorMsg = "Some error occured"
                this.showError();
            }
        })
    }

    print(): void {
        window.print();
    };

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
