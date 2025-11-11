export enum JokeCategory {
  ANY = 'Any',
  CHRISTMAS = 'Christmas',
  DARK = 'Dark',
  MISC = 'Misc',
  PROGRAMING = 'Programming',
  PUN = 'Pun',
  SPOOKY = 'Spooky',
}

export enum JokeFlag {
  EXPLICIT = 'explicit',
  NSFW = 'nsfw',
  POLITICAL = 'political',
  RACIST = 'racist',
  RELIGIOUS = 'religious',
  SEXIST = 'sexist',
}

export type JokeFlags = Record<JokeFlag, boolean>;

export enum JokeType {
  SINGLE = 'single',
  TWO_PART = 'twopart',
}

export enum JokeLanguage {
  CZECH = 'cs',
  ENGLISH = 'en',
  FRENCH = 'fr',
  GERMAN = 'de',
  PORTUGUESE = 'pt',
  SPANISH = 'es',
}

export interface JokeBaseResponse {
  error: boolean;
  timestamp?: number;
}

export interface JokeErrorResponse extends JokeBaseResponse {
  additionalInfo: string;
  causedBy: string[];
  code: number;
  error: true; // Narrow down for discriminated union
  internalError: boolean;
  message: string;
}

export interface Joke {
  category: JokeCategory;
  delivery?: string; // Second part of twopart jokes
  flags: JokeFlags;
  id: number;
  joke?: string;
  lang: JokeLanguage;
  safe: boolean;
  setup?: string; // First part of twopart jokes
  type: JokeType;
}

// Success response type when it includes multiple jokes
export interface MultipleJokesResponse extends JokeBaseResponse {
  amount: number;
  error: false; // Narrow down for discriminated union
  jokes: Joke[];
}

// Success response type when it includes just one joke
export interface SingleJokeResponse extends JokeBaseResponse, Joke {
  error: false; // Narrow down for discriminated union
}

export type JokeApiResponse = JokeErrorResponse | MultipleJokesResponse | SingleJokeResponse;

export interface GetJokesParameters {
  amount: number;
  blacklistFlags?: JokeFlags;
  category: JokeCategory;
  contains?: string;
  idRange?: [number, number]; // [min, max]
  lang?: JokeLanguage;
  safeMode: boolean;
  type?: JokeType;
}
