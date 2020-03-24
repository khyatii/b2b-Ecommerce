import { FormControl } from '@angular/forms';

export class AlphaNumericValidator {
    static invalidAlphaNumeric(control: FormControl): { [key: string]: boolean } {
        if (control.value.length && !control.value.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/)) {

            return { invalidAlphaNumeric: true };
        }
        return null;
 
}
}