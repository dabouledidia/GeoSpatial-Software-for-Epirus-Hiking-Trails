import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { UserManagement } from './user-management';
import { UserServices } from '../services/user.services';
import { User } from '../models/user.model';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const mockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: 'test@mail.com',
  firstname: 'John',
  lastname: 'Doe',
  role: 'ROLE_USER',
  ...overrides
});

describe('UserManagement', () => {
  let component: UserManagement;
  let fixture: ComponentFixture<UserManagement>;
  let userServiceMock: jest.Mocked<UserServices>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    userServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of([])),
      deleteUser: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<UserServices>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [UserManagement, RouterModule.forRoot([])],
      providers: [
        { provide: UserServices, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagement);
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

    it('should initialise users as empty array', () => {
      expect(component.users).toEqual([]);
    });

    it('should call getAllUsers on init', () => {
      expect(userServiceMock.getAllUsers).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // getAllUsers
  // ─────────────────────────────────────────────

  describe('getAllUsers', () => {

    it('should populate users on success', () => {
      const users = [mockUser(), mockUser({ id: 2, email: 'jane@mail.com' })];
      userServiceMock.getAllUsers.mockReturnValue(of(users));

      component.getAllUsers();

      expect(component.users).toEqual(users);
    });

    it('should set users to empty array when service returns empty', () => {
      userServiceMock.getAllUsers.mockReturnValue(of([]));

      component.getAllUsers();

      expect(component.users).toEqual([]);
    });

    it('should overwrite existing users', () => {
      component.users = [mockUser({ id: 1 }), mockUser({ id: 2 })];
      userServiceMock.getAllUsers.mockReturnValue(of([mockUser({ id: 3 })]));

      component.getAllUsers();

      expect(component.users).toEqual([mockUser({ id: 3 })]);
    });

    it('should call getAllUsers exactly once per call', () => {
      userServiceMock.getAllUsers.mockReturnValue(of([]));

      component.getAllUsers();

      // once from ngOnInit + once from manual call
      expect(userServiceMock.getAllUsers).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────
  // deleteUser
  // ─────────────────────────────────────────────

  describe('deleteUser', () => {

    it('should call deleteUser with correct id', () => {
      userServiceMock.deleteUser.mockReturnValue(of({}));

      component.deleteUser(1);

      expect(userServiceMock.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should call deleteUser exactly once', () => {
      userServiceMock.deleteUser.mockReturnValue(of({}));

      component.deleteUser(1);

      expect(userServiceMock.deleteUser).toHaveBeenCalledTimes(1);
    });

    it('should refresh users after deletion', () => {
      userServiceMock.deleteUser.mockReturnValue(of({}));
      userServiceMock.getAllUsers.mockReturnValue(of([]));

      component.deleteUser(1);

      // once from ngOnInit + once after delete
      expect(userServiceMock.getAllUsers).toHaveBeenCalledTimes(2);
    });

    it('should call deleteUser with different ids correctly', () => {
      userServiceMock.deleteUser.mockReturnValue(of({}));

      component.deleteUser(42);

      expect(userServiceMock.deleteUser).toHaveBeenCalledWith(42);
    });

    it('should update users list after deletion', () => {
      const updatedUsers = [mockUser({ id: 2 })];
      userServiceMock.deleteUser.mockReturnValue(of({}));
      userServiceMock.getAllUsers.mockReturnValue(of(updatedUsers));

      component.deleteUser(1);

      expect(component.users).toEqual(updatedUsers);
    });
  });
});