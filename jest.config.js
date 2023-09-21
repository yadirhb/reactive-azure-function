/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["./.jest/setEnvVars.js"],
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@test/(.*)$": "<rootDir>/src/test/$1",
  },
  modulePathIgnorePatterns: ['<rootDir>/dist']
};