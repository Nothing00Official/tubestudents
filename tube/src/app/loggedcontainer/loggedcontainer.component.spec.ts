import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedcontainerComponent } from './loggedcontainer.component';

describe('LoggedcontainerComponent', () => {
  let component: LoggedcontainerComponent;
  let fixture: ComponentFixture<LoggedcontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedcontainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
