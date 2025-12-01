import { Log } from "@/util/Log";
import { WiktionaryDb, WiktionaryEntry } from "./chinese/WiktionaryDb";
import { Word } from "./Word";
import { CedictDb } from "./chinese/cedict";
import { JundaEntry, loadJunda } from "./chinese/junda";

export class Dictionary {
  readonly junda: Map<string, JundaEntry> = loadJunda();
  private constructor(private wiktionaryDb: WiktionaryDb, private cedictDb: CedictDb) { }

  static async create(): Promise<Dictionary> {
    const wiktionaryDb = await WiktionaryDb.loadFromUrl("/wiktionary.tsv");
    const cedictDb = await CedictDb.create();
    if (!wiktionaryDb.ok) {
      Log.error(wiktionaryDb.err);
      return new Dictionary(WiktionaryDb.empty(), cedictDb);
    } else {
      return new Dictionary(wiktionaryDb.val, cedictDb);
    }
  }

  private get(word: Word): WiktionaryEntry | JundaEntry | null {
    const wiktionary = this.wiktionaryDb.bySimplified.get(word)?.[0];
    if (wiktionary) return wiktionary;

    const junda = this.junda.get(word);
    if (junda) return junda;

    return null;
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
