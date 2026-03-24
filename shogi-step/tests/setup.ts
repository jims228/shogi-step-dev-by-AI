/**
 * Jest setup file for shogi-step tests.
 *
 * This runs after the test framework is installed but before tests execute.
 * Add global mocks or test environment configuration here.
 */

// Suppress console.warn in tests unless DEBUG_TESTS is set
if (!process.env.DEBUG_TESTS) {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
}
