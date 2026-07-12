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

// SSR에서는 window가 없으므로 undefined(=아직 hydrate 전)를 반환합니다.
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
 * useSyncExternalStore를 사용해 "effect 안에서 setState 호출" 린트 이슈 없이
 * 외부 저장소(localStorage)를 안전하게 구독합니다.
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
        const prev = prevRaw !== null ? (JSON.parse(prevRaw) as T) : initialValue;
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
