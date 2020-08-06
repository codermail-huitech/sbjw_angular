import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DalSubmitComponent } from './dal-submit.component';

describe('DalSubmitComponent', () => {
  let component: DalSubmitComponent;
  let fixture: ComponentFixture<DalSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DalSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DalSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
