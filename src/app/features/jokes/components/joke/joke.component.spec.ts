import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockJoke, mockSingleJoke, mockTwoPartJoke } from '@mocks';
import { JokeCategory, JokeType } from '@models';
import { JokeComponent } from './joke.component';

describe('JokeComponent', () => {
  let component: JokeComponent;
  let fixture: ComponentFixture<JokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JokeComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(JokeComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('joke', mockSingleJoke);
    fixture.autoDetectChanges();
  });

  describe('Component Initialization', () => {
    it('should load', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('badges computed signal', () => {
    it('should include "Single" badge for single type jokes', () => {
      const badges = component.badges();
      expect(badges[0]).toBe('Single');
    });

    it('should include "Two-part" badge for twopart type jokes', () => {
      fixture.componentRef.setInput('joke', mockTwoPartJoke);

      const badges = component.badges();
      expect(badges[0]).toBe('Two-part');
    });

    it('should include category badge with capitalized first letter', () => {
      const badges = component.badges();
      expect(badges).toContain('Programming');
      expect(badges[badges.length - 1]).toBe('Programming');
    });

    it('should include all active flags in badges', () => {
      const jokeWithMultipleFlags = createMockJoke({
        type: JokeType.SINGLE,
        flags: {
          explicit: true,
          nsfw: true,
          political: false,
          racist: false,
          religious: false,
          sexist: true,
        },
        category: JokeCategory.DARK,
      });

      fixture.componentRef.setInput('joke', jokeWithMultipleFlags);

      const badges = component.badges();
      expect(badges).toContain('Single');
      expect(badges).toContain('Explicit');
      expect(badges).toContain('Nsfw');
      expect(badges).toContain('Sexist');
      expect(badges).toContain('Dark');
      expect(badges).not.toContain('Political');
      expect(badges).not.toContain('Racist');
      expect(badges).not.toContain('Religious');
    });
  });
});
