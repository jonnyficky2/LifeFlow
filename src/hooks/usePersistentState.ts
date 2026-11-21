import { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getDbData, setDbData, UPDATED_AT_SUFFIX } from '../services/db';
import {
  pullCloudValue,
  pushCloudValue,
  subscribeCloudValue,
  pullLegacyHabits,
  getPreviousUidFor,
  writeLastUid,
} from '../services/cloudSync';
import type { CloudRecord } from '../services/cloudSync';

const PUSH_DEBOUNCE_MS = 800;
const SETTINGS_KEY = 'settings';
const HABITS_KEY = 'habits';

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);
  const valueRef = useRef(state);
  valueRef.current = state;
  const updatedAtRef = useRef(0);
  const pushTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let hydrated = false;
    let syncedUid: string | null = null;
    let unsubCloud: (() => void) | null = null;

    const applyRemote = (record: CloudRecord<unknown>) => {
      if (cancelled) return;
      const incoming = record.value as T;
      // geminiApiKey sengaja tidak ikut ke cloud; pertahankan nilai lokal tanpa menyalin setting lain.
      const localApiKey = (valueRef.current as { geminiApiKey?: string } | null)?.geminiApiKey;
      const next = key === SETTINGS_KEY && incoming && typeof incoming === 'object' && localApiKey
        ? ({ ...(incoming as object), geminiApiKey: localApiKey } as T)
        : incoming;

      updatedAtRef.current = record.updatedAt;
      valueRef.current = next;
      setState(next);
      setDbData(key, next).catch(e => console.error('Failed to save', key, e));
      setDbData(key + UPDATED_AT_SUFFIX, record.updatedAt).catch(() => {});
    };

    const syncFor = async (user: User) => {
      if (cancelled || !hydrated) return;
      const previousUid = getPreviousUidFor(user.uid);
      unsubCloud?.();
      unsubCloud = null;
      syncedUid = user.uid;

      let remote: CloudRecord<T> | null;
      let migratedLegacy = false;
      try {
        remote = await pullCloudValue<T>(user.uid, key);
        if (!remote && key === HABITS_KEY) {
          const legacy = await pullLegacyHabits(user.uid);
          if (legacy.length > 0) {
            remote = { value: legacy as T, updatedAt: Date.now() };
            migratedLegacy = true;
          }
        }
      } catch (error) {
        // Jaringan gagal: jangan putuskan apa pun, biar percobaan berikutnya yang menentukan.
        console.error(`Gagal membaca ${key} dari cloud:`, error);
        syncedUid = null;
        return;
      }
      if (cancelled || syncedUid !== user.uid) return;

      const isDifferentAccount = !!previousUid && previousUid !== user.uid;

      if (remote && (isDifferentAccount || remote.updatedAt > updatedAtRef.current)) {
        applyRemote(remote);
        if (migratedLegacy) {
          // Pindahkan habit lama ke dokumen state/habits agar device lain dan penghapusan ikut sinkron.
          await pushCloudValue(user.uid, key, remote.value, remote.updatedAt);
        }
      } else if (!remote && isDifferentAccount) {
        // Device ini sebelumnya dipakai akun lain dan akun baru belum punya data cloud:
        // mulai dari default agar data akun lama tidak ikut terbawa.
        updatedAtRef.current = 0;
        valueRef.current = defaultValue;
        setState(defaultValue);
        setDbData(key, defaultValue).catch(() => {});
      } else if (!remote) {
        const now = Date.now();
        updatedAtRef.current = now;
        await pushCloudValue(user.uid, key, valueRef.current, now);
      } else {
        // Data lokal lebih baru (hasil edit offline): unggah, jangan ditimpa cloud lama.
        await pushCloudValue(user.uid, key, valueRef.current, updatedAtRef.current || Date.now());
      }

      writeLastUid(user.uid);
      unsubCloud = subscribeCloudValue(user.uid, key, (record) => {
        if (record.updatedAt > updatedAtRef.current) applyRemote(record);
      });
    };

    const load = async () => {
      const lsData = localStorage.getItem(key);
      let initialData = defaultValue;

      if (lsData) {
        try {
          initialData = JSON.parse(lsData) as T;
        } catch {
          // ignore corrupted JSON in localStorage
        }
      }

      const dbData = await getDbData<T | null>(key, null);
      if (dbData !== null) {
        initialData = dbData;
      } else if (lsData) {
        await setDbData(key, initialData);
      }

      const storedAt = await getDbData<number>(key + UPDATED_AT_SUFFIX, 0);
      if (cancelled) return;

      updatedAtRef.current = storedAt;
      valueRef.current = initialData;
      setState(initialData);
      hydrated = true;

      if (auth.currentUser) void syncFor(auth.currentUser);
    };

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        unsubCloud?.();
        unsubCloud = null;
        syncedUid = null;
        return;
      }
      if (syncedUid !== user.uid) void syncFor(user);
    });

    void load();

    return () => {
      cancelled = true;
      unsubAuth();
      unsubCloud?.();
      if (pushTimer.current) window.clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setPersistentState: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    setState(prev => {
      const nextValue = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
      const now = Date.now();
      updatedAtRef.current = now;
      setDbData(key, nextValue).catch(e => console.error("Failed to save", key, e));
      setDbData(key + UPDATED_AT_SUFFIX, now).catch(() => {});

      const user = auth.currentUser;
      if (user) {
        if (pushTimer.current) window.clearTimeout(pushTimer.current);
        pushTimer.current = window.setTimeout(() => {
          void pushCloudValue(user.uid, key, nextValue, now);
        }, PUSH_DEBOUNCE_MS);
      }
      return nextValue;
    });
  }, [key]);

  return [state, setPersistentState];
}
