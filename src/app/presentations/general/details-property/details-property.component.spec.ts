import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPropertyComponent } from './details-property.component';

describe('DetailsPropertyComponent', () => {
  let component: DetailsPropertyComponent;
  let fixture: ComponentFixture<DetailsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
