import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { JokesState } from './jokes.store.model';
import { GetJokesParameters, JokeApiResponse, JokeCategory, JokeLanguage } from '@models';
import { effect, inject } from '@angular/core';
import { JokeApiService } from '@core/services';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

export const initialState: JokesState = {
  jokes: [],
  isLoading: false,
  error: null,
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
  pagination: {
    currentAmount: 0,
    hasMore: false,
  },
};

export const jokesStore = signalStore(
  withState(initialState),

  withMethods((store, jokesApiService = inject(JokeApiService)) => ({
    getJokes: rxMethod<Partial<GetJokesParameters>>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((params: Partial<GetJokesParameters>) => {
          const filterParams = { ...store.filters(), ...params };

          return jokesApiService.getJokes(filterParams).pipe(
            tap((response: JokeApiResponse) => {
              if (response.error) {
                patchState(store, {
                  isLoading: false,
                  error: response,
                });
                return;
              }

              // If the API returns multiple jokes, they are in "jokes".
              // Otherwise, the response itself is the joke.
              const jokes = 'jokes' in response ? response.jokes : [response];

              patchState(store, {
                jokes,
                isLoading: false,
                error: null,
                pagination: {
                  currentAmount: jokes.length,
                  hasMore: jokes.length >= filterParams.amount,
                },
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.error,
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
