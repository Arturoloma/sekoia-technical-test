import { Routes } from '@angular/router';
import { jokesStore } from './features/jokes/store/jokes.store';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'jokes',
    pathMatch: 'full',
  },
  {
    path: 'jokes',
    loadComponent: () =>
      import('./features/jokes/pages/jokes/jokes.component').then(
        (module) => module.JokesComponent,
      ),
    providers: [jokesStore],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./features/jokes/pages/joke-list/joke-list.component').then(
            (module) => module.JokeListComponent,
          ),
        title: 'Browse Jokes',
      },
      {
        path: 'submit',
        loadComponent: () =>
          import('./features/jokes/pages/joke-submit/joke-submit.component').then(
            (module) => module.JokeSubmitComponent,
          ),
        title: 'Submit a Joke',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'jokes',
  },
];
