import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloggedcontainerComponent } from './unloggedcontainer.component';

describe('UnloggedcontainerComponent', () => {
  let component: UnloggedcontainerComponent;
  let fixture: ComponentFixture<UnloggedcontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnloggedcontainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloggedcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
