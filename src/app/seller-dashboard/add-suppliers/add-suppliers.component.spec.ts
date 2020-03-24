import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuppliersComponent } from './add-suppliers.component';

describe('AddSuppliersComponent', () => {
  let component: AddSuppliersComponent;
  let fixture: ComponentFixture<AddSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
