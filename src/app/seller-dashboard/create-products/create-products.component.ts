import { Component, OnInit, ViewChild, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AddLocationComponent } from '../../inventory/inventory-location/add-location/add-location.component'
import { AddProductComponent } from '../../inventory/product/add-product/add-product.component';
import { MatStepper } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { IS_STEPPER } from '../../store/action';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss']
})
export class CreateProductsComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('AddLocationComponent') AddLocationComponent: AddLocationComponent;
  @ViewChild('AddProductComponent') AddProductComponent: AddProductComponent;
  @ViewChild('myStepper') myStepper: MatStepper;
  @select() isStepper: Observable<boolean>;

  back:boolean = false;
  isLinear: true;
  locationForm: FormGroup;
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private ngRedux: NgRedux<IAppState>,
    private router: ActivatedRoute, private route: Router) {

  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: IS_STEPPER, item: true })
  }

  get fromLocation() {
    return this.AddLocationComponent ? this.AddLocationComponent.locationForm : null;
  }

  get fromProduct() {
    return this.AddProductComponent ? this.AddProductComponent.addProductData : null;
  }

  getLocationForm(formGroup: FormGroup): void {debugger;
    this.locationForm = formGroup;
    if (this.locationForm.status == "VALID") {
      // this.myStepper['_selectedIndex'] += 1;
      this.myStepper.next();
      console.log('stepper is', this.myStepper);


    }
  }
  getProductForm(formGroup: FormGroup): void {debugger;
    debugger;
    console.log('emitted form product data is', formGroup.status);
    console.log('stepper is', this.myStepper);
    this.productForm = formGroup;
    // this.myStepper['_selectedIndex'] += 1;
    this.myStepper.next();
    if(this.myStepper.selectedIndex) this.back = true;
  }
  skipStep(step) {debugger;
    console.log('step is', step.selectedIndex);
    if (step.selectedIndex >= 1) {
      this.route.navigate(['/app/seller-layout']);
    } else {
      step.next();
    }
    if(step.selectedIndex) this.back = true;
  }

  gback(step){
    step.previous();
  }


  ngOnDestroy() {
    this.ngRedux.dispatch({ type: IS_STEPPER, item: false })
  }

  ngOnChanges() {
    console.log('changes inside create product', this.isStepper);
  }
}
