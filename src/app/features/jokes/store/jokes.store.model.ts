import { GetJokesParameters, Joke } from '@models';

export interface JokesState {
  jokes: Joke[];
  isLoading: boolean;
  error: string | null;
  filters: GetJokesParameters;
  pagination: JokesPagination;
}

export interface JokesPagination {
  currentAmount: number;
  hasMore: boolean;
}
