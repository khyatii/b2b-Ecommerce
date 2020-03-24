import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStockMovementsComponent } from './manage-stock-movements.component';

describe('ManageStockMovementsComponent', () => {
  let component: ManageStockMovementsComponent;
  let fixture: ComponentFixture<ManageStockMovementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStockMovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStockMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
