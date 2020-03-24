import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-footer',
  templateUrl: './store-footer.component.html',
  styleUrls: ['./store-footer.component.scss']
})
export class StoreFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
 top(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
