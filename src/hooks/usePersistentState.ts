import { useState, useEffect, useCallback } from 'react';
import { getDbData, setDbData } from '../services/db';

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const lsData = localStorage.getItem(key);
      let initialData = defaultValue;

      if (lsData) {
         try {
           initialData = JSON.parse(lsData) as T;
         } catch(e) {}
      }

      const dbData = await getDbData<T | null>(key, null);
      if (dbData !== null) {
        initialData = dbData;
      } else if (lsData) {
        await setDbData(key, initialData);
      }
      
      if (mounted) {
        setState(initialData);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  
  const setPersistentState: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    setState(prev => {
      const nextValue = typeof value === 'function' ? (value as any)(prev) : value;
      setDbData(key, nextValue).catch(e => console.error("Failed to save", key, e));
      return nextValue;
    });
  }, [key]);

  return [state, setPersistentState];
}
