import { useCallback, useRef } from 'react';

/**
 * 의존성 배열이 변경되지 않으면 콜백을 메모이제이션하는 훅
 * useCallback과 유사하지만 더 강력한 메모이제이션
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const ref = useRef<{
    deps: React.DependencyList;
    callback: T;
    memoized: T;
  } | null>(null);

  if (!ref.current || !depsAreEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      callback,
      memoized: callback,
    };
  }

  return ref.current.memoized;
}

/**
 * 의존성 배열이 동일한지 확인하는 헬퍼 함수
 */
function depsAreEqual(
  oldDeps: React.DependencyList,
  newDeps: React.DependencyList
): boolean {
  if (oldDeps.length !== newDeps.length) return false;
  
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], newDeps[i])) {
      return false;
    }
  }
  
  return true;
}

/**
 * 객체를 깊은 비교하여 메모이제이션하는 훅
 */
export function useDeepMemo<T>(value: T, deps: React.DependencyList): T {
  const ref = useRef<{
    deps: React.DependencyList;
    value: T;
  } | null>(null);

  if (!ref.current || !depsAreEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value,
    };
  }

  return ref.current.value;
} 