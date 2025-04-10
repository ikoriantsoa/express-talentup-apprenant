import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',

  testMatch: ['**/tests/**/*.spec.ts'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },


  collectCoverage: true,

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],

  coverageDirectory: '<rootDir>/coverage',

  coverageReporters: ['text', 'html'],

  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;