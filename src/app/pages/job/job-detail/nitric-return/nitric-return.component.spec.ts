import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NitricReturnComponent } from './nitric-return.component';

describe('NitricReturnComponent', () => {
  let component: NitricReturnComponent;
  let fixture: ComponentFixture<NitricReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NitricReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NitricReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
