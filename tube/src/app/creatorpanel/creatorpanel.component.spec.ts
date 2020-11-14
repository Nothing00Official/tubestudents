import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorpanelComponent } from './creatorpanel.component';

describe('CreatorpanelComponent', () => {
  let component: CreatorpanelComponent;
  let fixture: ComponentFixture<CreatorpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
