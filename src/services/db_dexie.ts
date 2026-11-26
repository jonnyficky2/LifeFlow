import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Habit, Note } from '../types';

export class LifeFlowDatabase extends Dexie {
  tasks!: Table<any, string>;
  habits!: Table<Habit, string>;
  notes!: Table<Note, string>;
  settings!: Table<any, string>;

  constructor() {
    super('LifeFlowDB');
    this.version(1).stores({
      tasks: '++id, deadline, done',
      habits: 'id, category, createdAt',
      notes: 'id, createdAt, deadline',
      settings: 'id'
    });
  }
}

export const db = new LifeFlowDatabase();
