import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailList } from './trail-list';

describe('TrailList', () => {
  let component: TrailList;
  let fixture: ComponentFixture<TrailList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
