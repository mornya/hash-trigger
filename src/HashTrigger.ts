/*
 * HashTrigger
 * https://github.com/mornya/hash-trigger
 *
 * Copyright 2021. mornya. All rights reserved.
 * Released under the MIT license.
 */
export type Matched = string[];
export type HashUrlOption = {
  test?: RegExp; // hash URL 내에서 필요한 값만 추출받을때 사용
  once?(matched: Matched): void; // hashTrigger 메소드 실행 즉시 콜백
  onLoaded?(matched: Matched): void; // window.onload 시 콜백
  onChanged(matched: Matched, event: HashChangeEvent): void; // hash URL 변경시마다 콜백
};
export type DestroyHashTriggerHandler = () => boolean;

/**
 * hashTrigger
 *
 * @param option {HashUrlOption}
 * @returns {DestroyHashTriggerHandler}
 */
export function hashTrigger(option: HashUrlOption): DestroyHashTriggerHandler {
  // bypass SSR
  if (typeof window !== 'undefined') {
    const getMatch = (): Matched => {
      const hashes = window.location.hash.split('#');
      return option.test
        ? hashes.reduce<Matched>((acc, hash) => hash.match(option.test as RegExp)?.slice(1) ?? acc, [])
        : hashes;
    };

    // 핸들러에는 matched 값이 아닌 새로운 값을 보내야 함
    const loadHandler = () => option.onLoaded?.(getMatch());
    const changeHandler = (e: Event) => option.onChanged(getMatch(), e as HashChangeEvent);

    window.addEventListener('load', loadHandler, { once: true });
    window.addEventListener('hashchange', changeHandler, false);

    const matched = getMatch();

    if (matched.length) {
      option.once?.(matched);
    }

    return () => {
      window.removeEventListener('hashchange', changeHandler);
      return true;
    };
  }

  return () => false;
}
