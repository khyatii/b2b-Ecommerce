import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'extra-invoice',
  template: './invoice.template.html',
  styles: ['./invoice.style.scss']
})
export class Invoice {
  print(): void {
    window.print();
  };
}
