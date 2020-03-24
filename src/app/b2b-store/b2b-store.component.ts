import { Component, OnInit } from '@angular/core';
import { Event } from './classes/event';
import { CommonService } from './commonService/common.service';

@Component({
  selector: 'app-b2b-store',
  templateUrl: './b2b-store.component.html',
  styleUrls: ['./b2b-store.component.css'],
  providers:[CommonService],
})


export class B2bStoreComponent implements OnInit {


  constructor() { }
  public clickedEvent: Event;
  ngOnInit() {

  }

  childEventClicked(event: Event) {
    this.clickedEvent = event;
  }
  

}
