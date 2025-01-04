import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest', // Use ts-jest preset for TypeScript
    testEnvironment: 'node', // Set the test environment
    transform: {
        '^.+\\.ts$': 'ts-jest', // Use ts-jest to transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'js'], // Recognize these file extensions
    testMatch: ['**/__test__/**/*.test.ts'], // Match test files
    transformIgnorePatterns: ['<rootDir>/node_modules/'], // Ignore node_modules
    clearMocks: true, // Clear mocks between tests
};

export default config;