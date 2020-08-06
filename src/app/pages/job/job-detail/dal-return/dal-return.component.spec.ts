import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DalReturnComponent } from './dal-return.component';

describe('DalReturnComponent', () => {
  let component: DalReturnComponent;
  let fixture: ComponentFixture<DalReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DalReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DalReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
