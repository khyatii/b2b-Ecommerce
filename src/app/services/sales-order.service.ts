import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class SalesOrderService extends CommonService {

    constructor(http: Http) {
        super(http);
    }

    postWarehousePo(id) {
        return super.postValue(id, `warehousePo/postWarehousePo`);
    }

    getSupplierDetail(id) {
        return super.postValue(id, `issuePO/getSupplierDetail`);
    }

    postIssuePo(formValue) {
        return super.postValue(formValue, `issuePO/saveIssuePO`);
    }
    postIssuePoCrowd(formValue) {
        return super.postValue(formValue, `issuePO/saveIssuePoCrowdSourcing`);
    }

    postRejectPurchaseOrder(data) {
        return super.postValue(data, `issuePO/rejectPO`);
    }

    getOrder(formData) {
        return super.postValue(formData, 'requestQuotation/getOneQuotation');
    }

    getPendingPo() {
        return super.getValue(`issuePO/getAllPo`);
    }

    getPendingPOdetails(id) {
        return super.postValue(id, 'issuePO/getAllPoProduct');
    }

    getLogisticsDetails(id) {
        return super.postValue(id, 'issuePO/getLogisticsDetails');
    }

    getAcceptedPo() {
        return super.getValue(`orders/getAllAcceptPo`);
    }

    getOrderTrackingStatus() {
        return super.getValue(`orders/getOrderTrackingStatus`);
    }

    getPoTrackingStatus(id) {
        return super.postValue(id, `orders/getPoTrackingStatus`);
    }

    completedPoArray() {
        return super.getValue(`orders/getAllCompletedGoods`);
    }

    getAllPoProduct(id) {
        return super.postValue(id, `orders/getAllPoProduct`);
    }
    getInvoicePage(id) {
        return super.postValue(id, `orders/getInvoicePage`);
    }
    getAllRecievingGoods() {
        return super.getValue(`orders/getAllRecievingGoods`);
    }

    postSupplierPoStatus(id) {
        return super.postValue(id, 'issuePO/postSupplierPoStatus');
    }

    postBuyerPoStatus(id) {
        return super.postValue(id, 'orders/postBuyerPoStatus');
    }

    getCompletedPo() {
        return super.getValue(`orders/getAllCompletedPo`);
    }

    getCompletedPOdetails(id) {
        return super.postValue(id, `orders/getAllCompletedPoProduct`);
    }

    getQuotation() {
        return super.getValue('requestQuotation/viewQuotationRequests');
    }

    getRqstQuotation(rqstId) {
        return super.postValue(rqstId, 'requestQuotation/getRqstQuotation');
    }

    postRecievingGoodsData(formValues) {
        return super.postValue(formValues, 'orders/receivingOfGoods');
    }

    postReturnOrder(returnOrderData) {
        return super.postValue(returnOrderData, `returns/saveReturnData`);
    }

    postSupplierReturnStatus(id) {
        return super.postValue(id, `returns/postSupplierReturnStatus`)
    }

    getReturnOrderTrackingStatus(id) {
        return super.postValue(id, `returns/getReturnOrderTrackingStatus`);
    }

    getReturnsPending() {
        return super.getValue(`returns/getReturnsPending`);
    }

    getAllReturnsProduct(id) {
        return super.postValue(id, `returns/getReturnsProducts`);
    }
    getReturnsCompleted() {
        return super.getValue(`returns/getReturnsCompleted`);
    }
    getAllCompletedReturnsProduct(id) {
        return super.postValue(id, `returns/getReturnsCompletedProducts`);
    }
    postQuotationData(formValue) {

        return super.postValue(formValue, `requestQuotation/supplierQuotationResponse`);
    }
    supplierQuotationCancel(formValue) {
        return super.postValue(formValue, `requestQuotation/supplierQuotationCancelPerItem`);
    }
    getAllProductList() {
        return super.getValue(`product/getAllProductList`);
    }

    getAllInvoice() {
        return super.getValue(`invoice/getAllInvoices`);
    }

    getAllInvoiceProduct(id) {
        return super.postValue(id, `invoice/getAllInvoiceProduct`);
    }

    postPartialPayment(data) {
        return super.postValue(data, 'invoice/makePayment');
    }

    getPartialPaymentDetails(id) {
        return super.postValue(id, 'invoice/getPartialPayment');
    }

    getPartialPaymentSupplier(id) {
        return super.postValue(id, 'invoice/getPartialPaymentSupplier');
    }

    postPartialPaymentSupplier(data) {
        return super.postValue(data, 'invoice/makePaymentSupplier');
    }

    postPaymentStatusSupplier(id) {
        return super.postValue(id, 'invoice/postPaymentStatusSupplier');
    }

}
