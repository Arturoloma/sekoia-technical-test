import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { httpErrorInterceptor, MOCK_ERROR, SKIP_ERROR_INTERCEPTOR } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const testUrl = '/api/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock console.error implementation to prevent cluttering test output
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpTestingController.verify();
    jest.restoreAllMocks();
  });

  describe('Successful requests', () => {
    it('should pass through successful requests', (done) => {
      const mockData = { message: 'success' };

      httpClient.get(testUrl).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          done();
        },
        error: () => fail('Should not error'),
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush(mockData);
    });
  });

  describe('Mock error handling', () => {
    it('should return a mock error when MOCK_ERROR is true', (done) => {
      httpClient
        .get(testUrl, {
          context: new HttpContext().set(MOCK_ERROR, true),
        })
        .subscribe({
          next: () => fail('Should have errored'),
          error: (error: Error) => {
            expect(error.message).toContain('Mock error');
            done();
          },
        });

      httpTestingController.expectNone(testUrl);
    });
  });

  describe('HTTP Error handling', () => {
    it('should handle 400 Bad Request errors', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              message: expect.stringContaining('Bad Request'),
              status: 400,
              url: testUrl,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 Unauthorized errors', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              message: 'Unauthorized: Please log in again.',
              status: 401,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 403 Forbidden errors', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              message: 'Forbidden: You do not have permission to do this.',
              status: 403,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 404 Not Found errors', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              status: 404,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 Internal Server Error', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              message: 'Internal Server Error: Please try again later.',
              status: 500,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle unknown HTTP errors with generic message', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(503);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              message: expect.stringContaining('Server error (503)'),
              status: 503,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('Skip interceptor context', () => {
    it('should skip error handling when SKIP_ERROR_INTERCEPTOR is true', (done) => {
      httpClient
        .get(testUrl, {
          context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
        })
        .subscribe({
          next: () => fail('Should have errored with HttpErrorResponse'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
            expect(error.statusText).toBe('Internal Server Error');
            expect(console.error).not.toHaveBeenCalled();
            done();
          },
        });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should allow successful requests when interceptor is skipped', (done) => {
      const mockData = { message: 'success' };

      httpClient
        .get(testUrl, {
          context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
        })
        .subscribe({
          next: (response) => {
            expect(response).toEqual(mockData);
            done();
          },
          error: () => fail('Should not error'),
        });

      const req = httpTestingController.expectOne(testUrl);
      req.flush(mockData);
    });
  });

  describe('Client-side errors', () => {
    it('should handle client-side/network errors', (done) => {
      const mockError = new ErrorEvent('Network error', {
        message: 'Connection refused',
      });

      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(0);
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              message: 'Client error: Connection refused',
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.error(mockError);
    });
  });

  describe('Request information logging', () => {
    it('should log the request URL in error messages', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: () => {
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              url: testUrl,
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should log the full error object for debugging', (done) => {
      httpClient.get(testUrl).subscribe({
        next: () => fail('Should have errored'),
        error: () => {
          expect(console.error).toHaveBeenCalledWith(
            'HTTP Error:',
            expect.objectContaining({
              error: expect.any(Object),
            }),
          );
          done();
        },
      });

      const req = httpTestingController.expectOne(testUrl);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });
});
