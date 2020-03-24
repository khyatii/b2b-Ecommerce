import { Injectable } from '@angular/core';
import { Http,Headers, RequestOptions } from "@angular/http";
import { CommonService } from './common.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {NotFoundError} from '../apperrors/notfound'
import {DuplicateError} from '../apperrors/duplicateError'
import {AppError} from '../apperrors/apperror'
import { Observable } from "rxjs/Observable";
import { Url } from '../common/serverurl.class';
@Injectable()


export class InventoryService extends CommonService {

	constructor(http:Http) {
		super(http);
	}
	postImage(value,defaultName,image){
		let headers = new Headers();
		headers.append("Access-Control-Allow-Origin", '*');
		headers.append('Authorization','Token '+localStorage.getItem('token'));
		headers.append('X-CSRFToken','bYe1DbntAm5CLtQ8WE5x0vQNuEqPSG9cpUU8mZXnSz2kcRt5wshVBJFicU1jHbNw');
		headers.append('email',localStorage.getItem('email'));

		let options = new RequestOptions({ headers: headers, params: {id:value,default:defaultName}});
		return this.http.post(`${Url.url}/product/uploadImage`,image,options)
		.map(res => res.json())
		.catch((err)=>{
			if(err.status == 404)
			return  Observable.throw(new NotFoundError())

			else
			return Observable.throw(new AppError(err))
		})
	}
	///productViaDocument to upload product via document
	postDocs(value,image){
		let headers = new Headers();
		headers.append("Access-Control-Allow-Origin", '*');
		headers.append('Authorization','Token '+localStorage.getItem('token'));
		headers.append('X-CSRFToken','bYe1DbntAm5CLtQ8WE5x0vQNuEqPSG9cpUU8mZXnSz2kcRt5wshVBJFicU1jHbNw');
		headers.append('email',localStorage.getItem('email'));

		let options = new RequestOptions({ headers: headers, params: {id:value}});
		return this.http.post(`${Url.url}/product/uploadDocument`,image,options)
		.map(res => res.json())
		.catch((err)=>{
			if(err.status == 404)
			return  Observable.throw(new NotFoundError())

			else
			return Observable.throw(new AppError(err))
		})
	}
	addProduct(productData){
		return super.postValue(productData,'product/add');
	}
	defaultImage(imageData){
		return super.postValue(imageData,'product/setDefaultImage');
	}

	modifyProduct(productData){
		return super.postValue(productData,'product/updateOne');
	}

	addLocation(formData){
		return super.postValue(formData, 'inventoryLocation/add');
	}

	addWarehouseLocation(formData){
		return super.postValue(formData, 'logisticLocations/addWarehouseLocation');
	}

	getLogisticsLocation(){
		return super.getValue( 'logisticLocations/getLogisticsLocation');
	}

	getPrefferedSupplier() {
		return super.getValue( 'product/getPrefferedSupplier');
	}

	getLocation(){
		return super.getValue( 'inventoryLocation/getAllInventoryLocation');
	}

	modifyLocation(formData){
		return super.postValue(formData, 'inventoryLocation/updateOne');
	}
	modifyLogiticLocation(formData){
		return super.postValue(formData, 'logisticLocations/updateOne');
	}
	getOneInventory(formData){
		return super.postValue(formData, 'inventoryLocation/getOne');
	}
	getLogisticsInventory(formData){
		return super.postValue(formData, 'logisticLocations/getOne');
	}
	getProduct(){
		return super.getValue('product/getAll');
	}
	getUserLocation(){
		return super.getValue('product/userLocation');
	}

	getProductList(data){
		return super.postValue(data,'product/getAllProduct');
	}
	getBranchList(data){
		return super.postValue(data,'product/getBranch');
	}
	getProductOne(data){
		return super.postValue(data,'product/getOneProduct');
	}


	getProductSubCategory(categoryId){
		return super.postValue(categoryId, 'product/getSubCategory');
	}

	getCategoryProductDetail(categoryId){
		return super.postValue(categoryId, 'product/getCategoryProductDetail');
	}

	getSubCategoryDetails(subcatId){
		return super.postValue(subcatId,'product/getSubCategoryProductDetail');
	}

	getSearchResults(searchTerm){
		return super.postValue(searchTerm,'product/search');
	}
	categorySearch(productId){
		return super.postValue(productId,'product/categorySearch')
	}

	getProductCategories(categoryId){
		return super.postValue(categoryId, 'product/getCategories');
	}

	getSeachProducts(searchString){
		return super.postValue(searchString,'product/searchString');
	}

	// getProductSubCategories(industryId){
	// 	return super.postValue(industryId, 'product/getProductSubCategories');
	// }

	getProductCategory(){
		return super.getValue('product/getCategory');
	}

	getRequstQuotations(){
		return super.getValue( 'requestQuotation/getAllQuotationRequests');
    }

    getViewRequstQuotations(id){
		return super.postValue( id,'requestQuotation/viewQuotationProductDetails');
	}
	viewResponseQuotationProducts(id){
		return super.postValue( id,'requestQuotation/viewResponseQuotationProducts');
	}

	getResponseQuotations(){
		return super.getValue( 'requestQuotation/getAllQuotationResponse');
    }

    getSingleResponseData(id) {
		return super.postValue( id,'requestQuotation/getSingleResponseData');

    }

	postQuotations(productData){
		return super.postValue(productData, 'crowdSourcing/submitOrderRequest');
	}

	postSupplierQuotations(productData){
		return super.postValue(productData, 'requestQuotation/postSupplierQuotations');
	}
	postSearchSupplierQuotations(data){
		return super.postValue(data, 'requestQuotation/postSearchSupplierQuotations');
	}

	searchProduct(productData){
		return super.postValue(productData, 'product/searchProduct');
	}

	priceRange(){
		return super.getValue( 'product/priceRange');
	}
	stockInLocation(productData){
		return super.postValue(productData, 'product/productListLocation');
	}

	updateQuantity(productData){
		return super.postValue(productData, 'product/updateQuantity');
	}

	updateStock(productData){
		return super.putValue(productData,'users/login')
	}

	modifyStock(formData){
		return super.putValue(formData, 'users/login');
	}

	deleteModifiedImage(data){
		return super.postValue(data, 'product/deleteImage');
	}

	getOne(formData){
		return super.postValue(formData, 'product/getOne');
	}

	deleteDoc(data){
		return super.postValue(data, 'product/deleteDocuments');
	}
	changeApprovalStatus(data){
		return super.postValue(data, 'product/changeApprovalStatus');
	}

	updateProductStock(data){
		return super.postValue(data, 'product/updateStock');
	}

	postImportDoc(value,data){
		let headers = new Headers();
		headers.append("Access-Control-Allow-Origin", '*');
		headers.append('Authorization','Token '+localStorage.getItem('token'));
		headers.append('email',localStorage.getItem('email'));
		let options = new RequestOptions({ headers: headers, params: value});
		return this.http.post(`${Url.url}/product/importProductViaDocument`,data,options)
		.map(res => res.json())
		.catch((err)=>{
			if(err.status == 404)
			return  Observable.throw(new NotFoundError())

			else
			return Observable.throw(new AppError(err))
		})
	}

}
