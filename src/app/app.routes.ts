import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'joke-list',
    pathMatch: 'full',
  },
  {
    path: 'joke-list',
    loadComponent: () =>
      import('./features/jokes/pages/joke-list/joke-list.component').then(
        (m) => m.JokeListComponent,
      ),
    title: 'Jokes - Browse and Search',
  },
  {
    path: 'joke-submit',
    loadComponent: () =>
      import('./features/jokes/pages/joke-submit/joke-submit.component').then(
        (m) => m.JokeSubmitComponent,
      ),
    title: 'Submit a Joke',
  },
  {
    path: '**',
    redirectTo: 'joke-list',
  },
];
