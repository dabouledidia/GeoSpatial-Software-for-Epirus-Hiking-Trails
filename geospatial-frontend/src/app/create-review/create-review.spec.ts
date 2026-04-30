import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateReview } from './create-review';
import { ReviewService } from '../services/review.service';

describe('CreateReview', () => {
  let component: CreateReview;
  let fixture: ComponentFixture<CreateReview>;
  let reviewServiceMock: jest.Mocked<ReviewService>;
  let routerMock: jest.Mocked<Router>;
  let activatedRouteMock: { snapshot: { paramMap: { get: jest.Mock } } };

  beforeEach(async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    reviewServiceMock = {
      addReview: jest.fn()
    } as unknown as jest.Mocked<ReviewService>;

    routerMock = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [CreateReview],
      providers: [
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReview);
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

    it('should initialise rating as 0', () => {
      expect(component.rating).toBe(0);
    });

    it('should initialise comment as empty string', () => {
      expect(component.comment).toBe('');
    });

    it('should set trailId from route param on init', () => {
      expect(component.trailId).toBe(1);
    });

    it('should convert route param string to number', () => {
      expect(typeof component.trailId).toBe('number');
    });
  });

  // ─────────────────────────────────────────────
  // ngOnInit
  // ─────────────────────────────────────────────

  describe('ngOnInit', () => {

    it('should read id param from route snapshot', () => {
      expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    });

    it('should set trailId to 0 when route param is null', async () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

      // re-run ngOnInit manually with null param
      component.ngOnInit();

      expect(component.trailId).toBe(0);
    });

    it('should set trailId correctly for different route params', async () => {
      activatedRouteMock.snapshot.paramMap.get.mockReturnValue('42');

      component.ngOnInit();

      expect(component.trailId).toBe(42);
    });
  });

  // ─────────────────────────────────────────────
  // submitReview
  // ─────────────────────────────────────────────

  describe('submitReview', () => {

    it('should call addReview with correct trailId and review data', () => {
      reviewServiceMock.addReview.mockReturnValue(of({}));
      component.rating = 4;
      component.comment = 'Amazing trail!';

      component.submitReview();

      expect(reviewServiceMock.addReview).toHaveBeenCalledWith(1, {
        rating: 4,
        comment: 'Amazing trail!'
      });
    });

    it('should call addReview exactly once', () => {
      reviewServiceMock.addReview.mockReturnValue(of({}));

      component.submitReview();

      expect(reviewServiceMock.addReview).toHaveBeenCalledTimes(1);
    });

    it('should navigate to trail-list after submit', () => {
      reviewServiceMock.addReview.mockReturnValue(of({}));

      component.submitReview();

      expect(routerMock.navigate).toHaveBeenCalledWith(['trail-list']);
    });

    it('should navigate exactly once', () => {
      reviewServiceMock.addReview.mockReturnValue(of({}));

      component.submitReview();

      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    });

    it('should show success alert on success', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      reviewServiceMock.addReview.mockReturnValue(of({}));

      component.submitReview();

      expect(alertSpy).toHaveBeenCalledWith('Created!!');
    });

    it('should show error alert on failure', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      reviewServiceMock.addReview.mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

      component.submitReview();

      expect(alertSpy).toHaveBeenCalledWith('You have to login to create a review');
    });

    it('should submit with default rating 0 and empty comment', () => {
      reviewServiceMock.addReview.mockReturnValue(of({}));

      component.submitReview();

      expect(reviewServiceMock.addReview).toHaveBeenCalledWith(1, {
        rating: 0,
        comment: ''
      });
    });

    it('should use current component trailId when submitting', () => {
      reviewServiceMock.addReview.mockReturnValue(of({}));
      component.trailId = 99;

      component.submitReview();

      expect(reviewServiceMock.addReview).toHaveBeenCalledWith(99, expect.any(Object));
    });
  });

  // ─────────────────────────────────────────────
  // known issues
  // ─────────────────────────────────────────────

  describe('known issues', () => {

    it('should navigate to trail-list even when addReview fails — navigation not inside next block', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      reviewServiceMock.addReview.mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

      // navigate is called outside subscribe so it always runs
      component.submitReview();

      expect(routerMock.navigate).toHaveBeenCalledWith(['trail-list']);
    });
  });
});