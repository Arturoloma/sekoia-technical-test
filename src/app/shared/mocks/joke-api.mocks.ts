import {
  Joke,
  JokeCategory,
  JokeFlag,
  JokeLanguage,
  JokeType,
  MultipleJokesResponse,
  SingleJokeResponse,
  JokeErrorResponse,
} from '@models';

export const mockSafeFlags = {
  [JokeFlag.EXPLICIT]: false,
  [JokeFlag.NSFW]: false,
  [JokeFlag.POLITICAL]: false,
  [JokeFlag.RACIST]: false,
  [JokeFlag.RELIGIOUS]: false,
  [JokeFlag.SEXIST]: false,
};

export const mockNsfwFlags = {
  ...mockSafeFlags,
  [JokeFlag.NSFW]: true,
};

export const mockPoliticalFlags = {
  ...mockSafeFlags,
  [JokeFlag.POLITICAL]: true,
};

export const mockSingleJoke: Joke = {
  category: JokeCategory.PROGRAMING,
  type: JokeType.SINGLE,
  joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
  flags: mockSafeFlags,
  id: 123,
  safe: true,
  lang: JokeLanguage.ENGLISH,
};

export const mockTwoPartJoke: Joke = {
  category: JokeCategory.DARK,
  type: JokeType.TWO_PART,
  setup: 'Why did the developer go broke?',
  delivery: 'Because he used up all his cache!',
  flags: mockSafeFlags,
  id: 456,
  safe: true,
  lang: JokeLanguage.ENGLISH,
};

export const mockNsfwJoke: Joke = {
  category: JokeCategory.DARK,
  type: JokeType.SINGLE,
  joke: 'An NSFW joke',
  flags: mockNsfwFlags,
  id: 789,
  safe: false,
  lang: JokeLanguage.ENGLISH,
};

export const mockSingleJokeResponse: SingleJokeResponse = {
  error: false,
  timestamp: Date.now(),
  ...mockSingleJoke,
};

export const mockMultipleJokesResponse: MultipleJokesResponse = {
  error: false,
  timestamp: Date.now(),
  amount: 2,
  jokes: [mockSingleJoke, mockTwoPartJoke],
};

export const mockErrorResponse: JokeErrorResponse = {
  error: true,
  timestamp: Date.now(),
  internalError: false,
  code: 404,
  message: 'No matching joke found',
  causedBy: ['No jokes found matching your criteria'],
  additionalInfo: 'Try adjusting your filters',
};

export function createMockJoke(overrides: Partial<Joke> = {}): Joke {
  return {
    ...mockSingleJoke,
    ...overrides,
  };
}

export function createMockSingleResponse(
  overrides: Partial<SingleJokeResponse> = {},
): SingleJokeResponse {
  return {
    ...mockSingleJokeResponse,
    ...overrides,
  };
}

export function createMockMultipleResponse(
  jokes: Joke[],
  overrides: Partial<MultipleJokesResponse> = {},
): MultipleJokesResponse {
  return {
    error: false,
    timestamp: Date.now(),
    amount: jokes.length,
    jokes,
    ...overrides,
  };
}

export function createMockErrorResponse(
  overrides: Partial<JokeErrorResponse> = {},
): JokeErrorResponse {
  return {
    ...mockErrorResponse,
    ...overrides,
  };
}
