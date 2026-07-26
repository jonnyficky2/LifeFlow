import Dexie, { type EntityTable } from 'dexie';

interface KeyValue {
  key: string;
  value: unknown;
}

export const db = new Dexie('LifeFlowDB') as Dexie & {
  keyval: EntityTable<KeyValue, 'key'>;
};

db.version(1).stores({
  keyval: 'key' // Primary key adalah string 'key'
});

export const getDbData = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const record = await db.keyval.get(key);
    return record ? (record.value as T) : defaultValue;
  } catch (error) {
    console.error(`Gagal membaca ${key} dari IndexedDB:`, error);
    return defaultValue;
  }
};

export const setDbData = async (key: string, value: unknown): Promise<void> => {
  try {
    await db.keyval.put({ key, value });
  } catch (error) {
    console.error(`Gagal menyimpan ${key} ke IndexedDB:`, error);
  }
};
