# Joke Application - Technical Test

Application for browsing and submitting jokes using the [JokeAPI v2](https://v2.jokeapi.dev).
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Features

- Browse and search jokes
- Submit new jokes
- Accessibility
- Unit tests with Jest
- State management with @ngrx/signals
- ESLint + Prettier + Husky
- Server-Side Rendering (SSR)

## Prerequisites

- Node.js ^20.19.0 || ^22.12.0 || ^24.0.0

## Installation

1. Clone the repository
2. Install dependencies: `npm install`

## Development

Start the development server:
- SSR: `npm start`
- CSR: `npm run dev`

The application will be available at http://localhost:4200

## Build

`npm run build`

## Testing

- Run unit tests: `npm test`
- Run tests with coverage: `npm run test:coverage`
- Run tests in watch mode: `npm run test:watch`
- Clear test cache: `npm run test:clear`

## Linting & Formatting

- Lint TypeScript files: `npm run lint`
- Lint and fix: `npm run lint:fix`
- Lint styles: `npm run lint:scss`
- Lint and fix styles: `npm run lint:scss:fix`
- Format files: `npm run format`
- Check formatting: `npm run format:check`

## Project Structure

```
src/
├── app/
│   ├── core/           # Services, interceptors, guards
│   ├── features/       # Feature modules (jokes, submit)
│   ├── shared/         # Shared components, directives
│   └── models/         # TypeScript interfaces
├── styles/             # Global styles and design tokens
└── locale/             # i18n translation files
```

## Key Technologies

- Angular 20 - Latest version with signals
- @ngrx/signals - State management
- RxJS - Reactive programming
- Jest - Unit testing
- SCSS - Styling with design tokens
- Husky - Git hooks for quality gates

## API

Uses [JokeAPI v2](https://v2.jokeapi.dev) for fetching and submitting jokes.

## Design

Follows the [Figma design](https://www.figma.com/design/1UX3I3uFU4oP29AOkSQ0MB/Untitled?node-id=0-1&m=dev&t=MVvsUOyUxMdQdjl7-1) specifications with pixel-perfect implementation.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)