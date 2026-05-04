import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MainPage } from './main-page';

describe('MainPage', () => {
  let component: MainPage;
  let fixture: ComponentFixture<MainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainPage,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainPage);
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

    it('should initialise aboutVisible as false', () => {
      expect(component.aboutVisible).toBe(false);
    });

    it('should initialise privacyVisible as false', () => {
      expect(component.privacyVisible).toBe(false);
    });

    it('should initialise termsVisible as false', () => {
      expect(component.termsVisible).toBe(false);
    });

    it('should have 3 cards', () => {
      expect(component.cards.length).toBe(3);
    });

    it('should have 3 carousel images', () => {
      expect(component.carouselImages.length).toBe(3);
    });
  });

  // ─────────────────────────────────────────────
  // cards data
  // ─────────────────────────────────────────────

  describe('cards', () => {

    it('should have Explore Trails as first card', () => {
      expect(component.cards[0].title).toBe('Explore Trails');
      expect(component.cards[0].link).toBe('/explore-trails');
    });

    it('should have View All Trails as second card', () => {
      expect(component.cards[1].title).toBe('View All Trails');
      expect(component.cards[1].link).toBe('/trail-list');
    });

    it('should have Create A Trail as third card', () => {
      expect(component.cards[2].title).toBe('Create A Trail');
      expect(component.cards[2].link).toBe('/create-trail');
    });

    it('should have title, description, image and link on every card', () => {
      component.cards.forEach(card => {
        expect(card.title).toBeTruthy();
        expect(card.description).toBeTruthy();
        expect(card.image).toBeTruthy();
        expect(card.link).toBeTruthy();
      });
    });
  });

  // ─────────────────────────────────────────────
  // carouselImages data
  // ─────────────────────────────────────────────

  describe('carouselImages', () => {

    it('should have only non-empty image paths', () => {
      component.carouselImages.forEach(image => {
        expect(image).toBeTruthy();
      });
    });

    it('should have all images starting with assets/', () => {
      component.carouselImages.forEach(image => {
        expect(image.startsWith('assets/')).toBe(true);
      });
    });
  });

  // ─────────────────────────────────────────────
  // showAbout
  // ─────────────────────────────────────────────

  describe('showAbout', () => {

    it('should set aboutVisible to true', () => {
      component.showAbout();

      expect(component.aboutVisible).toBe(true);
    });

    it('should not affect privacyVisible', () => {
      component.showAbout();

      expect(component.privacyVisible).toBe(false);
    });

    it('should not affect termsVisible', () => {
      component.showAbout();

      expect(component.termsVisible).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // showPrivacy
  // ─────────────────────────────────────────────

  describe('showPrivacy', () => {

    it('should set privacyVisible to true', () => {
      component.showPrivacy();

      expect(component.privacyVisible).toBe(true);
    });

    it('should not affect aboutVisible', () => {
      component.showPrivacy();

      expect(component.aboutVisible).toBe(false);
    });

    it('should not affect termsVisible', () => {
      component.showPrivacy();

      expect(component.termsVisible).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // showTerms
  // ─────────────────────────────────────────────

  describe('showTerms', () => {

    it('should set termsVisible to true', () => {
      component.showTerms();

      expect(component.termsVisible).toBe(true);
    });

    it('should not affect aboutVisible', () => {
      component.showTerms();

      expect(component.aboutVisible).toBe(false);
    });

    it('should not affect privacyVisible', () => {
      component.showTerms();

      expect(component.privacyVisible).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // dialog isolation
  // ─────────────────────────────────────────────

  describe('dialog isolation', () => {

    it('should allow all dialogs open simultaneously', () => {
      component.showAbout();
      component.showPrivacy();
      component.showTerms();

      expect(component.aboutVisible).toBe(true);
      expect(component.privacyVisible).toBe(true);
      expect(component.termsVisible).toBe(true);
    });

    it('should keep other dialogs closed when one opens', () => {
      component.showAbout();

      expect(component.privacyVisible).toBe(false);
      expect(component.termsVisible).toBe(false);
    });
  });
});