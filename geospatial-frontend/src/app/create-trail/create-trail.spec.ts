import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateTrail } from './create-trail';
import { TrailService } from '../services/trail.service';
import { provideHttpClient } from '@angular/common/http';


describe('CreateTrail', () => {
  let component: CreateTrail;
  let fixture: ComponentFixture<CreateTrail>;
  let trailServiceMock: jest.Mocked<TrailService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    trailServiceMock = {
      createTrail: jest.fn()
    } as unknown as jest.Mocked<TrailService>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CreateTrail, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        FormBuilder,
        provideHttpClient(),
        { provide: TrailService, useValue: trailServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTrail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  const fillValidForm = (component: CreateTrail) => {
    const mockFile = new File([''], 'trail.jpg', { type: 'image/jpeg' });
    component.trailForm.setValue({
      name: 'Mountain Trail',
      location: 'Alps',
      lengthKm: '12.5',
      duration: '3.0',
      difficulty: 'HARD',
      description: 'A scenic trail',
      image: mockFile
    });
  };

  // ─────────────────────────────────────────────
  // Initialisation
  // ─────────────────────────────────────────────

  describe('initialisation', () => {

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialise trailForm', () => {
      expect(component.trailForm).toBeDefined();
    });

    it('should initialise form with empty/null fields', () => {
      expect(component.trailForm.value).toEqual({
        name: '',
        location: '',
        lengthKm: null,
        duration: null,
        difficulty: '',
        description: '',
        image: null
      });
    });

    it('should have all required form controls', () => {
      ['name', 'location', 'lengthKm', 'duration', 'difficulty', 'description', 'image']
        .forEach(control => {
          expect(component.trailForm.contains(control)).toBe(true);
        });
    });

    it('should be invalid when form is empty', () => {
      expect(component.trailForm.invalid).toBe(true);
    });
  });

  // ─────────────────────────────────────────────
  // Form validation
  // ─────────────────────────────────────────────

  describe('form validation', () => {

    it('should be valid when all fields are filled correctly', () => {
      fillValidForm(component);

      expect(component.trailForm.valid).toBe(true);
    });

    it('should be invalid when name is empty', () => {
      fillValidForm(component);
      component.trailForm.get('name')?.setValue('');

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when location is empty', () => {
      fillValidForm(component);
      component.trailForm.get('location')?.setValue('');

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when lengthKm is null', () => {
      fillValidForm(component);
      component.trailForm.get('lengthKm')?.setValue(null);

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when lengthKm is not a number', () => {
      fillValidForm(component);
      component.trailForm.get('lengthKm')?.setValue('abc');

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be valid when lengthKm is a decimal number', () => {
      fillValidForm(component);
      component.trailForm.get('lengthKm')?.setValue('12.5');

      expect(component.trailForm.valid).toBe(true);
    });

    it('should be invalid when duration is null', () => {
      fillValidForm(component);
      component.trailForm.get('duration')?.setValue(null);

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when duration is not a number', () => {
      fillValidForm(component);
      component.trailForm.get('duration')?.setValue('abc');

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when difficulty is empty', () => {
      fillValidForm(component);
      component.trailForm.get('difficulty')?.setValue('');

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when description is empty', () => {
      fillValidForm(component);
      component.trailForm.get('description')?.setValue('');

      expect(component.trailForm.invalid).toBe(true);
    });

    it('should be invalid when image is null', () => {
      fillValidForm(component);
      component.trailForm.get('image')?.setValue(null);

      expect(component.trailForm.invalid).toBe(true);
    });
  });

  // ─────────────────────────────────────────────
  // onFileSelect
  // ─────────────────────────────────────────────

  describe('onFileSelect', () => {

    it('should patch image value when file is selected', () => {
      const mockFile = new File([''], 'trail.jpg', { type: 'image/jpeg' });
      const event = { files: [mockFile] };

      component.onFileSelect(event);

      expect(component.trailForm.get('image')?.value).toBe(mockFile);
    });

    it('should not patch image when no file is provided', () => {
      const event = { files: [] };

      component.onFileSelect(event);

      expect(component.trailForm.get('image')?.value).toBeNull();
    });

    it('should replace existing image with new file', () => {
      const firstFile = new File([''], 'first.jpg', { type: 'image/jpeg' });
      const secondFile = new File([''], 'second.jpg', { type: 'image/jpeg' });

      component.onFileSelect({ files: [firstFile] });
      component.onFileSelect({ files: [secondFile] });

      expect(component.trailForm.get('image')?.value).toBe(secondFile);
    });
  });

  // ─────────────────────────────────────────────
  // createTrail
  // ─────────────────────────────────────────────

  describe('createTrail', () => {

    it('should not call service when form is invalid', () => {
      component.createTrail();

      expect(trailServiceMock.createTrail).not.toHaveBeenCalled();
    });

    it('should not navigate when form is invalid', () => {
      component.createTrail();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should call trailService.createTrail with FormData when form is valid', () => {
      fillValidForm(component);
      trailServiceMock.createTrail.mockReturnValue(of({}));

      component.createTrail();

      expect(trailServiceMock.createTrail).toHaveBeenCalledWith(
        expect.any(FormData)
      );
    });

    it('should call createTrail exactly once', () => {
      fillValidForm(component);
      trailServiceMock.createTrail.mockReturnValue(of({}));

      component.createTrail();

      expect(trailServiceMock.createTrail).toHaveBeenCalledTimes(1);
    });

    it('should navigate to root on success', () => {
      fillValidForm(component);
      trailServiceMock.createTrail.mockReturnValue(of({}));

      component.createTrail();

      expect(routerMock.navigate).toHaveBeenCalledWith(['']);
    });

    it('should not navigate on error', () => {
      fillValidForm(component);
      trailServiceMock.createTrail.mockReturnValue(
        throwError(() => new Error('Server error'))
      );

      component.createTrail();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should append all fields to FormData', () => {
      fillValidForm(component);
      trailServiceMock.createTrail.mockReturnValue(of({}));

      const appendSpy = jest.spyOn(FormData.prototype, 'append');

      component.createTrail();

      expect(appendSpy).toHaveBeenCalledWith('name', 'Mountain Trail');
      expect(appendSpy).toHaveBeenCalledWith('location', 'Alps');
      expect(appendSpy).toHaveBeenCalledWith('lengthKm', '12.5');
      expect(appendSpy).toHaveBeenCalledWith('duration', '3.0');
      expect(appendSpy).toHaveBeenCalledWith('difficulty', 'HARD');
      expect(appendSpy).toHaveBeenCalledWith('description', 'A scenic trail');
      expect(appendSpy).toHaveBeenCalledWith('image', expect.any(File));
    });
  });
});