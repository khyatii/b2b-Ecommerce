
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'app-view-request',
    templateUrl: './view-request.component.html',
    styleUrls: []
})
export class ViewRequestComponent implements OnInit {

    productArray: Array<object>;
    responseQuotationArray: Array<object>;
    value: { _id: any; };
    _id: any;
    BuyerName;
    BuyerEmail;
    BuyerContact;
    SupplierName;
    SupplierEmail;
    SupplierConatct;
    createdAt;
    total;
    tax;

    constructor(private spinnerService: Ng4LoadingSpinnerService,private inventoryService: InventoryService, private route: Router, private router: ActivatedRoute) { }

    ngOnInit() {
        this.spinnerService.show()
        this.value = { _id: this.router.snapshot.params['id'] }
        const localThis = this;
        this.inventoryService.getViewRequstQuotations(this.value).subscribe(res => {
            this.spinnerService.hide()
            this.productArray = res;
            if (res[0] != undefined) {
                localThis.BuyerName = res[0]['buyerId'].company_name;
                localThis.BuyerEmail = res[0]['buyerId'].email;
                localThis.BuyerContact = res[0]['buyerId'].phone_number;
                localThis.SupplierName = res[0]['supplierId'].company_name;
                localThis.SupplierEmail = res[0]['supplierId'].email;
                localThis.SupplierConatct = res[0]['supplierId'].phone_number;
                localThis.createdAt = res[0].createdAt;
            }
        })
    }
}
