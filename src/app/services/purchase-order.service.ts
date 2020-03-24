import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class PurchaseOrderService extends CommonService {

    constructor(http: Http) {
        super(http);
    }

    getSelectedSuppliers(formValue) {
        return super.postValue(formValue, `crowdSourcing/getSelectedSuppliers`);
    }
    getDiscountSuppliers(formValue) {
        return super.postValue(formValue, `crowdSourcing/getDiscountSuppliers`);
    }
    getProductDiscountGroup(formValue) {
        return super.postValue(formValue, `crowdSourcing/getProductDiscountGroup`);
    }
    getRequestedProduct(id) {
        return super.postValue(id, `crowdSourcing/getRequestedProduct`);
    }
    requestCrowdSourcing(formValue) {
        return super.postValue(formValue, `crowdSourcing/requestCrowdSourcing`);
    }

}
