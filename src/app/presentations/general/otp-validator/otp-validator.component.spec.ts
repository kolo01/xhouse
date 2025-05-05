import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpValidatorComponent } from './otp-validator.component';

describe('OtpValidatorComponent', () => {
  let component: OtpValidatorComponent;
  let fixture: ComponentFixture<OtpValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
