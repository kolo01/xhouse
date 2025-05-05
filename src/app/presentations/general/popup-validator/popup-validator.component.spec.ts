import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupValidatorComponent } from './popup-validator.component';

describe('PopupValidatorComponent', () => {
  let component: PopupValidatorComponent;
  let fixture: ComponentFixture<PopupValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
