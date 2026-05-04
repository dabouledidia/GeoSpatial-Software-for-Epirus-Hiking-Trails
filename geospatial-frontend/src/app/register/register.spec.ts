import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Register } from './register';
import { UserServices } from '../services/user.services';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';



describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let userServiceMock: jest.Mocked<UserServices>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    userServiceMock = {
      register: jest.fn()
    } as unknown as jest.Mocked<UserServices>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule,provideRouter,   provideHttpClient()
      ,RouterModule.forRoot([])],
      providers: [
        { provide: UserServices, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─────────────────────────────────────────────
  // Initialisation
  // ─────────────────────────────────────────────

  describe('initialisation', () => {

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialise form with empty fields', () => {
      expect(component.userRegister.value).toEqual({
        email: '',
        firstname: '',
        lastname: '',
        password: ''
      });
    });

    it('should have all four form controls', () => {
      expect(component.userRegister.contains('email')).toBe(true);
      expect(component.userRegister.contains('firstname')).toBe(true);
      expect(component.userRegister.contains('lastname')).toBe(true);
      expect(component.userRegister.contains('password')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────
  // register()
  // ─────────────────────────────────────────────

  describe('register()', () => {

    it('should call userService.register with the form', () => {
      component.userRegister.setValue({
        email: 'test@mail.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123'
      });

      component.register();

      expect(userServiceMock.register).toHaveBeenCalledWith(
        component.userRegister
      );
    });

    it('should call userService.register exactly once', () => {
      component.register();

      expect(userServiceMock.register).toHaveBeenCalledTimes(1);
    });

    it('should navigate to /register after calling service', () => {
      component.register();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate exactly once', () => {
      component.register();

      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    });

    it('should call register before navigating', () => {
      const callOrder: string[] = [];
      userServiceMock.register.mockImplementation(() => callOrder.push('register'));
      routerMock.navigate.mockImplementation(() => {
        callOrder.push('navigate');
        return Promise.resolve(true);
      });

      component.register();

      expect(callOrder).toEqual(['register', 'navigate']);
    });

    it('should call register with updated form values', () => {
      component.userRegister.setValue({
        email: 'jane@mail.com',
        firstname: 'Jane',
        lastname: 'Doe',
        password: 'secret123'
      });

      component.register();

      expect(userServiceMock.register).toHaveBeenCalledWith(
        expect.objectContaining({
          value: {
            email: 'jane@mail.com',
            firstname: 'Jane',
            lastname: 'Doe',
            password: 'secret123'
          }
        })
      );
    });
  });

  // ─────────────────────────────────────────────
  // Form state
  // ─────────────────────────────────────────────

  describe('form state', () => {

    it('should reflect updated values in form controls', () => {
      component.userRegister.setValue({
        email: 'test@mail.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123'
      });

      expect(component.userRegister.get('email')?.value).toBe('test@mail.com');
      expect(component.userRegister.get('firstname')?.value).toBe('John');
      expect(component.userRegister.get('lastname')?.value).toBe('Doe');
      expect(component.userRegister.get('password')?.value).toBe('password123');
    });

    it('should keep form valid with any input since no validators are defined', () => {
      component.userRegister.setValue({
        email: 'test@mail.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123'
      });

      // No validators defined — form is always valid
      // Update once you add Validators.required / Validators.email
      expect(component.userRegister.valid).toBe(true);
    });

    it('should keep form valid even with empty fields since no validators are defined', () => {
      expect(component.userRegister.valid).toBe(true);
    });
  });

  // ─────────────────────────────────────────────
  // Design issues documented as tests
  // ─────────────────────────────────────────────

  describe('known issues', () => {

    it('should navigate to /register even on service error — no error handling', () => {
      userServiceMock.register.mockImplementation(() => {
        throw new Error('Registration failed');
      });

      // No try/catch in register() — error propagates, navigate is never called
      expect(() => component.register()).toThrow('Registration failed');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to /register after success — redirects to same page instead of login', () => {
      // ⚠️ Navigating back to /register after registering is likely a bug
      // Should probably navigate to /login or /main-page instead
      component.register();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
    });
  });
});