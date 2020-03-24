

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CommonService } from './common.service';
@Injectable()


export class VasSelectionService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }

    addVasService(vasData){
        return super.postValue(vasData, 'vasService/addVasService');
    }

    getAllVas(){
        return super.getValue(`vasService/getAllVasService`);
    }
    getAllVasServices(){ //all service plans
        return super.getValue(`vasService/getAllVas`); 
    }
    getVasSubscribeService(){
        return super.getValue(`vasServiceSubscribe/getAllVasService`)
    }

    postVasSubscibeService(vasData){
        return super.postValue(vasData, 'vasServiceSubscribe/addVasServiceSubscribe');
    }

    postValueAddedServices(servicePlans){
        return super.postValue(servicePlans,'vasService/valueAddServices');   
    }

    deleteVasServices(item){ //delete a plan
        return super.postValue(item,'vasService/deleteServices');   
    }

    getoneVasService(itemId){
        return super.postValue(itemId,'vasService/getoneVas');   
    }
    updateVasServices(data){
        return super.postValue(data,'vasService/updateoneVas');  
    }
    planVasServiceByName(vasData){
        return super.postValue(vasData, 'vasService/planVasServiceByName');
    }
    
}
