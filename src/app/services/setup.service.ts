
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class SetupService extends CommonService {

    constructor(http: Http) {
        super(http);
    }

    getPriceList() {
        return super.getValue(`config/getAllPriceList`);
    }
    addNewPriceList(priceListData) {
        return super.postValue(priceListData, 'config/addPriceList');
    }
    modifyPriceList(priceListData) {
        return super.postValue(priceListData, 'config/modyifyPriceList');
    }
    getOnePriceList(priceListData) {
        return super.postValue(priceListData, 'config/getOnePriceList')
    }
    deletePriceList(priceListdata) {
        return super.postValue(priceListdata, `price-list-delete`);
    }

    getDiscount() {
        return super.getValue(`productDiscount/getAllProductDiscount`);
    }
    getOneProductDiscount(disountData) {
        return super.postValue(disountData, `productDiscount/getOneProductDiscount`)
    }
    addNewDiscount(discountData) {
        return super.postValue(discountData, 'productDiscount/addProductDiscount');
    }
    getLogisticsUnit(type) {
        return super.postValue(type, `logistics/getLogisticsUnit`);
    }
    modifyDiscount(discountData) {
        return super.postValue(discountData, 'productDiscount/updateProductDiscount');
    }
    deleteDiscount(discountData) {
        return super.postValue(discountData, `productDiscount/deleteDiscount`);
    }

    addCompanyOverview(companyData) {
        return super.postValue(companyData, 'users/login');
    }

    getLocation() {
        return super.getValue(`users/getAllRoles`);
    }
    addLocation(location) {
        return super.postValue(location, 'users/login');
    }
    modifyLocation(location) {
        return super.putValue(location, 'users/login');
    }

    getTemplate() {
        return super.getValue(`template/getAll`)
    }
    getOneTemplate(template) {
        return super.postValue(template, `template/getOne`)
    }
    getDefaultTemplate(template) {
        return super.postValue(template, `template/getDefaultTemplate`)
    }
    addTemplate(template) {
        return super.postValue(template, 'template/save')
    }
    modifyTemplate(template) {
        return super.postValue(template, 'template/update')
    }

    addNewCategoryList(discountData) {
        return super.postValue(discountData, 'category/addCategoryList');
    }
    addNewIndustry(data) {
        return super.postValue(data, 'category/addindustry');
    }
    getIndustry() {
        return super.getValue(`category/getindustry`);
    }
    deleteIndustry(id) {
        return super.postValue(id, 'category/deleteindustry');
    }
    deleteCategory(id) {
        return super.postValue(id, 'category/deleteCategory');
    }
    deleteSubCategory(id) {
        return super.postValue(id, 'category/deleteSubCategory');
    }
    getOneIndustry(data) {
        return super.postValue(data, 'category/getOneIndustry')
    }
    updateIndustry(inputData) {
        return super.postValue(inputData, `category/updateindustry`);
    }
    getCategoryList() {
        return super.getValue(`category/getAllCategory`);
    }
    getOneCategoryList(priceListData) {
        return super.postValue(priceListData, 'category/getOneCategoryList')
    }
    updateCategory(inputData) {
        return super.postValue(inputData, `category/updateCategory`);
    }
    getSubCategoryList() {
        return super.getValue(`category/getAllSubCategory`);
    }
    getCategories(id) {
        return super.postValue(id, 'category/getCategories');
    }
    getSubCategories(id) {
        return super.postValue(id, 'category/getSubCategories');
    }
    addNewSubCategoryList(discountData) {
        return super.postValue(discountData, 'category/addSubCategoryList');
    }
    getOneSubCategoryList(priceListData) {
        return super.postValue(priceListData, 'category/getOneSubCategoryList')
    }
    updateSubCategory(inputData) {
        return super.postValue(inputData, `category/updateSubCategory`);
    }

    addApproval(inputData) {
        return super.postValue(inputData, `approvalProcess/add`);
    }
    getApproval() {
        return super.getValue(`approvalProcess/get`);
    }
    getProductApproval() {
        return super.getValue(`approvalProcess/getProductApproval`);
    }

    addLogisticsUnits(formValues) {
        return super.postValue(formValues, `logistics/addLogisticsUnits`);
    }
    deleteUnits(id) {
        return super.postValue(id, 'logistics/deleteUnits');
    }

    addServiceType(formValues) {
        return super.postValue(formValues, `logistics/addServiceType`);
    }
    getService() {
        return super.getValue(`logistics/getService`);
    }
    getServiceType(type) {
        return super.postValue(type, `logistics/getServiceType`);
    }
    getOneServiceType(id) {
        return super.postValue(id, `logistics/getOneServiceType`);
    }
    modifyServiceType(formValues) {
        return super.postValue(formValues, `logistics/logisticTypeUpdate`);
    }
    deleteServiceType(id) {
        return super.postValue(id, `logistics/deleteServiceType`);
    }
    getMultipleType(id) {
        return super.postValue(id, `logistics/getMultipleType`);
    }
    getName(id) {
        return super.postValue(id, `logistics/getName`);
    }
    getTypes() {
        return super.getValue(`logistics/getTypes`);
    }
    getLogisticTypes() {
        return super.getValue(`logistics/getLogisticTypes`);
    }

    addLogisticsType(formValues) {
        return super.postValue(formValues, `logistics/addLogisticType`);
    }
    getLogisticsTypes() {
        return super.getValue(`logistics/getLogisticsTypes`);
    }
    deleteLogisticsType(id) {
        return super.postValue(id, `logistics/deleteLogisticsType`);
    }
    getOneLogisticsType(id) {
        return super.postValue(id, `logistics/getOneLogisticsType`);
    }
    modifyLogisticsType(formValues) {
        return super.postValue(formValues, `logistics/modifyLogisticsType`);
    }
    getMultipleServices(logisticTypes) {
        return super.postValue(logisticTypes, `logistics/getMultipleServices`);
    }
    postLogisticsSearch(formValues) {
        return super.postValue(formValues, `logistics/searchLogistic`);
    }
}
