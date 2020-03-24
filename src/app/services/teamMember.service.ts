import { AppError } from './../apperrors/apperror';
import { NotFoundError } from './../apperrors/notfound';
import { Observable } from 'rxjs/Observable';


import { Injectable } from '@angular/core';
import { Http,Headers, RequestOptions } from "@angular/http";
import { CommonService } from './common.service';
import { Url } from "../common/serverurl.class";
@Injectable()


export class TeamMemberService extends CommonService {
    
    constructor(http:Http) {
      super(http);
    }
    
    addMember(values){
        return super.postValue(values,`teamMember/add`);
    }

    getAllMembers(){
        return super.getValue('teamMember/getTeamMember')
    }

    getOne(id){
        return super.postValue(id,'teamMember/getOne')
    }

    updateOne(data){
        return super.postValue(data,'teamMember/updateOne')
    }

    // updatePhoto(data){
    //     return super.postValue(data,'teamMember/updatePhoto')
    // }

    updatePhoto(value,image){
      let headers = new Headers();
      headers.append("Access-Control-Allow-Origin", '*');
      headers.append('Authorization','Token '+localStorage.getItem('token')); 
      headers.append('email',localStorage.getItem('email')); 
      headers.append('X-CSRFToken','bYe1DbntAm5CLtQ8WE5x0vQNuEqPSG9cpUU8mZXnSz2kcRt5wshVBJFicU1jHbNw'); 
      headers.append('id',value); 
      
      let options = new RequestOptions({ headers: headers, params: {id:value}});
      return this.http.post(`${Url.url}/teamMember/updatePhoto`,image,options)
      .map(res => res.json())
      .catch((err)=>{
          if(err.status == 404)
           return  Observable.throw(new NotFoundError()) 
         
          else 
            return Observable.throw(new AppError(err))
      })
    }


    
}
