import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrail } from './create-trail';

describe('CreateTrail', () => {
  let component: CreateTrail;
  let fixture: ComponentFixture<CreateTrail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
