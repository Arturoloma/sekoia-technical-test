import { effect, inject } from '@angular/core';
import { JokeApiService } from '@core/services';
import {
  GetJokesParameters,
  JokeApiResponse,
  JokeCategory,
  JokeLanguage,
  SubmitJokeParameters,
} from '@models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { JokesState } from './jokes.store.model';

export const initialState: JokesState = {
  jokes: [],
  isJokeListLoading: false,
  isJokeSubmitLoading: false,
  getJokesError: null,
  submitJokeError: null,
  submitJokeSuccess: null,
  filters: {
    amount: 10,
    blacklistFlags: {
      explicit: true,
      nsfw: true,
      political: true,
      racist: true,
      religious: true,
      sexist: true,
    },
    category: JokeCategory.ANY,
    contains: undefined,
    idRange: undefined,
    lang: JokeLanguage.ENGLISH,
    safeMode: true,
    type: undefined,
  },
};

export const jokesStore = signalStore(
  withState(initialState),

  withMethods((store, jokesApiService = inject(JokeApiService)) => ({
    getJokes: rxMethod<Partial<GetJokesParameters>>(
      pipe(
        tap(() => patchState(store, { isJokeListLoading: true, getJokesError: null })),
        switchMap((params: Partial<GetJokesParameters>) => {
          const filterParams = { ...store.filters(), ...params };

          return jokesApiService.getJokes(filterParams).pipe(
            tap((response: JokeApiResponse) => {
              if (response.error) {
                patchState(store, {
                  isJokeListLoading: false,
                  getJokesError: response,
                });
                return;
              }

              // If the API returns multiple jokes, they are in "jokes".
              // Otherwise, the response itself is the joke.
              const jokes = 'jokes' in response ? response.jokes : [response];

              patchState(store, {
                jokes,
                isJokeListLoading: false,
                getJokesError: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isJokeListLoading: false,
                getJokesError: error.error,
              });
              return of(null);
            }),
          );
        }),
      ),
    ),
    submitJoke: rxMethod<Partial<SubmitJokeParameters>>(
      pipe(
        tap(() => patchState(store, { isJokeSubmitLoading: true, submitJokeError: null })),
        switchMap((params: Partial<SubmitJokeParameters>) => {
          return jokesApiService.submitJoke(params).pipe(
            tap((response: JokeApiResponse) => {
              if (response.error) {
                patchState(store, {
                  isJokeSubmitLoading: false,
                  submitJokeError: response,
                  submitJokeSuccess: false,
                });
                return;
              }
              patchState(store, {
                isJokeSubmitLoading: false,
                submitJokeError: null,
                submitJokeSuccess: true,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isJokeSubmitLoading: false,
                submitJokeError: error.error,
                submitJokeSuccess: false,
              });
              return of(null);
            }),
          );
        }),
      ),
    ),
    updateFilters: (filters: Partial<GetJokesParameters>): void => {
      patchState(store, {
        filters: {
          ...store.filters(),
          ...filters,
        },
      });
    },
  })),

  withHooks({
    onInit(store) {
      store.getJokes(store.filters());

      effect(() => {
        const filters = store.filters();
        store.getJokes(filters);
      });
    },
  }),
);
