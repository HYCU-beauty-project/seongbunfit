"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function getSnapshot(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

// SSR에선 window 없어서 undefined(=아직 hydrate 전) 반환
function getServerSnapshot(): string | null | undefined {
  return undefined;
}

function subscribe(key: string) {
  return (callback: Listener) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(callback);

    // 다른 탭에서 값이 바뀐 경우도 반영
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.get(key)?.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  };
}

/**
 * localStorage와 동기화되는 상태 훅.
 * useSyncExternalStore 써서 "effect 안에서 setState 호출" 린트 이슈 없이
 * 외부 저장소(localStorage) 구독함
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribeToKey = useMemo(() => subscribe(key), [key]);
  const raw = useSyncExternalStore(
    subscribeToKey,
    () => getSnapshot(key),
    getServerSnapshot
  );

  const hydrated = raw !== undefined;

  const value = useMemo<T>(() => {
    if (!hydrated || raw === null) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [raw, hydrated, initialValue]);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      try {
        const prevRaw = getSnapshot(key);
        // 저장된 값이 깨진 JSON이어도 쓰기가 막히면 안 되니까
        // 파싱 실패는 initialValue 기준으로 덮어씀
        let prev = initialValue;
        if (prevRaw !== null) {
          try {
            prev = JSON.parse(prevRaw) as T;
          } catch {
            prev = initialValue;
          }
        }
        const next =
          typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        window.localStorage.setItem(key, JSON.stringify(next));
        emit(key);
      } catch {
        // storage 사용 불가(프라이빗 모드 등) -> 조용히 무시
      }
    },
    [key, initialValue]
  );

  return [value, setValue, hydrated] as const;
}
