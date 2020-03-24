import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class ConfigurationService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }

    postGeneralSettings(generalData){
        return super.postValue(generalData, 'config/general');
    }

    getCurrency(){
        return super.getValue(`config/currency`);
    }

    addCurrency(currencyData){
        return super.postValue(currencyData, 'config/addCurrency');
    }

    addCurrencyInvite(currencyData){
        return super.postValue(currencyData, 'config/currencyInvite');
    }

    modifyCurrency(currencyData){
        return super.postValue(currencyData, 'config/updateCurrency');
    }

    getOneCurrency(currencyData){
        return super.postValue(currencyData,'config/getOneCurrency')
    }

    deleteCurrency(currencyData){
        return super.postValue(currencyData, 'currency-delete');
    }

    getTaxType(){
        return super.getValue(`tax-type`);
    }

    addTaxType(taxData){
        return super.postValue(taxData, 'tax-type');
    }

    modifyTaxType(taxData){
        return super.putValue(taxData, 'tax-type-update');
    }

    deleteTaxType(taxData){
        return super.postValue(taxData, 'tax-type-delete');
    }

    getPaymentTerms(){
        return super.getValue(`payment-term`);
    }

    addPaymentTerms(paymentTermsData){
        return super.postValue(paymentTermsData, 'payment-term');
    }

    modifyPaymentTerms(paymentTermsData){
        return super.putValue(paymentTermsData, 'payment-term-update');
    }

    deletePaymentTerms(paymentTermsData){
        return super.putValue(paymentTermsData, 'payment-term-delete');
    }

    getPaymentMethods(){
        return super.getValue(`payment-method`);
    }

    addPaymentMethods(paymentMethodData){
        return super.postValue(paymentMethodData, 'payment-method');
    }

    modifyPaymentMethods(paymentMethodData){
        return super.putValue(paymentMethodData, 'payment-method-update');
    }

    deletePaymentMethods(paymentMethodData){
        return super.putValue(paymentMethodData, 'payment-method-delete');
    }

    addDefaultSettings(defaultData){
        return super.postValue(defaultData, 'default-settings');
    }

    getDefaultSettings(){
        return super.getValue(`default-settings`);
    }
    

}
