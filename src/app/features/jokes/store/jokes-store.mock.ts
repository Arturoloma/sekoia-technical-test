/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Provider, signal } from '@angular/core';
import { JokesState } from './jokes.store.model';
import { initialState, jokesStore } from './jokes.store';

export function provideMockJokesStore(initialStateOverride?: Partial<JokesState>): Provider {
  const mockState = { ...initialState, ...initialStateOverride };

  const mockStore = {
    jokes: signal(mockState.jokes),
    isLoading: signal(mockState.isLoading),
    error: signal(mockState.error),
    filters: signal(mockState.filters),
    pagination: signal(mockState.pagination),

    getJokes: () => {},
    updateFilters: () => {},
  };

  return {
    provide: jokesStore,
    useValue: mockStore,
  };
}
