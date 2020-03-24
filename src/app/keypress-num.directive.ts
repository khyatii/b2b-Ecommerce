import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appKeypressNum]'
})
export class KeypressNumDirective {

  constructor() { }

  @Input() appKeypressNum: boolean;

  ngOnInit() {
    // Use renderer to render the emelemt with styles
    if (this.appKeypressNum) {
    }
  }

}
