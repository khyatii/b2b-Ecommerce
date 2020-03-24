import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('txtPassword').value; // to get value in input tag
       let confirmPassword = AC.get('txtRePassword').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('txtRePassword').setErrors( {MatchPassword: true} )
        } else {
            AC.get('txtRePassword').setErrors( null )
        }
    }

    // static MatchDea(AC: AbstractControl) {
    //     let password = AC.get('deaNumber').value; // to get value in input tag
    //     let confirmPassword = AC.get('verifyDea').value; // to get value in input tag
    //      if(password != confirmPassword) {
    //          AC.get('verifyDea').setErrors( {MatchDea: true} )
    //      } else {
    //          return null
    //      }
    //  }
}