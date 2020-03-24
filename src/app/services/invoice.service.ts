

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class InvoiceService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }
    pendingValueAdded(){
        return super.getValue(`invoice/getAllRoles`);
    }    
    completedValueAdded(){
        return super.getValue(`invoice/getAllRoles`);
    } 
    pendingFromSeller(){
        return super.getValue(`invoice/getAllRoles`);
    }  
    completedFromSeller(){
        return super.getValue(`invoice/getAllRoles`);
    }     
    pendingFromLogistics(){
        return super.getValue(`invoiceLogistics/getAllLogisticsInvoices`);
    }
    getLogisticsInvoicesDetails(id){
        return super.postValue(id,`invoiceLogistics/getLogisticsInvoicesDetails`);
    } 
    completedFromLogistics(){
        return super.getValue(`invoiceLogistics/getSettlementsInvoice`);
    }
    postPartialPayment(data){
        return super.postValue(data,`invoiceLogistics/makePayment`);
    }
    getPartialPaymentDetails(id){
        return super.postValue(id,`invoiceLogistics/getPartialPayment`);
    }
    postPaymentStatusBuyer(id){
        return super.postValue(id, 'invoiceLogistics/postPaymentStatusBuyer');
    }
}
