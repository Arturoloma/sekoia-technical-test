import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  mockErrorResponse,
  mockMultipleJokesResponse,
  mockSafeFlags,
  mockSingleJokeResponse,
  mockSubmitParams,
} from '@mocks';
import { JokeCategory, JokeFlag, JokeLanguage, JokeType, SubmitJokeParameters } from '@models';
import { JokeApiService } from './joke-api.service';

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
          category: JokeCategory.PROGRAMMING,
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
      service.getJokes({ amount: 2 }).subscribe((response) => {
        expect(response).toEqual(mockMultipleJokesResponse);
        if ('jokes' in response) {
          expect(response.jokes.length).toBe(2);
          expect(response.amount).toBe(2);
        }
      });

      const req = httpTestingController.expectOne(`${apiUrl}/joke/Any?amount=2`);
      req.flush(mockMultipleJokesResponse);
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

  describe('submitJoke', () => {
    it('should make POST request to /submit endpoint', () => {
      service.submitJoke(mockSubmitParams).subscribe((response) => {
        expect(response).toEqual(mockSingleJokeResponse);
      });

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${apiUrl}/submit` && request.params.has('dry-run');
      });

      expect(req.request.method).toBe('POST');
      expect(req.request.params.get('dry-run')).toBe('');
      expect(req.request.body).toEqual(mockSubmitParams);
      req.flush(mockSingleJokeResponse);
    });

    it('should submit single joke with correct body', () => {
      service.submitJoke(mockSubmitParams).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/submit?dry-run=`);
      expect(req.request.body.type).toBe(JokeType.SINGLE);
      expect(req.request.body.joke).toBe('Why do programmers prefer dark mode?');
      expect(req.request.body.category).toBe(JokeCategory.PROGRAMMING);
      req.flush(mockSingleJokeResponse);
    });

    it('should submit two-part joke with setup and delivery', () => {
      const twoPartParams: SubmitJokeParameters = {
        formatVersion: 3,
        category: JokeCategory.DARK,
        type: JokeType.TWO_PART,
        setup: 'Why did the chicken cross the road?',
        delivery: 'To get to the other side!',
        flags: mockSafeFlags,
        lang: JokeLanguage.ENGLISH,
        safe: false,
      };

      service.submitJoke(twoPartParams).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/submit?dry-run=`);
      expect(req.request.body.type).toBe(JokeType.TWO_PART);
      expect(req.request.body.setup).toBe('Why did the chicken cross the road?');
      expect(req.request.body.delivery).toBe('To get to the other side!');
      req.flush(mockSingleJokeResponse);
    });

    it('should always include dry-run parameter', () => {
      service.submitJoke(mockSubmitParams).subscribe();

      const req = httpTestingController.expectOne((request) => {
        return request.url.includes('/submit') && request.params.has('dry-run');
      });

      expect(req.request.params.get('dry-run')).toBe('');
      req.flush(mockSingleJokeResponse);
    });

    it('should handle 400 validation errors', () => {
      service.submitJoke(mockSubmitParams).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        },
      });

      const req = httpTestingController.expectOne(`${apiUrl}/submit?dry-run=`);
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 500 server errors', () => {
      service.submitJoke(mockSubmitParams).subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpTestingController.expectOne(`${apiUrl}/submit?dry-run=`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
