import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreTrails } from './explore-trails';

describe('ExploreTrails', () => {
  let component: ExploreTrails;
  let fixture: ComponentFixture<ExploreTrails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreTrails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreTrails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
