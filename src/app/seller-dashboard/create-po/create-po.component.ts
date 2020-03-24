import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { IS_STEPPER } from '../../store/action';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-create-po',
  templateUrl: './create-po.component.html',
  styleUrls: ['./create-po.component.scss']
})
export class CreatePoComponent implements OnInit, OnDestroy {
  @ViewChild('purchaseOrderStepper') poStepper: MatStepper;
  back:boolean = false;

  constructor(private ngRedux: NgRedux<IAppState>, private router: ActivatedRoute,
  private route: Router) { }

  ngOnInit() {
    this.ngRedux.dispatch({ type:IS_STEPPER, item:true})
  }
  createPoStep(){
    this.poStepper.next();
    if(this.poStepper.selectedIndex) this.back = true;

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
