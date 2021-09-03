import { hashTrigger } from '../HashTrigger';

let windowSpy: jest.SpyInstance<Window | undefined, []>;

beforeEach(() => (windowSpy = jest.spyOn(window, 'window', 'get')));
afterEach(() => (windowSpy.mockRestore()));

describe('HashTrigger module', () => {

  it('HashTrigger.hashTrigger (undefined window)', () => {
    windowSpy.mockImplementation(() => undefined);

    const result = hashTrigger({
      onChanged: () => {},
    });

    expect(result()).toBeFalsy();
  });

  it('HashTrigger.hashTrigger (without action)', () => {
    const result = hashTrigger({
      onChanged: () => {},
    });

    expect(result()).toBeTruthy();
  });

  it('HashTrigger.hashTrigger (without match test)', () => {
    window.location.href = '/test?a=1#popup_test1';

    hashTrigger({
      once: (matched) => {
        expect(matched[0]).toBe('popup_test1');
      },
      onChanged: () => {},
    });
  });

  it('HashTrigger.hashTrigger (with match test, no result)', () => {
    window.location.href = '/test?a=1#abc_test1';

    hashTrigger({
      test: /popup_(\w+)/,
      once: (matched) => {
        expect(matched[0]).toBe('');
      },
      onChanged: () => {},
    });
  });

  it('HashTrigger.hashTrigger (with match test)', () => {
    window.location.href = '/test?a=1#popup_test1';

    hashTrigger({
      test: /popup_(\w+)/,
      once: (matched) => {
        expect(matched[0]).toBe('test1');
      },
      onChanged: () => {},
    });
  });

  it('HashTrigger.hashTrigger (with multi match test#1)', () => {
    window.location.href = '/test?a=1#popup_test1#popup_test2';

    hashTrigger({
      test: /popup_(\w+)/,
      once: (matched) => {
        expect(matched[0]).toBe('test1'); // 중복 해시값 중 첫 번 째의 matched 값
      },
      onChanged: () => {},
    });
  });

  it('HashTrigger.hashTrigger (with multi match test#2)', () => {
    window.location.href = '/test?a=1#popup_test1+popup_test2';

    hashTrigger({
      test: /popup_(\w+)/,
      once: (matched) => {
        expect(matched[0]).toBe('test1'); // 중복 해시값 중 첫 번 째의 matched 값
      },
      onChanged: () => {},
    });
  });

  it('HashTrigger.hashTrigger (with hash url changed)', () => {
    window.location.href = '/test?a=1#popup_test1';

    hashTrigger({
      test: /popup_(\w+)/,
      once: (matched) => {
        expect(matched[0]).toBe('test1');
      },
      onChanged: (matched) => {
        expect(matched[0]).toBe('test2');
      },
    });

    window.location.href = '/test?a=1#popup_test2';
  });

  it('HashTrigger.hashTrigger (with onLoad event)', () => {
    window.location.href = '/test?a=1#abc1';

    hashTrigger({
      onLoaded: (matched) => {
        expect(matched[0]).toBe('abc1');
      },
      onChanged: (matched) => {
        expect(matched[0]).toBe('abc2');
      },
    });

    window.dispatchEvent(new Event('load'));
    window.location.href = '/test?a=1#abc2';
  });

});
