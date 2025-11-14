import { GetJokesParameters, Joke, JokeErrorResponse } from '@models';

export interface JokesState {
  jokes: Joke[];
  isLoading: boolean;
  error: JokeErrorResponse | null;
  filters: GetJokesParameters;
  pagination: JokesPagination;
}

export interface JokesPagination {
  currentAmount: number;
  hasMore: boolean;
}
