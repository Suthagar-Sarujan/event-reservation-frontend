// Global test-environment polyfills. jsdom (used by the Vitest-based Angular
// unit-test runner) doesn't implement ResizeObserver, which PrimeNG's Tabs
// component (used by AdminGates) calls from ngAfterViewInit. Without this
// stub, any test that renders <p-tabs> throws a ReferenceError that aborts
// the whole test file.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
