import {
  HttpContextToken,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const MOCK_ERROR = new HttpContextToken<boolean>(() => false);
export const SKIP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (req.context.get(SKIP_ERROR_INTERCEPTOR)) {
    return next(req);
  }

  if (req.context.get(MOCK_ERROR)) {
    return throwError(() => new Error('Mock error'));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client error: ${error.error.message}`;
      } else {
        // Backend error
        switch (error.status) {
          case 400:
            errorMessage = `Bad Request: ${error.message}`;
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in again.';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission to do this.';
            break;
          case 404:
            errorMessage = `Not Found: ${error.message}`;
            break;
          case 500:
            errorMessage = 'Internal Server Error: Please try again later.';
            break;
          default:
            errorMessage = `Server error (${error.status}): ${error.message}`;
        }
      }

      console.error('HTTP Error:', {
        message: errorMessage,
        status: error.status,
        url: req.url,
        error,
      });

      return throwError(() => new Error(errorMessage));
    }),
  );
};
