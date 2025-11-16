import { GetJokesParameters, Joke, JokeErrorResponse } from '@models';

export interface JokesState {
  jokes: Joke[];
  isJokeListLoading: boolean;
  isJokeSubmitLoading: boolean;
  getJokesError: JokeErrorResponse | null;
  submitJokeError: JokeErrorResponse | null;
  submitJokeSuccess: boolean | null;
  filters: GetJokesParameters;
}
