/* eslint-disable @typescript-eslint/no-explicit-any */

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { JokeCategory, JokeFlag, JokeLanguage, JokeType, SubmitJokeParameters } from '@models';
import { firstCharToLocaleUpperCase } from '@utils';
import { provideMockJokesStore } from '../../store/jokes-store.mock';
import { jokesStore } from '../../store/jokes.store';
import { routes } from './../../../../app.routes';
import { JokeSubmitComponent } from './joke-submit.component';

describe('JokeSubmitComponent', () => {
  let component: JokeSubmitComponent;
  let fixture: ComponentFixture<JokeSubmitComponent>;
  let mockStore: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JokeSubmitComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection(), provideMockJokesStore(), provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(JokeSubmitComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(jokesStore);

    fixture.autoDetectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should load', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with default values', () => {
      expect(component.jokeForm.get('category')?.value).toBe(JokeCategory.ANY);
      expect(component.jokeForm.get('delivery')?.value).toBeNull();
      expect(component.jokeForm.get('flags')?.value).toEqual([]);
      expect(component.jokeForm.get('joke')?.value).toBeNull();
      expect(component.jokeForm.get('lang')?.value).toEqual([JokeLanguage.ENGLISH]);
      expect(component.jokeForm.get('safe')?.value).toBe(false);
      expect(component.jokeForm.get('setup')?.value).toBeNull();
      expect(component.jokeForm.get('type')?.value).toEqual([JokeType.SINGLE]);
    });

    it('should set joke field as required initially', () => {
      const jokeControl = component.jokeForm.get('joke');
      expect(jokeControl?.hasError('required')).toBe(true);
    });

    it('should initialize joke type options correctly', () => {
      expect(component.jokeTypeOptions).toEqual([
        { label: 'Single', value: JokeType.SINGLE },
        { label: 'Two-part', value: JokeType.TWO_PART },
      ]);
    });

    it('should initialize flag options correctly', () => {
      const expectedFlags = Object.values(JokeFlag).map((flag) => ({
        label: firstCharToLocaleUpperCase(flag),
        value: flag,
      }));
      expect(component.flagOptions).toEqual(expectedFlags);
    });

    it('should initialize language options correctly', () => {
      const expectedLangs = Object.entries(JokeLanguage).map(([key, value]) => ({
        label: firstCharToLocaleUpperCase(key.toLocaleLowerCase()),
        value: value,
      }));
      expect(component.langOptions).toEqual(expectedLangs);
    });

    it('should set up dynamic validation after ngOnInit', () => {
      component.ngOnInit();
      const jokeControl = component.jokeForm.get('joke');
      const setupControl = component.jokeForm.get('setup');
      const deliveryControl = component.jokeForm.get('delivery');

      expect(jokeControl?.hasError('required')).toBe(true);
      expect(setupControl?.hasError('required')).toBe(false);
      expect(deliveryControl?.hasError('required')).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call store.resetSubmitJokeState on destroy', () => {
      component.ngOnDestroy();
      expect(mockStore.resetSubmitJokeState).toHaveBeenCalled();
    });
  });

  describe('Dynamic Validation', () => {
    it('should update validators when switching to TWO_PART joke type', async () => {
      const jokeControl = component.jokeForm.get('joke');
      const setupControl = component.jokeForm.get('setup');
      const deliveryControl = component.jokeForm.get('delivery');

      component.jokeForm.get('type')?.setValue([JokeType.TWO_PART]);
      await fixture.whenStable();

      expect(setupControl?.hasError('required')).toBe(true);
      expect(deliveryControl?.hasError('required')).toBe(true);
      expect(jokeControl?.hasError('required')).toBe(false);
    });

    it('should update validators when switching back to SINGLE joke type', async () => {
      const jokeControl = component.jokeForm.get('joke');
      const setupControl = component.jokeForm.get('setup');
      const deliveryControl = component.jokeForm.get('delivery');

      component.jokeForm.get('type')?.setValue([JokeType.TWO_PART]);
      await fixture.whenStable();

      component.jokeForm.get('type')?.setValue([JokeType.SINGLE]);
      await fixture.whenStable();

      expect(jokeControl?.hasError('required')).toBe(true);
      expect(setupControl?.hasError('required')).toBe(false);
      expect(deliveryControl?.hasError('required')).toBe(false);
    });

    it('should call updateValueAndValidity on all relevant controls when type changes', async () => {
      const jokeControl = component.jokeForm.get('joke');
      const setupControl = component.jokeForm.get('setup');
      const deliveryControl = component.jokeForm.get('delivery');

      const jokeSpy = jest.spyOn(jokeControl!, 'updateValueAndValidity');
      const setupSpy = jest.spyOn(setupControl!, 'updateValueAndValidity');
      const deliverySpy = jest.spyOn(deliveryControl!, 'updateValueAndValidity');

      component.jokeForm.get('type')?.setValue([JokeType.TWO_PART]);
      await fixture.whenStable();

      expect(jokeSpy).toHaveBeenCalled();
      expect(setupSpy).toHaveBeenCalled();
      expect(deliverySpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should not call the API if the form is invalid', () => {
      // The form is invalid initially
      component.onSubmit();

      expect(mockStore.submitJoke).not.toHaveBeenCalled();
    });

    it('should submit a SINGLE type joke with correct parameters', () => {
      component.jokeForm.patchValue({
        category: JokeCategory.PROGRAMMING,
        joke: 'Why do programmers prefer dark mode?',
        lang: [JokeLanguage.ENGLISH],
        type: [JokeType.SINGLE],
        flags: [JokeFlag.NSFW, JokeFlag.EXPLICIT],
        setup: 'Setup should not be included',
        delivery: 'Delivery should not be included',
      });

      component.onSubmit();

      const expectedParams: SubmitJokeParameters = {
        formatVersion: 3,
        category: JokeCategory.PROGRAMMING,
        delivery: undefined,
        flags: {
          explicit: true,
          nsfw: true,
          political: false,
          racist: false,
          religious: false,
          sexist: false,
        },
        joke: 'Why do programmers prefer dark mode?',
        lang: JokeLanguage.ENGLISH,
        safe: false,
        setup: undefined,
        type: JokeType.SINGLE,
      };

      expect(mockStore.submitJoke).toHaveBeenCalledWith(expectedParams);
    });

    it('should submit a TWO_PART type joke with correct parameters', async () => {
      component.jokeForm.get('type')?.setValue([JokeType.TWO_PART]);
      await fixture.whenStable();

      component.jokeForm.patchValue({
        category: JokeCategory.DARK,
        setup: 'Why did the chicken cross the road?',
        delivery: 'To get to the other side!',
        lang: [JokeLanguage.GERMAN],
        flags: [JokeFlag.POLITICAL],
        joke: 'Joke should not be included',
      });

      component.onSubmit();

      const expectedParams: SubmitJokeParameters = {
        formatVersion: 3,
        category: JokeCategory.DARK,
        delivery: 'To get to the other side!',
        flags: {
          explicit: false,
          nsfw: false,
          political: true,
          racist: false,
          religious: false,
          sexist: false,
        },
        joke: undefined,
        lang: JokeLanguage.GERMAN,
        safe: false,
        setup: 'Why did the chicken cross the road?',
        type: JokeType.TWO_PART,
      };

      expect(mockStore.submitJoke).toHaveBeenCalledWith(expectedParams);
    });

    it('should correctly map all flags when selected', () => {
      component.jokeForm.patchValue({
        joke: 'Test',
        flags: [
          JokeFlag.EXPLICIT,
          JokeFlag.NSFW,
          JokeFlag.POLITICAL,
          JokeFlag.RACIST,
          JokeFlag.RELIGIOUS,
          JokeFlag.SEXIST,
        ],
      });

      component.onSubmit();

      const calledParams = mockStore.submitJoke.mock.calls[0][0];
      expect(calledParams.flags).toEqual({
        explicit: true,
        nsfw: true,
        political: true,
        racist: true,
        religious: true,
        sexist: true,
      });
    });

    it('should handle empty flags array', () => {
      component.jokeForm.patchValue({
        category: JokeCategory.PUN,
        joke: 'A pun joke',
        lang: [JokeLanguage.ENGLISH],
        type: [JokeType.SINGLE],
        flags: [],
      });

      component.onSubmit();

      const calledParams = mockStore.submitJoke.mock.calls[0][0];
      expect(calledParams.flags).toEqual({
        explicit: false,
        nsfw: false,
        political: false,
        racist: false,
        religious: false,
        sexist: false,
      });
    });

    it('should call store.submitJoke when onSubmit is called', () => {
      component.jokeForm.patchValue({
        joke: 'Test joke',
      });

      component.onSubmit();

      expect(mockStore.submitJoke).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Reset on Success', () => {
    it('should reset form when submitJokeSuccess becomes true', async () => {
      mockStore.submitJokeSuccess.set(null);
      fixture.detectChanges();

      component.jokeForm.patchValue({
        category: JokeCategory.PROGRAMMING,
        joke: 'Test joke',
        lang: [JokeLanguage.ENGLISH],
      });

      expect(component.jokeForm.get('joke')?.value).toBe('Test joke');
      expect(component.jokeForm.get('category')?.value).toBe(JokeCategory.PROGRAMMING);

      mockStore.submitJokeSuccess.set(true);
      await fixture.whenStable();

      expect(component.jokeForm.get('joke')?.value).toBeNull();
      expect(component.jokeForm.get('category')?.value).toBe(JokeCategory.ANY);
    });

    it('should not reset form when submitJokeSuccess is false', async () => {
      mockStore.submitJokeSuccess.set(false);
      fixture.detectChanges();

      component.jokeForm.patchValue({
        joke: 'Test joke',
      });

      await fixture.whenStable();

      expect(component.jokeForm.get('joke')?.value).toBe('Test joke');
    });

    it('should not reset form when submitJokeSuccess is null', async () => {
      mockStore.submitJokeSuccess.set(null);
      fixture.detectChanges();

      component.jokeForm.patchValue({
        joke: 'Test joke',
      });

      await fixture.whenStable();

      expect(component.jokeForm.get('joke')?.value).toBe('Test joke');
    });
  });
});
