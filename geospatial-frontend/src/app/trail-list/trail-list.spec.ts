import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { TrailList } from './trail-list';
import { TrailService } from '../services/trail.service';
import { UserServices } from '../services/user.services';
import { Trail } from '../models/trail.model';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const mockTrail = (overrides: Partial<Trail> = {}): Trail => ({
  id: 1,
  trailName: 'Mountain Trail',
  location: 'Alps',
  lengthKm: '12.5',
  duration: '3.0',
  difficulty: 'HARD',
  description: 'A scenic trail',
  email: 'test@mail.com',
  image: new File([''], 'img.jpg', { type: 'image/jpeg' }),
  ...overrides
});

describe('TrailList', () => {
  let component: TrailList;
  let fixture: ComponentFixture<TrailList>;
  let trailServiceMock: jest.Mocked<TrailService>;
  let userServiceMock: jest.Mocked<UserServices>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    trailServiceMock = {
      getTrails: jest.fn().mockReturnValue(of([])),
      getUserTrails: jest.fn().mockReturnValue(of([])),
      deleteTrail: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<TrailService>;

    userServiceMock = {
      isLoggedIn: jest.fn().mockReturnValue(true),
      getRole: jest.fn().mockReturnValue('ROLE_USER'),
      getUser: jest.fn().mockReturnValue({ id: 1, email: 'test@mail.com' })
    } as unknown as jest.Mocked<UserServices>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [TrailList, RouterModule.forRoot([])],
      providers: [
        { provide: TrailService, useValue: trailServiceMock },
        { provide: UserServices, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrailList);
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

    it('should initialise trails as empty array', () => {
      expect(component.trails).toEqual([]);
    });

    it('should initialise currentPage as 0', () => {
      expect(component.currentPage).toBe(0);
    });

    it('should initialise rowsPerPage as 4', () => {
      expect(component.rowsPerPage).toBe(4);
    });

    it('should initialise fullComment as empty string', () => {
      expect(component.fullComment).toBe('');
    });

    it('should initialise displayCommentDialog as false', () => {
      expect(component.displayCommentDialog).toBe(false);
    });

    it('should call getTrails on init', () => {
      expect(trailServiceMock.getTrails).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // getTrails
  // ─────────────────────────────────────────────

  describe('getTrails', () => {

    it('should populate trails on success', () => {
      const trails = [mockTrail(), mockTrail({ id: 2 })];
      trailServiceMock.getTrails.mockReturnValue(of(trails));

      component.getTrails();

      expect(component.trails).toEqual(trails);
    });

    it('should set trails to empty array when service returns empty', () => {
      trailServiceMock.getTrails.mockReturnValue(of([]));

      component.getTrails();

      expect(component.trails).toEqual([]);
    });

    it('should call trailService.getTrails exactly once per call', () => {
      trailServiceMock.getTrails.mockReturnValue(of([]));

      component.getTrails();

      // once from ngOnInit + once from manual call
      expect(trailServiceMock.getTrails).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────
  // getUserTrails
  // ─────────────────────────────────────────────

  describe('getUserTrails', () => {

    it('should populate trails with user trails', () => {
      const trails = [mockTrail({ id: 3 })];
      trailServiceMock.getUserTrails.mockReturnValue(of(trails));

      component.getUserTrails();

      expect(component.trails).toEqual(trails);
    });

    it('should set trails to empty array when service returns empty', () => {
      trailServiceMock.getUserTrails.mockReturnValue(of([]));

      component.getUserTrails();

      expect(component.trails).toEqual([]);
    });

    it('should overwrite existing trails', () => {
      component.trails = [mockTrail({ id: 1 }), mockTrail({ id: 2 })];
      trailServiceMock.getUserTrails.mockReturnValue(of([mockTrail({ id: 3 })]));

      component.getUserTrails();

      expect(component.trails).toEqual([mockTrail({ id: 3 })]);
    });
  });

  // ─────────────────────────────────────────────
  // deleteTrail
  // ─────────────────────────────────────────────

  describe('deleteTrail', () => {

    it('should call trailService.deleteTrail with correct id', () => {
      trailServiceMock.deleteTrail.mockReturnValue(of({}));
      trailServiceMock.getTrails.mockReturnValue(of([]));

      component.deleteTrail(1);

      expect(trailServiceMock.deleteTrail).toHaveBeenCalledWith(1);
    });

    it('should refresh trails after deletion', () => {
      trailServiceMock.deleteTrail.mockReturnValue(of({}));
      trailServiceMock.getTrails.mockReturnValue(of([]));

      component.deleteTrail(1);

      expect(trailServiceMock.getTrails).toHaveBeenCalled();
    });

    it('should call deleteTrail exactly once', () => {
      trailServiceMock.deleteTrail.mockReturnValue(of({}));

      component.deleteTrail(1);

      expect(trailServiceMock.deleteTrail).toHaveBeenCalledTimes(1);
    });
  });

  // ─────────────────────────────────────────────
  // createReview
  // ─────────────────────────────────────────────

  describe('createReview', () => {

    it('should navigate to create-review with trail id', () => {
      component.createReview(1);

      expect(routerMock.navigate).toHaveBeenCalledWith(['create-review/1']);
    });

    it('should navigate with correct id', () => {
      component.createReview(42);

      expect(routerMock.navigate).toHaveBeenCalledWith(['create-review/42']);
    });
  });

  // ─────────────────────────────────────────────
  // getReviews
  // ─────────────────────────────────────────────

  describe('getReviews', () => {

    it('should navigate to review-list with trail id', () => {
      component.getReviews(1);

      expect(routerMock.navigate).toHaveBeenCalledWith(['review-list/1']);
    });

    it('should navigate with correct id', () => {
      component.getReviews(42);

      expect(routerMock.navigate).toHaveBeenCalledWith(['review-list/42']);
    });
  });

  // ─────────────────────────────────────────────
  // paginatedTrails
  // ─────────────────────────────────────────────

  describe('paginatedTrails', () => {

    beforeEach(() => {
      component.trails = Array.from({ length: 10 }, (_, i) =>
        mockTrail({ id: i + 1, trailName: `Trail ${i + 1}` })
      );
    });

    it('should return first 4 trails on page 0', () => {
      component.currentPage = 0;

      const result = component.paginatedTrails();

      expect(result.length).toBe(4);
      expect(result[0].id).toBe(1);
      expect(result[3].id).toBe(4);
    });

    it('should return next 4 trails on page 1', () => {
      component.currentPage = 1;

      const result = component.paginatedTrails();

      expect(result.length).toBe(4);
      expect(result[0].id).toBe(5);
      expect(result[3].id).toBe(8);
    });

    it('should return remaining trails on last page', () => {
      component.currentPage = 2;

      const result = component.paginatedTrails();

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(9);
      expect(result[1].id).toBe(10);
    });

    it('should return empty array when trails is empty', () => {
      component.trails = [];
      component.currentPage = 0;

      const result = component.paginatedTrails();

      expect(result).toEqual([]);
    });

    it('should return all trails when less than rowsPerPage', () => {
      component.trails = [mockTrail({ id: 1 }), mockTrail({ id: 2 })];
      component.currentPage = 0;

      const result = component.paginatedTrails();

      expect(result.length).toBe(2);
    });
  });

  // ─────────────────────────────────────────────
  // onPageChange
  // ─────────────────────────────────────────────

  describe('onPageChange', () => {

    it('should update currentPage from event', () => {
      component.onPageChange({ page: 2 });

      expect(component.currentPage).toBe(2);
    });

    it('should update currentPage to 0', () => {
      component.currentPage = 3;
      component.onPageChange({ page: 0 });

      expect(component.currentPage).toBe(0);
    });
  });

  // ─────────────────────────────────────────────
  // showFullComment
  // ─────────────────────────────────────────────

  describe('showFullComment', () => {

    it('should set fullComment to provided text', () => {
      component.showFullComment('A long comment');

      expect(component.fullComment).toBe('A long comment');
    });

    it('should set displayCommentDialog to true', () => {
      component.showFullComment('Some comment');

      expect(component.displayCommentDialog).toBe(true);
    });

    it('should update fullComment on subsequent calls', () => {
      component.showFullComment('First');
      component.showFullComment('Second');

      expect(component.fullComment).toBe('Second');
    });

    it('should handle empty string', () => {
      component.showFullComment('');

      expect(component.fullComment).toBe('');
      expect(component.displayCommentDialog).toBe(true);
    });
  });
});