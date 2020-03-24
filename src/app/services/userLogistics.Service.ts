

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class UserLogisticsService extends CommonService {

    constructor(http: Http) {
        super(http);
    }
    addWarehouseCatalogue(wareCatalogue){
        return super.postValue(wareCatalogue, 'logisticsCatalogue/addWarehouseCatalogue'); 
    }
    GetWarehouseCatalogue(){
        return super.getValue(`logisticsCatalogue/GetWarehouseCatalogue`);
    }
    UpdateWarehouseCatalogue(wareCatalogue){
        return super.postValue(wareCatalogue, 'logisticsCatalogue/UpdateWarehouseCatalogue');
    }
    GetOneWarehouseCatalogue(wareCatalogue){
        return super.postValue(wareCatalogue, 'logisticsCatalogue/GetOneWarehouseCatalogue');
    }
    getServicesCategories(){
        return super.getValue('logisticsCatalogue/getServicesCategories'); 
    }
    getServicesCategoryByType(value){
        return super.postValue(value,'logisticsCatalogue/getServicesCategoryByType'); 
    }
    getServicesTypes(id){
        return super.postValue(id,'logisticsCatalogue/getServicesTypes'); 
    }
    getServicesTypesForLogi(id){
        return super.postValue(id,'logisticsCatalogue/getServicesTypesForLogi'); 
    }
    getUnits(){
        return super.getValue('logisticsCatalogue/getUnits');
    }

    getapprovedInsurancePo() {
        return super.getValue('insurancePo/getCompletedInsurancePo')
    }

    getapprovedMultiplePo() {
        return super.getValue('insurancePo/getapprovedMultiplePo')
    }

    getpendingInsurancePo() {
        return super.getValue('insurancePo/getPendingInsurancePo')
    }
    getpendingMultiplePo(){
        return super.getValue('insurancePo/getpendingMultiplePo')
    }

    getapprovedClearingPo() {
        return super.getValue('clearingPo/getCompletedClearingPo')
    }

    getpendingClearingPo() {
        return super.getValue('clearingPo/getPendingClearingPo')
    }

    register(registerData) {
        return super.postValue(registerData, 'logistics/logistics-registration');
    }

}
