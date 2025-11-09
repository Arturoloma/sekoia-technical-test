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
  moduleNameMapper: {
    '^@models$': '<rootDir>/src/app/models',
    '^@models/(.*)$': '<rootDir>/src/app/models/$1',
    '^@mocks$': '<rootDir>/src/app/shared/mocks',
    '^@mocks/(.*)$': '<rootDir>/src/app/shared/mocks/$1',
  },
};

export default config;
