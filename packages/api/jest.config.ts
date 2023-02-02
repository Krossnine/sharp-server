import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'
import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    verbose: true,
    setupFiles: [
        "./jest.setup.ts"
    ],
    preset: "ts-jest",
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    collectCoverage: true,
    coverageProvider: 'v8',
    testEnvironment: 'node',
    roots: [
        "./src",
    ],
    testMatch: ["**/*.spec.ts"],
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
    ],
    coveragePathIgnorePatterns: [
        'src/index.ts',
        'src/lambda.ts',
    ],
    coverageReporters: ["text", "cobertura"],
    moduleFileExtensions: ['ts', 'js'],
}

export default jestConfig;

