import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { JokeApiService } from './joke-api.service';
import { JokeCategory, JokeFlag, JokeLanguage, JokeType } from '@models';
import {
  mockErrorResponse,
  mockSingleJokeResponse,
  mockSafeFlags,
  createMockMultipleResponse,
  mockSingleJoke,
  mockTwoPartJoke,
} from '@mocks';

describe('JokeApiService', () => {
  let service: JokeApiService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'https://v2.jokeapi.dev';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        JokeApiService,
      ],
    });

    service = TestBed.inject(JokeApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load', () => {
    expect(service).toBeTruthy();
  });

  describe('getJokes', () => {
    it('should make GET request with default parameters', () => {
      service.getJokes().subscribe((response) => {
        expect(response).toEqual(mockSingleJokeResponse);
      });

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Any` && request.params.get('amount') === '10';
      });

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('amount')).toBe('10');
      req.flush(mockSingleJokeResponse);
    });

    it('should use custom category and amount', () => {
      service
        .getJokes({
          category: JokeCategory.DARK,
          amount: 5,
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Dark` && request.params.get('amount') === '5';
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should add blacklistFlags parameter when provided', () => {
      service
        .getJokes({
          blacklistFlags: {
            ...mockSafeFlags,
            [JokeFlag.NSFW]: true,
            [JokeFlag.SEXIST]: true,
          },
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        const flags = request.params.get('blacklistFlags');
        return flags === 'nsfw,sexist' || flags === 'sexist,nsfw';
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should not add blacklistFlags when no flags are active', () => {
      service
        .getJokes({
          blacklistFlags: mockSafeFlags,
        })
        .subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/joke/Any?amount=10`);
      expect(req.request.params.has('blacklistFlags')).toBe(false);
      req.flush(mockSingleJokeResponse);
    });

    it('should add contains parameter when provided', () => {
      service
        .getJokes({
          contains: 'programming',
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return (
          request.url === `${apiUrl}/joke/Any` && request.params.get('contains') === 'programming'
        );
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should add idRange parameter when provided', () => {
      service
        .getJokes({
          idRange: [10, 50],
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Any` && request.params.get('idRange') === '10-50';
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should add lang parameter when provided', () => {
      service
        .getJokes({
          lang: JokeLanguage.SPANISH,
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Any` && request.params.get('lang') === 'es';
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should add safe-mode parameter when safeMode is true', () => {
      service
        .getJokes({
          safeMode: true,
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Any` && request.params.has('safe-mode');
      });

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('safe-mode')).toBe('');
      req.flush(mockSingleJokeResponse);
    });

    it('should not add safe-mode parameter when safeMode is false', () => {
      service
        .getJokes({
          safeMode: false,
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Any` && !request.params.has('safe-mode');
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should add type parameter when provided', () => {
      service
        .getJokes({
          type: JokeType.TWO_PART,
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/joke/Any` && request.params.get('type') === 'twopart';
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should handle multiple parameters together', () => {
      service
        .getJokes({
          category: JokeCategory.PROGRAMING,
          amount: 15,
          contains: 'bug',
          type: JokeType.SINGLE,
          lang: JokeLanguage.ENGLISH,
          blacklistFlags: {
            ...mockSafeFlags,
            [JokeFlag.NSFW]: true,
          },
        })
        .subscribe();

      const req = httpTestingController.expectOne((request) => {
        return (
          request.url === `${apiUrl}/joke/Programming` &&
          request.params.get('amount') === '15' &&
          request.params.get('contains') === 'bug' &&
          request.params.get('type') === 'single' &&
          request.params.get('lang') === 'en' &&
          request.params.get('blacklistFlags') === 'nsfw'
        );
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockSingleJokeResponse);
    });

    it('should return SingleJokeResponse for single joke requests', () => {
      service.getJokes({ amount: 1 }).subscribe((response) => {
        expect(response).toEqual(mockSingleJokeResponse);
        if ('joke' in response) {
          expect(response.joke).toBeDefined();
        }
      });

      const req = httpTestingController.expectOne(`${apiUrl}/joke/Any?amount=1`);
      req.flush(mockSingleJokeResponse);
    });

    it('should return MultipleJokesResponse when 2+ jokes are returned', () => {
      const customResponse = createMockMultipleResponse([mockSingleJoke, mockTwoPartJoke]);

      service.getJokes({ amount: 2 }).subscribe((response) => {
        expect(response).toEqual(customResponse);
        if ('jokes' in response) {
          expect(response.jokes.length).toBe(2);
          expect(response.amount).toBe(2);
        }
      });

      const req = httpTestingController.expectOne(`${apiUrl}/joke/Any?amount=2`);
      req.flush(customResponse);
    });

    it('should handle 404 errors', () => {
      service.getJokes().subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      const req = httpTestingController.expectOne((request) => request.url.includes('/joke/Any'));
      req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 server errors', () => {
      service.getJokes().subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpTestingController.expectOne((request) => request.url.includes('/joke/Any'));
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
