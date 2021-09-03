/*
 * @setup
 * The below code helped with mocking get/set of tests in Jest:
 */
let __href: string = '';
let __hashUrl: string = '';

// Sample mock of "document.doctype" for test
Object.defineProperty(window, 'location', {
  value: {
    get href (): string {
      return __href;
    },
    set href (v: string) {
      __href = v;
      __hashUrl = v.split('#')?.[1] ?? '';
    },
    get hash (): string {
      return __hashUrl;
    },
  },
  configurable: true,
});
