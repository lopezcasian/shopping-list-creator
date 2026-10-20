import type { Config } from 'jest'
import { createJsWithTsEsmPreset } from 'ts-jest'

const config: Config = {
  ...createJsWithTsEsmPreset({}),
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
}

export default config