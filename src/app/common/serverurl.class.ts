
import { environment } from '../../environments/environment';

export class Url {
    static get url() {
        if (environment.production) {
             return "http://13.127.188.236:8000"
        }
        else {
              return "http://localhost:8000"
        }
    }
    static get urlclient() {
       if (environment.production) {
           return "http://ec2-13-127-188-236.ap-south-1.compute.amazonaws.com"
       }
       else {
           return "http://localhost:7000"
       }
   }
}
