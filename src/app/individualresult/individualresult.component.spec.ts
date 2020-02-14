import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualresultComponent } from './individualresult.component';

describe('IndividualresultComponent', () => {
  let component: IndividualresultComponent;
  let fixture: ComponentFixture<IndividualresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
