import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @select() userType: Observable<any>;
  user:any
  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
    this.userType.subscribe(item => {
      this.user = item.trader_type;
    })
  }

}
