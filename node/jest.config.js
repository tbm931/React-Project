export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
      'ts-jest': {
        useESM: true, // במידה ומשתמשים במודולים מסוג ES
      },
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  };