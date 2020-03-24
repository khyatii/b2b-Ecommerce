import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { IS_STEPPER } from '../../store/action';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';



@Component({
  selector: 'app-customer-and-supplier',
  templateUrl: './customer-and-supplier.component.html',
  styleUrls: ['./customer-and-supplier.component.scss']
})
export class CustomerAndSupplierComponent implements OnInit, OnDestroy {
  @ViewChild('customerAndSupplierstepper') stpper:MatStepper
  @select() isStepper:Observable<boolean>;
  back:boolean = false;


  constructor( private ngRedux: NgRedux<IAppState>, private router: ActivatedRoute,
    private route: Router) { }

  ngOnInit() {
    this.ngRedux.dispatch({ type:IS_STEPPER, item:true})
  }
  addedCustomers(){
    this.stpper.next();
    if(this.stpper.selectedIndex) this.back = true;

  }

  skipStep(step){
    if (step.selectedIndex >= 1) {
      this.route.navigate(['/app/seller-layout']);
    } else {
      step.next();
    }
  }

  gback(step){
    step.previous();
  }


  ngOnDestroy(){
    this.ngRedux.dispatch({ type:IS_STEPPER, item:false})
  }
}
