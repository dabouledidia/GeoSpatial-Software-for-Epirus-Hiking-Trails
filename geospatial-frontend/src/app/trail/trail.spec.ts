import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trail } from './trail';

describe('Trail', () => {
  let component: Trail;
  let fixture: ComponentFixture<Trail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
