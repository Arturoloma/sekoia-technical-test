import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetJokesParameters, JokeApiResponse, JokeCategory } from '@models';

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

    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }

    return this._httpClient.get<JokeApiResponse>(url, { params: httpParams });
  }
}
