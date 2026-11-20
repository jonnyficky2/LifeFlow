import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface CloudRecord<T> {
  value: T;
  updatedAt: number;
}

const LAST_UID_KEY = 'lifeflow:lastUid';

// Akun pemilik data lokal sebelum login saat ini. Dibaca sekali per uid supaya 8 hook state
// tidak saling menimpa penanda akun ketika sinkronisasi pertama berjalan bersamaan.
let switchBase: { uid: string; previousUid: string | null } | null = null;

export const getPreviousUidFor = (uid: string): string | null => {
  if (!switchBase || switchBase.uid !== uid) {
    switchBase = { uid, previousUid: localStorage.getItem(LAST_UID_KEY) };
  }
  return switchBase.previousUid;
};

export const writeLastUid = (uid: string) => localStorage.setItem(LAST_UID_KEY, uid);

// Kredensial tidak pernah dikirim ke cloud.
const stripSecrets = (key: string, value: unknown) => {
  if (key !== 'settings' || !value || typeof value !== 'object') return value;
  const { geminiApiKey: _drop, ...rest } = value as Record<string, unknown>;
  return rest;
};

const stateDoc = (uid: string, key: string) => doc(db, 'users', uid, 'state', key);

export async function pullCloudValue<T>(uid: string, key: string): Promise<CloudRecord<T> | null> {
  const snap = await getDoc(stateDoc(uid, key));
  return snap.exists() ? (snap.data() as CloudRecord<T>) : null;
}

export async function pushCloudValue(uid: string, key: string, value: unknown, updatedAt: number): Promise<void> {
  try {
    await setDoc(stateDoc(uid, key), { value: stripSecrets(key, value), updatedAt });
  } catch (error) {
    console.error(`Gagal menyimpan ${key} ke cloud:`, error);
  }
}

export function subscribeCloudValue(
  uid: string,
  key: string,
  onChange: (record: CloudRecord<unknown>) => void
) {
  return onSnapshot(
    stateDoc(uid, key),
    (snap) => {
      if (snap.exists()) onChange(snap.data() as CloudRecord<unknown>);
    },
    (error) => console.error(`Gagal mendengarkan ${key} dari cloud:`, error)
  );
}

// Habit versi lama tersimpan di users/{uid}/habits, sebelum user data disatukan ke state/*.
export async function pullLegacyHabits(uid: string): Promise<unknown[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'habits'));
  return snap.docs.map(d => ({ ...(d.data() as object), id: d.id }));
}
