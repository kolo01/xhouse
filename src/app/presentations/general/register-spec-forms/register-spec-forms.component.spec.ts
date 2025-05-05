import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSpecFormsComponent } from './register-spec-forms.component';

describe('RegisterSpecFormsComponent', () => {
  let component: RegisterSpecFormsComponent;
  let fixture: ComponentFixture<RegisterSpecFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSpecFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSpecFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
