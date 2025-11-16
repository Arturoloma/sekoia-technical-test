import { Provider, signal } from '@angular/core';
import { initialState, jokesStore } from './jokes.store';
import { JokesState } from './jokes.store.model';

export function provideMockJokesStore(initialStateOverride?: Partial<JokesState>): Provider {
  const mockState = { ...initialState, ...initialStateOverride };

  const mockStore = {
    jokes: signal(mockState.jokes),
    isJokeListLoading: signal(mockState.isJokeListLoading),
    isJokeSubmitLoading: signal(mockState.isJokeSubmitLoading),
    getJokesError: signal(mockState.getJokesError),
    submitJokeError: signal(mockState.submitJokeError),
    submitJokeSuccess: signal(mockState.submitJokeSuccess),
    filters: signal(mockState.filters),

    getJokes: jest.fn(),
    submitJoke: jest.fn(),
    resetSubmitJokeState: jest.fn(),
    updateFilters: jest.fn(),
  };

  return {
    provide: jokesStore,
    useValue: mockStore,
  };
}
