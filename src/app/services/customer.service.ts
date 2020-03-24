

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class CustomerService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }

    postCustomerProfile(customerData){
        return super.postValue(customerData, 'users/login');
    }

    getCustomerGroups(){
        return super.getValue(`productDiscount/getCustomerGroup`);
    }

    getCustomerGroupsActive(){
        return super.getValue(`customerGroup/getAllActive`);
    }
    

    addCustomerGroups(customerGroupData){
        return super.postValue(customerGroupData, 'customerGroup/addCustomerGroup');
    }

    getOneCustomerGroups(customerGroupData){
        return super.postValue(customerGroupData, 'customerGroup/getOne');
    }

    modifyCustomerGroups(customerGroupData){
        return super.postValue(customerGroupData, 'customerGroup/modify');
    }

    postInvitation(invitationData){
        return super.postValue(invitationData,'customerProfile/save');
    }

    postInvitationExisting(invitationData){
        return super.postValue(invitationData,'customerProfile/saveExisting');
    }

    getAllCustomer(){
        return super.getValue(`customerProfile/getAll`);
    }
    getActiveCustomer(){
        return super.getValue(`customerProfile/getActiveCustomer`);
    }

    getAllBuyer() {
        return super.getValue(`getAllBuyer`);
    }

    getAllCustomers() {
        return super.getValue(`customerProfile/getAll`);
    }

    getCustomerDetails(data) {
        return super.postValue(data, 'customerProfile/getCustomerDetails')
    }

    saveInviteCustomer(data){
        return super.postValue(data, 'saveInviteCustomer')
    }

    getBuyerDetails(data) {
        return super.postValue(data, 'getBuyerDetails')
    }
    

    getOneCustomer(customerData){
        return super.postValue(customerData,'customerProfile/getOne')
    }

    modifyCustomer(customerData){
        return super.postValue(customerData,'customerProfile/modify')
    }

    searchSupplier(supplierData){
        return super.postValue(supplierData, 'customerProfile/searchSupplier')
    }

    viewMember(groupID){
        return super.postValue(groupID,'customerProfile/getAllFromGroup')
    }

    getSupplierList(){
        return super.getValue('supplier/getAll')
    }

    addSupplier(supplierData){
        return super.postValue(supplierData,'supplier/add')
    }

    getAllSupplier(){
        return super.getValue('supplier/getAllSupplier')
    }
    getSupplierDetail(id){
        return super.postValue(id,'supplier/getSupplierDetail')
    }

    getOneSupplier(id){
        return super.postValue(id,'supplier/getOne')
    }

    updateSupplier(supplierData){
        return super.postValue(supplierData,'supplier/updateOne')
    }
    

}
