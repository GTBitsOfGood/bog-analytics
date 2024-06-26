// jest.config.js
export default {
    // other Jest config options...
    extensionsToTreatAsEsm: ['.ts'], // or ['.js', '.ts'] if using TypeScript
    testEnvironment: 'node',
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
      "^.+\\.(js)$": "babel-jest",
    },
    preset: 'ts-jest',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },  
  };
  