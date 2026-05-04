import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ReviewList } from './review-list';
import { ReviewService } from '../services/review.service';
import { UserServices } from '../services/user.services';
import { Review } from '../models/review.model';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const mockReview = (overrides: Partial<Review> = {}): Review => ({
  id: 1,
  rating: 5,
  comment: 'Great trail!',
  createdAt: new Date('2025-01-01'), 
  userEmail: 'test@mail.com',
  trailId: 1,
  ...overrides
});

describe('ReviewList', () => {
  let component: ReviewList;
  let fixture: ComponentFixture<ReviewList>;
  let reviewServiceMock: jest.Mocked<ReviewService>;
  let userServiceMock: jest.Mocked<UserServices>;
  let routerMock: jest.Mocked<Router>;
  let activatedRouteMock: { snapshot: { paramMap: { get: jest.Mock } } };

  // ─────────────────────────────────────────────
  // Setup helpers
  // ─────────────────────────────────────────────

  const createComponent = async (routeId: string | null = null) => {
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(routeId)
        }
      }
    };

    reviewServiceMock = {
      getReviews: jest.fn(),
      getUserReviews: jest.fn(),
      deleteReview: jest.fn()
    } as unknown as jest.Mocked<ReviewService>;

    userServiceMock = {
  isLoggedIn: jest.fn().mockReturnValue(true),
  getRole: jest.fn().mockReturnValue('ROLE_USER'),
  getUser: jest.fn().mockReturnValue({ id: 1, email: 'test@mail.com' }) // ✅ add this
} as unknown as jest.Mocked<UserServices>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ReviewList],
      providers: [
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: UserServices, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewList);
    component = fixture.componentInstance;
  };

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // ─────────────────────────────────────────────
  // Initialisation
  // ─────────────────────────────────────────────

  describe('initialisation', () => {

    it('should create the component', async () => {
      reviewServiceMock = { getReviews: jest.fn(), getUserReviews: jest.fn().mockReturnValue(of([])), deleteReview: jest.fn() } as unknown as jest.Mocked<ReviewService>;
      userServiceMock = { isLoggedIn: jest.fn() } as unknown as jest.Mocked<UserServices>;
      activatedRouteMock = { snapshot: { paramMap: { get: jest.fn().mockReturnValue(null) } } };

      await TestBed.configureTestingModule({
        imports: [ReviewList],
        providers: [
          { provide: ReviewService, useValue: reviewServiceMock },
          { provide: UserServices, useValue: userServiceMock },
          { provide: Router, useValue: { navigate: jest.fn() } },
          { provide: ActivatedRoute, useValue: activatedRouteMock }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ReviewList);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should initialise reviews as empty array', async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));
      fixture.detectChanges();

      expect(component.reviews).toEqual([]);
    });

    it('should initialise fullComment as empty string', async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));
      fixture.detectChanges();

      expect(component.fullComment).toBe('');
    });

    it('should initialise displayCommentDialog as false', async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));
      fixture.detectChanges();

      expect(component.displayCommentDialog).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // ngOnInit — routing logic
  // ─────────────────────────────────────────────

  describe('ngOnInit', () => {

    it('should call getReviews with trailId when route id exists', async () => {
      await createComponent('1');
      reviewServiceMock.getReviews.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(reviewServiceMock.getReviews).toHaveBeenCalledWith(1);
      expect(reviewServiceMock.getUserReviews).not.toHaveBeenCalled();
    });

    it('should call getUserReviews when route id is null', async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(reviewServiceMock.getUserReviews).toHaveBeenCalled();
      expect(reviewServiceMock.getReviews).not.toHaveBeenCalled();
    });

    it('should convert route id string to number when calling getReviews', async () => {
      await createComponent('42');
      reviewServiceMock.getReviews.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(reviewServiceMock.getReviews).toHaveBeenCalledWith(42);
    });
  });

  // ─────────────────────────────────────────────
  // getReviews
  // ─────────────────────────────────────────────

  describe('getReviews', () => {

    it('should populate reviews on success', async () => {
      await createComponent('1');
      const reviews = [mockReview(), mockReview({ id: 2 })];
      reviewServiceMock.getReviews.mockReturnValue(of(reviews));

      fixture.detectChanges();

      expect(component.reviews).toEqual(reviews);
    });

    it('should set reviews to empty array when service returns empty', async () => {
      await createComponent('1');
      reviewServiceMock.getReviews.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(component.reviews).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────
  // getUserReviews
  // ─────────────────────────────────────────────

  describe('getUserReviews', () => {

    it('should populate reviews on success', async () => {
      await createComponent(null);
      const reviews = [mockReview()];
      reviewServiceMock.getUserReviews.mockReturnValue(of(reviews));

      fixture.detectChanges();

      expect(component.reviews).toEqual(reviews);
    });

    it('should set reviews to empty array when service returns empty', async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));

      fixture.detectChanges();

      expect(component.reviews).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────
  // deleteReview
  // ─────────────────────────────────────────────

  describe('deleteReview', () => {

    beforeEach(async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));
      fixture.detectChanges();
    });

    it('should remove deleted review from reviews array', () => {
      component.reviews = [mockReview({ id: 1 }), mockReview({ id: 2 })];
      reviewServiceMock.deleteReview.mockReturnValue(of({}));

      component.deleteReview(1);

      expect(component.reviews).toEqual([mockReview({ id: 2 })]);
    });

    it('should call deleteReview service with correct id', () => {
      component.reviews = [mockReview({ id: 1 })];
      reviewServiceMock.deleteReview.mockReturnValue(of({}));

      component.deleteReview(1);

      expect(reviewServiceMock.deleteReview).toHaveBeenCalledWith(1);
    });

    it('should not modify reviews when id does not match', () => {
      component.reviews = [mockReview({ id: 1 }), mockReview({ id: 2 })];
      reviewServiceMock.deleteReview.mockReturnValue(of({}));

      component.deleteReview(99);

      expect(component.reviews.length).toBe(2);
    });

    it('should call deleteReview exactly once', () => {
      component.reviews = [mockReview({ id: 1 })];
      reviewServiceMock.deleteReview.mockReturnValue(of({}));

      component.deleteReview(1);

      expect(reviewServiceMock.deleteReview).toHaveBeenCalledTimes(1);
    });
  });

  // ─────────────────────────────────────────────
  // showFullComment
  // ─────────────────────────────────────────────

  describe('showFullComment', () => {

    beforeEach(async () => {
      await createComponent(null);
      reviewServiceMock.getUserReviews.mockReturnValue(of([]));
      fixture.detectChanges();
    });

    it('should set fullComment to provided text', () => {
      component.showFullComment('This is a long comment');

      expect(component.fullComment).toBe('This is a long comment');
    });

    it('should set displayCommentDialog to true', () => {
      component.showFullComment('Some comment');

      expect(component.displayCommentDialog).toBe(true);
    });

    it('should update fullComment on subsequent calls', () => {
      component.showFullComment('First comment');
      component.showFullComment('Second comment');

      expect(component.fullComment).toBe('Second comment');
    });

    it('should handle empty string', () => {
      component.showFullComment('');

      expect(component.fullComment).toBe('');
      expect(component.displayCommentDialog).toBe(true);
    });
  });
});