import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class CompanyDetailService extends CommonService {

    constructor(http: Http) {
        super(http);
    }

    getLocation() {
        return super.getValue(`locationManagement/getAllLocation`);
    }
    addLocation(locationData) {
        return super.postValue(locationData, 'locationManagement/addLocation');
    }
    addLocationInvite(locationData) {
        return super.postValue(locationData, 'locationManagement/addLocationInvite');
    }
    modifyLocation(locationData) {
        return super.postValue(locationData, 'locationManagement/updateOne');
    }
    getOneLocation(locationData) {
        return super.postValue(locationData, 'locationManagement/getOne');
    }

    getCompanyDetails() {
        return super.getValue(`config/getCompanyDetails`);
    }
    getCompanyDetailsLogistics() {
        return super.getValue(`config/getCompanyDetailsLogistics`);
    }
    saveCompanyDetails(formValues) {
        return super.postValue(formValues, 'config/saveCompanyDetails')
    }
    saveCompanyDetailsLogistics(formValues) {
        return super.postValue(formValues, 'config/saveCompanyDetailsLogistics')
    }

}