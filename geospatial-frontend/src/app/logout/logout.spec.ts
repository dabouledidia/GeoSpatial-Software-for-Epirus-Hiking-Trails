import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Logout } from './logout';
import { UserServices } from '../services/user.services';

describe('Logout', () => {
  let component: Logout;
  let fixture: ComponentFixture<Logout>;
  let userServiceMock: jest.Mocked<UserServices>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    userServiceMock = {
      logout: jest.fn()
    } as unknown as jest.Mocked<UserServices>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [Logout, ReactiveFormsModule, RouterModule],
      providers: [
        { provide: UserServices, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Logout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─────────────────────────────────────────────
  // Initialisation
  // ─────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // logout()
  // ─────────────────────────────────────────────

  it('should call userService.logout', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.logout();

    expect(userServiceMock.logout).toHaveBeenCalled();
  });

  it('should call userService.logout exactly once', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.logout();

    expect(userServiceMock.logout).toHaveBeenCalledTimes(1);
  });

  it('should show logout alert', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.logout();

    expect(alertSpy).toHaveBeenCalledWith('You have been logged out.');
  });

  it('should navigate to login after logout', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.logout();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call logout before navigating', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const callOrder: string[] = [];
    userServiceMock.logout.mockImplementation(() => callOrder.push('logout'));
    routerMock.navigate.mockImplementation(() => { callOrder.push('navigate'); return Promise.resolve(true); });

    component.logout();

    expect(callOrder).toEqual(['logout', 'navigate']);
  });

  it('should not navigate if userService.logout throws', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    userServiceMock.logout.mockImplementation(() => {
      throw new Error('Logout failed');
    });

    expect(() => component.logout()).toThrow('Logout failed');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});