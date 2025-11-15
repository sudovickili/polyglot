import { CedictDb, type CedictEntry } from "./chinese/cedict";
import { jundaMap, type JundaEntry } from "./chinese/junda";
import { Word } from "./Word";

const db = await CedictDb.create();

export namespace Hanzi {
  export async function definitionLookup(word: Word): Promise<CedictEntry | undefined> {
    return db.get(word);
  }

  export function segment(text: string): Word[] {
    const segmenterZh = new Intl.Segmenter("zh-CN", { granularity: "word" });

    const segments = segmenterZh.segment(text)
    return Array.from(segments).map(segment => segment.segment as Word);
  }

  export function getFrequency(char: string): JundaEntry | undefined {
    return jundaMap.get(char);
  }
}
