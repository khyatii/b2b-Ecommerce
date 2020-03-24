import { Directive, ElementRef, Input, OnInit, Renderer, HostListener, Output ,EventEmitter} from '@angular/core';
@Directive({
    selector: '[input-Select]'
})

export class selectDirective implements OnInit {
  

    constructor(public el: ElementRef, public renderer: Renderer) {
    }

    ngOnInit() {
    }

    @HostListener('change') change() {
    }
}