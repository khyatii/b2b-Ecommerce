import { Directive, ElementRef, Input, OnInit, Renderer, HostListener, Output ,EventEmitter} from '@angular/core';
@Directive({
    selector: '[input-box]'
})

export class TestDirectives implements OnInit {
    Options:any
    @Input() name= [];
    @Input() value: any;
    @Input() options: any;
    @Input() form: any;
    @Output() valueChange = new EventEmitter()

    constructor(public el: ElementRef, public renderer: Renderer) {
    }

    ngOnInit() { 
        console.log("input-box keys  : ", this.name, this.value);
    }

    @HostListener('change') change() {
        var optionArray =  this.name.filter(option=>option.toLowerCase().indexOf(this.value.value.toLowerCase())==0)
        if(optionArray.length==0||optionArray.length>1){
            this.el.nativeElement.value="";
            this.value._value='';
            this.value._status="INVALID"
        }

        else if(optionArray.length==1){
            this.el.nativeElement.value=optionArray[0];
            this.value._value=optionArray[0];
        }
        // if( (this.name.filter(option =>
        //     option.toLowerCase().indexOf(this.value.value.toLowerCase()) ==-1)) )
        //    {
        //         this.el.nativeElement.value="";
        //         this.value._value='';
        //         this.value._status="INVALID"
        //         this.value.markAsPristine();
        //         this.valueChange.emit(null)
        // }
    }
}