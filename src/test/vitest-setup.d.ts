import '@testing-library/jest-dom'
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, any> {}
}
