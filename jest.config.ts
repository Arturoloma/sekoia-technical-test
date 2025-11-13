import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'lcov'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  globals: {
    Uint8Array: Uint8Array,
    ArrayBuffer: ArrayBuffer,
  },
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.mock\\.ts$',
    '\\.mocks\\.ts$',
    '/mocks/',
    '\\.spec\\.ts$',
    '\\.config\\.ts$',
  ],
  moduleNameMapper: {
    '^@models$': '<rootDir>/src/app/models',
    '^@models/(.*)$': '<rootDir>/src/app/models/$1',
    '^@mocks$': '<rootDir>/src/app/shared/mocks',
    '^@mocks/(.*)$': '<rootDir>/src/app/shared/mocks/$1',
    '^@interceptors$': '<rootDir>/src/app/core/interceptors',
    '^@interceptors/(.*)$': '<rootDir>/src/app/core/interceptors/$1',
    '^@core$': '<rootDir>/src/app/core',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@components$': '<rootDir>/src/app/shared/components',
    '^@components/(.*)$': '<rootDir>/src/app/shared/components/$1',
    '^@utils$': '<rootDir>/src/app/shared/utils',
    '^@utils/(.*)$': '<rootDir>/src/app/shared/utils/$1',
  },
};

export default config;
