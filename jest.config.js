module.exports = {
  preset: 'jest-puppeteer',
  testTimeout: 60000,
  testEnvironment: 'jest-environment-puppeteer',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globals: {
    URL: 'https://grant-assistant-demo.netlify.app',
    LOCAL_URL: 'http://localhost:3000'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/']
};