import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetJokesParameters,
  JokeApiResponse,
  JokeCategory,
  JokeLanguage,
  JokeType,
  SubmitJokeParameters,
} from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JokeApiService {
  private readonly API_URL = 'https://v2.jokeapi.dev';

  private readonly _httpClient = inject(HttpClient);

  public getJokes(params: Partial<GetJokesParameters> = {}): Observable<JokeApiResponse> {
    const category = params.category ?? JokeCategory.ANY;
    const amount = params.amount ?? 10;
    const url = `${this.API_URL}/joke/${category}`;

    let httpParams = new HttpParams().set('amount', amount.toString());

    if (params.blacklistFlags) {
      const flags = Object.entries(params.blacklistFlags)
        .filter(([, value]) => value === true)
        .map(([key]) => key);

      if (flags.length > 0) {
        httpParams = httpParams.set('blacklistFlags', flags.join(','));
      }
    }

    if (params.contains) {
      httpParams = httpParams.set('contains', params.contains);
    }

    if (params.idRange) {
      httpParams = httpParams.set('idRange', `${params.idRange[0]}-${params.idRange[1]}`);
    }

    if (params.lang) {
      httpParams = httpParams.set('lang', params.lang);
    }

    if (params.safeMode) {
      httpParams = httpParams.set('safe-mode', '');
    }

    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }

    return this._httpClient.get<JokeApiResponse>(url, {
      params: httpParams,
    });
  }

  public submitJoke(params: Partial<SubmitJokeParameters> = {}): Observable<JokeApiResponse> {
    const url = `${this.API_URL}/submit`;
    const body: SubmitJokeParameters = {
      formatVersion: 3,
      category: params.category ?? JokeCategory.ANY,
      delivery: params.delivery,
      flags: params.flags ?? {
        explicit: false,
        nsfw: false,
        political: false,
        racist: false,
        religious: false,
        sexist: false,
      },
      joke: params.joke,
      lang: params.lang ?? JokeLanguage.ENGLISH,
      safe: false,
      setup: params.setup,
      type: params.type ?? (params.joke ? JokeType.SINGLE : JokeType.TWO_PART),
    };

    return this._httpClient.post<JokeApiResponse>(url, body, {
      params: new HttpParams().set('dry-run', ''),
    });
  }
}
