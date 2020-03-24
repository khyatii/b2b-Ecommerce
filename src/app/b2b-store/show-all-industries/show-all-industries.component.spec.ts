import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllIndustriesComponent } from './show-all-industries.component';

describe('ShowAllIndustriesComponent', () => {
  let component: ShowAllIndustriesComponent;
  let fixture: ComponentFixture<ShowAllIndustriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAllIndustriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllIndustriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
