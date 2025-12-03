import { Log } from "@/util/Log";
import { WiktionaryDb, WiktionaryEntry } from "./chinese/WiktionaryDb";
import { Word } from "./Word";
import { JundaEntry, loadJundaFromUrl } from "./chinese/junda";

export class Dictionary {
  private constructor(private wiktionaryDb: WiktionaryDb, private junda: Map<string, JundaEntry>) { }

  static async create(): Promise<Dictionary> {
    const wiktionaryDb = await WiktionaryDb.loadFromUrl("/polyglot/wiktionary.tsv");
    const jundaDb = await loadJundaFromUrl('/polyglot/junda_frequency_list.json');

    if (!wiktionaryDb.ok) {
      Log.error(wiktionaryDb.err);
      return new Dictionary(WiktionaryDb.empty(), new Map<string, JundaEntry>());
    }
    if (!jundaDb.ok) {
      Log.error(jundaDb.err);
      return new Dictionary(wiktionaryDb.val, new Map<string, JundaEntry>());
    }

    return new Dictionary(wiktionaryDb.val, jundaDb.val);
  }

  private get(word: Word): WiktionaryEntry | JundaEntry | null {
    const wiktionary = this.wiktionaryDb.bySimplified.get(word)?.[0];
    if (wiktionary) return wiktionary;

    const junda = this.junda.get(word);
    if (junda) return junda;

    return null;
  }

  all(): WiktionaryEntry[] {
    return Array.from(this.wiktionaryDb.bySimplified.values()).flat();
  }

  define(word: Word): string | null {
    return this.get(word)?.definition ?? null;
  }

  pinyin(word: Word): string | null {
    return this.get(word)?.pinyin ?? null;
    // return this.wiktionaryDb.bySimplified.get(word)?.[0].pinyin ?? null;
  }

  frequncyRanking(word: Word): number | null {
    return this.get(word)?.frequencyRanking ?? null;
  }

  alternate(word: Word): string | null {
    const entry = this.get(word);
    if (entry && entry.t === 'Wiktionary') {
      return entry.traditional || null;
    }
    return null
  }

  segment(text: string): Word[] {
    const segmenterZh = new Intl.Segmenter("zh-CN", { granularity: "word" });

    const segments = Array.from(segmenterZh.segment(text))

    const words: Word[] = [];

    for (const s of segments) {
      const maybeWord = s.segment as Word;
      const entry = dict.define(maybeWord);
      if (entry) {
        words.push(maybeWord);
      } else {
        for (const char of Array.from(maybeWord)) {
          words.push(char as Word);
        }
      }
    }

    return words;
  }
}

export const dict = await Dictionary.create();
