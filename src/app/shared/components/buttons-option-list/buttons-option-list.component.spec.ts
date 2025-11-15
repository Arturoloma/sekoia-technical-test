import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsOptionListComponent } from './buttons-option-list.component';

describe('ButtonsOptionListComponent', () => {
  let component: ButtonsOptionListComponent;
  let fixture: ComponentFixture<ButtonsOptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonsOptionListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsOptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
