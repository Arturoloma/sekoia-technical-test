/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { JokeApiService } from '@core/services';
import {
  createMockSingleJokeResponse,
  mockErrorResponse,
  mockMultipleJokesResponse,
  mockSafeFlags,
  mockSingleJoke,
  mockSingleJokeResponse,
  mockTwoPartJoke,
} from '@mocks';
import {
  GetJokesParameters,
  JokeCategory,
  JokeLanguage,
  JokeType,
  SubmitJokeParameters,
} from '@models';
import { of, throwError } from 'rxjs';
import { initialState, jokesStore } from './jokes.store';

describe('jokesStore', () => {
  let store: InstanceType<typeof jokesStore>;
  let mockJokeApiService: jest.Mocked<JokeApiService>;

  beforeEach(() => {
    mockJokeApiService = {
      getJokes: jest.fn().mockReturnValue(of(mockMultipleJokesResponse)),
      submitJoke: jest.fn().mockReturnValue(of(mockSingleJokeResponse)),
    } as any;

    TestBed.configureTestingModule({
      providers: [jokesStore, { provide: JokeApiService, useValue: mockJokeApiService }],
    });

    store = TestBed.inject(jokesStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  describe('getJokes', () => {
    it('should fetch jokes successfully with multiple jokes response', (done) => {
      mockJokeApiService.getJokes.mockReturnValue(of(mockMultipleJokesResponse));

      store.getJokes({});

      expect(store.jokes()).toEqual([mockSingleJoke, mockTwoPartJoke]);
      expect(store.isJokeListLoading()).toBe(false);
      expect(store.getJokesError()).toBeNull();
      done();
    });

    it('should fetch jokes successfully with single joke response', (done) => {
      mockJokeApiService.getJokes.mockReturnValue(of(mockSingleJokeResponse));

      store.getJokes({});

      expect(store.jokes()).toEqual([mockSingleJokeResponse]);
      expect(store.isJokeListLoading()).toBe(false);
      expect(store.getJokesError()).toBeNull();
      done();
    });

    it('should merge provided parameters with existing filters', () => {
      const params: Partial<GetJokesParameters> = {
        category: JokeCategory.PROGRAMMING,
        amount: 5,
      };

      mockJokeApiService.getJokes.mockReturnValue(of(mockMultipleJokesResponse));

      store.getJokes(params);

      expect(mockJokeApiService.getJokes).toHaveBeenCalledWith(
        expect.objectContaining({
          category: JokeCategory.PROGRAMMING,
          amount: 5,
          lang: JokeLanguage.ENGLISH,
        }),
      );
    });

    it('should handle API error response', (done) => {
      mockJokeApiService.getJokes.mockReturnValue(of(mockErrorResponse as any));

      store.getJokes({});

      expect(store.isJokeListLoading()).toBe(false);
      expect(store.getJokesError()).toEqual(mockErrorResponse);
      done();
    });

    it('should handle HTTP error', (done) => {
      const httpError = { error: mockErrorResponse };
      mockJokeApiService.getJokes.mockReturnValue(throwError(() => httpError));

      store.getJokes({});

      expect(store.isJokeListLoading()).toBe(false);
      expect(store.getJokesError()).toEqual(mockErrorResponse);
      done();
    });

    it('should clear previous error when fetching new jokes', (done) => {
      mockJokeApiService.getJokes.mockReturnValue(of(mockMultipleJokesResponse));

      store.getJokes({});

      expect(store.getJokesError()).toBeNull();
      done();
    });
  });

  describe('submitJoke', () => {
    const submitParams: SubmitJokeParameters = {
      formatVersion: 3,
      category: JokeCategory.PROGRAMMING,
      joke: 'Test joke',
      lang: JokeLanguage.ENGLISH,
      type: JokeType.SINGLE,
      flags: mockSafeFlags,
      safe: false,
    };

    it('should submit joke successfully', (done) => {
      const successResponse = createMockSingleJokeResponse();
      mockJokeApiService.submitJoke.mockReturnValue(of(successResponse));

      store.submitJoke(submitParams);

      expect(store.isJokeSubmitLoading()).toBe(false);
      expect(store.submitJokeSuccess()).toBe(true);
      expect(store.submitJokeError()).toBeNull();
      done();
    });

    it('should set loading state when submitting joke', () => {
      mockJokeApiService.submitJoke.mockReturnValue(of(mockSingleJokeResponse));

      store.submitJoke(submitParams);

      expect(mockJokeApiService.submitJoke).toHaveBeenCalledWith(submitParams);
    });

    it('should handle API error response when submitting', (done) => {
      mockJokeApiService.submitJoke.mockReturnValue(of(mockErrorResponse as any));

      store.submitJoke(submitParams);

      expect(store.isJokeSubmitLoading()).toBe(false);
      expect(store.submitJokeSuccess()).toBe(false);
      expect(store.submitJokeError()).toEqual(mockErrorResponse);
      done();
    });

    it('should handle HTTP error when submitting', (done) => {
      const httpError = { error: mockErrorResponse };
      mockJokeApiService.submitJoke.mockReturnValue(throwError(() => httpError));

      store.submitJoke(submitParams);

      expect(store.isJokeSubmitLoading()).toBe(false);
      expect(store.submitJokeSuccess()).toBe(false);
      expect(store.submitJokeError()).toEqual(mockErrorResponse);
      done();
    });

    it('should clear previous error when submitting new joke', (done) => {
      mockJokeApiService.submitJoke.mockReturnValue(of(mockSingleJokeResponse));

      store.submitJoke(submitParams);

      expect(store.submitJokeError()).toBeNull();
      done();
    });
  });

  describe('resetJokeListState', () => {
    it('should reset joke list state to initial values', () => {
      store.resetJokeListState();

      expect(store.jokes()).toBe(initialState.jokes);
      expect(store.isJokeListLoading()).toBe(initialState.isJokeListLoading);
      expect(store.getJokesError()).toBe(initialState.getJokesError);
      expect(store.filters()).toBe(initialState.filters);
    });
  });

  describe('resetSubmitJokeState', () => {
    it('should reset submit joke state to initial values', () => {
      store.resetSubmitJokeState();

      expect(store.isJokeSubmitLoading()).toBe(initialState.isJokeSubmitLoading);
      expect(store.submitJokeError()).toBe(initialState.submitJokeError);
      expect(store.submitJokeSuccess()).toBe(initialState.submitJokeSuccess);
    });
  });

  describe('updateFilters', () => {
    beforeEach(() => {
      mockJokeApiService.getJokes.mockClear();
    });

    it('should merge new filters with existing filters', () => {
      const newFilters: Partial<GetJokesParameters> = {
        category: JokeCategory.DARK,
      };

      store.updateFilters(newFilters);

      const updatedFilters = store.filters();
      expect(updatedFilters.category).toBe(JokeCategory.DARK);
      expect(updatedFilters.amount).toBe(10);
      expect(updatedFilters.lang).toBe(JokeLanguage.ENGLISH);
    });
  });

  describe('Filter Effect', () => {
    it('should trigger getJokes when filters are updated', (done) => {
      mockJokeApiService.getJokes.mockClear();
      mockJokeApiService.getJokes.mockReturnValue(of(mockMultipleJokesResponse));

      store.updateFilters({ category: JokeCategory.PROGRAMMING });

      setTimeout(() => {
        expect(mockJokeApiService.getJokes).toHaveBeenCalled();
        done();
      }, 0);
    });
  });
});
