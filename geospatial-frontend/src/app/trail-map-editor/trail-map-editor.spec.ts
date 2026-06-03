import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailMapEditor } from './trail-map-editor';

describe('TrailMapEditor', () => {
  let component: TrailMapEditor;
  let fixture: ComponentFixture<TrailMapEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailMapEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailMapEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
