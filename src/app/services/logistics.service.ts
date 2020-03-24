

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class LogisticsService extends CommonService {

    constructor(http: Http) {
        super(http);
    }

    postClearingManagement(ClearingManagementData) {
        return super.postValue(ClearingManagementData, `clearingManagement/addService`);
    }

    postInsuranceManagement(InsuranceManagementData) {
        return super.postValue(InsuranceManagementData, `insuranceManagement/addServices`);
    }

    postTransportManagement(TransportManagementData) {
        return super.postValue(TransportManagementData, `transportManagement/addService`);
    }

    postWarehouseManagement(WarehouseManagementData) {
        return super.postValue(WarehouseManagementData, `warehouse/save`);
    }

    postLogisticsSearch(LogisticsSearchData) {
        return super.postValue(LogisticsSearchData, `users/searchLogistic`);
    }

    postWarehouseService(WarehouseServiceData) {
        return super.postValue(WarehouseServiceData, `users/login`);
    }

    getLogisticsSearch() {
        return super.getValue(`users/login`);
    }

    getTransportManagement() {
        return super.getValue(`transportManagement/getAllTransportManagement`);
    }

    getWarehouseManagement() {
        return super.getValue(`warehouse/getAll`);
    }

    getClearingManagement() {
        return super.getValue(`clearingManagement/getAllClearingManagement`);
    }

    getInsuranceManagement() {
        return super.getValue(`insuranceManagement/getAllInsuranceManagement`);
    }

    modifyClearingManagement(ClearingManagementData) {
        return super.postValue(ClearingManagementData, 'clearingManagement/updateOne');
    }

    modifyInsuranceManagement(InsuranceManagementData) {
        return super.postValue(InsuranceManagementData, `insuranceManagement/updateOne`);
    }

    modifyTransportManagement(TransportManagementData) {
        return super.postValue(TransportManagementData, 'transportManagement/updateOne');
    }

    modifyWarehouseManagement(WarehouseManagementData) {
        return super.postValue(WarehouseManagementData, 'warehouse/update');
    }

    getOneWarehouseManagement(id) {
        return super.postValue(id, 'warehouse/getOne')
    }

    getWarehouseRequests() {
        return super.getValue('warehouse/getWarehouseRequest');
    }
    getTransportRequests() {
        return super.getValue('transportManagement/getTransportRequest');
    }
    getClearanceRequests() {
        return super.getValue('clearingManagement/getClearnceRequest');
    }
    getInsuranceRequests() {
        return super.getValue('insuranceManagement/getInsuranceRequest');
    }

    getOneTransportManagement(id) {
        return super.postValue(id, 'transportManagement/getOne')
    }

    getOneClearingManagement(id) {
        return super.postValue(id, 'clearingManagement/getOne')
    }

    getOneInsuranceManagement(id) {
        return super.postValue(id, 'insuranceManagement/getOneInsurance')
    }

    getTransportOption() {
        return super.getValue(`transportManagement/getAllTransportNames`);
    }
    getTransportCountry(id) {
        return super.postValue(id, 'transportManagement/getTransportCountry')
    }
    getClearingOption() {
        return super.getValue(`clearingManagement/getAllClearingNames`);
    }
    getClearingCountry(id) {
        return super.postValue(id, 'clearingManagement/getClearingCountry')
    }
    getInsuranceOption() {
        return super.getValue(`insuranceManagement/getAllInsuranceAgentsNames`);
    }
    getInsuranceCountry(id) {
        return super.postValue(id, 'insuranceManagement/getInsuranceCountry')
    }

    getWarehouseOption() {
        return super.getValue('warehouse/getAllWarehouse')

    }
    getWarehouseCountry(id) {
        return super.postValue(id, 'warehouse/getWarehouseCountry')
    }

    getWarehouseSupplier(id) {
        return super.postValue(id, 'warehouse/getLogicticsSupplier')
    }
    warehouseService(id) {
        return super.postValue(id, 'warehouse/warehouseService')
    }
    transportService(id) {
        return super.postValue(id, 'transportManagement/transportService')
    }
    clearingService(id) {
        return super.postValue(id, 'clearingManagement/clearingService')
    }
    insuranceService(id) {
        return super.postValue(id, 'insuranceManagement/insuranceService')
    }

    warehouseServiceName(id) {
        return super.postValue(id, 'warehouse/warehouseServiceName')
    }
    transportServiceName(id) {
        return super.postValue(id, 'transportManagement/transportServiceName')
    }
    clearingServiceName(id) {
        return super.postValue(id, 'clearingManagement/clearingServiceName')
    }
    insuranceServiceName(id) {
        return super.postValue(id, 'insuranceManagement/insuranceServiceName')
    }

    getTransportSupplier(id) {
        return super.postValue(id, 'transportManagement/getLogicticsSupplier')
    }


    getClearingSupplier(id) {
        return super.postValue(id, 'clearingManagement/getLogicticsSupplier')
    }
    ClearingService(id) {
        return super.postValue(id, 'clearingManagement/ClearingService')

    }

    getInsuranceSupplier(id) {
        return super.postValue(id, 'insuranceManagement/getLogicticsSupplier')
    }
    getPendingWarehousePo() {
        return super.getValue('warehousePo/getPendingWarehousePo')
    }
    getcompletedWarehousePo() {
        return super.getValue('warehousePo/getCompletedWarehousePo')
    }
    getPendingWarehouseProduct(id) {
        return super.postValue(id, 'warehousePo/getPendingWarehouseProduct')
    }

    getSingleWarehousePo(id) {
        return super.postValue(id, 'warehousePo/getSingleWarehousePo')
    }

    postWarehousePoStatus(data) {
        return super.postValue(data, 'warehousePo/postWarehousePoStatus')
    }

    getPendingTransportPo() {
        return super.getValue('transportPo/getPendingTransportPo')
    }
    getSingleTransportPo(id) {
        return super.postValue(id, 'transportPo/getSingleTransportPo')
    }
    getCompletedTransportPo() {
        return super.getValue('transportPo/getCompletedTransportPo')
    }
    getTransportProduct(id) {
        return super.postValue(id, 'transportPo/getTransportProduct')
    }
    postTransportPoStatus(data) {
        return super.postValue(data, 'transportPo/postTransportPoStatus')
    }

    getInsuranceProduct(id) {
        return super.postValue(id, 'insurancePo/getInsuranceProduct')
    }
    getSingleInsurancePo(id) {
        return super.postValue(id, 'insurancePo/getSingleInsurancePo')
    }
    postInsurancePoStatus(data) {
        return super.postValue(data, 'insurancePo/postInsurancePoStatus')
    }

    getLogisticsServices(id) {
        return super.postValue(id, 'warehousePo/getLogisticsServices')
    }
    getClearingProduct(id) {
        return super.postValue(id, 'clearingPo/getClearingProduct')
    }
    getSingleClearingPo(id) {
        return super.postValue(id, 'clearingPo/getSingleClearingPo')
    }
    postClearingPoStatus(id) {
        return super.postValue(id, 'clearingPo/postClearingPoStatus')
    }

    getMulitpleProduct(id) {
        return super.postValue(id, 'insurancePo/getMulitpleProduct')
    }
    getSingleMultiplePo(id) {
        return super.postValue(id, 'insurancePo/getSingleMultiplePo')
    }
    postMultiplePoStatus(data) {
        return super.postValue(data, 'insurancePo/postMultiplePoStatus')
    }

    setLogisticStatusWarehouse(data) {
        return super.postValue(data, 'warehouse/warhouseReqStatus')
    }

    setLogisticStatusTransport(data) {
        return super.postValue(data, 'transportManagement/transportReqStatus')
    }

    setLogisticStatusClearing(data) {
        return super.postValue(data, 'clearingManagement/clearingReqStatus')
    }

    setLogisticSInsurance(data) {
        return super.postValue(data, 'insuranceManagement/InsuranceReqStatus')
    }
}
