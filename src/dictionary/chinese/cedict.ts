import { get, getAll, openDb } from '@/util/indexedDbUtil';
import cedictData from './data/cedict_ts.u8?raw'
import { Log } from '@/util/Log';
import { Word } from '../Word';
import { AsyncCache } from '@/util/AsyncCache';

export interface CedictEntry {
  traditional: string;
  simplified: string;
  pinyin: string[];
  definitions: string[];
}

/** Parses the cedict utf8 text and returns a map from simplified to the entry */
function parseCedict(cedict: string): Map<string, CedictEntry> {
  const map = new Map<string, CedictEntry>();
  const lines = cedict.split(/\r?\n/);
  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.startsWith('#')) continue;
    // Match: traditional simplified [pinyin] /def1/def2/
    const match = line.match(/^([^ ]+) ([^ ]+) \[([^\]]+)\] \/(.+)\/$/);
    if (!match) continue;
    const [, traditional, simplified, pinyin, defs] = match;
    const definitions = defs.split('/').filter(Boolean);
    map.set(simplified, {
      traditional,
      simplified,
      pinyin: pinyin.split(' '),
      definitions,
    });
  }
  return map;
}

function createCedictDb(loadMap: () => Map<string, CedictEntry>, name = "cedict-db") {
  return openDb(name, 1, e => {
    Log.info("Loading Cedict into IndexedDB...");

    ///@ts-ignore
    const db = e.target.result as IDBDatabase;
    const objectStore = db.createObjectStore("entries", { keyPath: "simplified" });
    objectStore.createIndex("traditional", "traditional", { unique: false });
    objectStore.createIndex("pinyin", "pinyin", { unique: false });
    objectStore.transaction.oncomplete = () => {
      const entryStore = db
        .transaction("entries", "readwrite")
        .objectStore("entries");
      loadMap().forEach((entry) => {
        entryStore.add(entry);
      });
    };
  });
}

export class CedictDb {
  private cache: AsyncCache<CedictEntry, Word>;
  private constructor(private db: IDBDatabase) {
    this.cache = new AsyncCache<CedictEntry, Word>(async (word: Word) => {
      return get(this.db, "entries", word);
    });
  }

  static async create(): Promise<CedictDb> {
    const db = await createCedictDb(() => parseCedict(cedictData))
    return new CedictDb(db)
  }

  async get(word: Word): Promise<CedictEntry | undefined> {
    return this.cache.get(word);
  }

  getAll(words: Word[]): Promise<(CedictEntry | undefined)[]> {
    return getAll(this.db, "entries", words);
  }
}