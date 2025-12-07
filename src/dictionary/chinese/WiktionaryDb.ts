import { Err, Ok, Result } from "@/util/result/Result"
import { NumberedPinyin, prettyPinyin, PrettyPinyin } from "./Pinyin"

export interface WiktionaryEntry {
  t: "Wiktionary"
  traditional: string
  simplified: string
  pinyin: PrettyPinyin
  definition: string
  /** The row number in the source TSV 
   * 1 = most frequent word
  */
  frequencyRanking: number
}

export class WiktionaryDb {
  /** There are often multiple entries per word */
  bySimplified: Map<string, WiktionaryEntry[]> = new Map()

  private constructor(tsv: string) {
    // Normalize possible BOM and newlines
    const text = tsv.replace(/^\uFEFF/, "")
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
    if (lines.length === 0) return

    // Parse header to find column indexes, but be tolerant of order
    const rawHeader = lines[0]
    const headerCols = rawHeader
      .split("\t")
      .map((h) => h.trim().toLowerCase())

    const colIndex = new Map<string, number>()
    headerCols.forEach((name, idx) => colIndex.set(name, idx))

    const idxOf = (name: string, fallback?: number) =>
      colIndex.has(name) ? (colIndex.get(name) as number) : fallback

    // Default to expected order if header names aren't present
    const iTrad = idxOf("traditional", 0) as number
    const iSimp = idxOf("simplified", 1) as number
    const iPin = idxOf("pinyin", 2) as number
    const iMean = idxOf("meaning", 3) as number

    let rank = 0
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const cols = line.split("\t")
      // Require at least the first three columns
      if (cols.length <= Math.max(iTrad, iSimp, iPin)) continue

      const traditional = (cols[iTrad] ?? "").trim()
      const simplified = (cols[iSimp] ?? "").trim()
      let pinyin = (cols[iPin] ?? "").trim()
      if (pinyin.endsWith("5")) {
        pinyin = pinyin.slice(0, -1)
      }
      const meaning = (cols[iMean] ?? "").trim()

      if (!simplified) continue

      rank += 1
      const entry: WiktionaryEntry = {
        t: "Wiktionary",
        traditional,
        simplified,
        pinyin: pinyin as PrettyPinyin,
        definition: expandDictionaryCode(meaning),
        frequencyRanking: rank,
      }

      const arr = this.bySimplified.get(simplified) ?? []
      arr.push(entry)
      this.bySimplified.set(simplified, arr)
    }

    // Ensure arrays are ordered by frequency ascending (1 is most frequent)
    for (const [k, arr] of this.bySimplified) {
      arr.sort((a, b) => a.frequencyRanking - b.frequencyRanking)
      this.bySimplified.set(k, arr)
    }
  }

  static async loadFromUrl(url: string): Promise<Result<WiktionaryDb>> {
    try {
      const resp = await fetch(url)
      const tsv = await resp.text()
      const db = new WiktionaryDb(tsv)
      return Ok(db)
    } catch (e) {
      return Err("Failed to load Wiktionary DB: " + String(e))
    }
  }

  static empty(): WiktionaryDb {
    return new WiktionaryDb("")
  }
}

export function expandDictionaryCode(def: string): string {
  const codeMap: Record<string, string> = {
    "conj.": "(conjunction: connects clauses or sentences)",
    "m.": "(classifier used with nouns)",
    "det.": "(determiner: specifies which person/thing)",
  };

  // Pattern A: "conj.: and yet"
  const colonMatch = def.match(/^(\w+\.)\s*:\s*(.*)$/);
  if (colonMatch) {
    const [, code, definitionText] = colonMatch;
    const expanded = codeMap[code];
    if (expanded) {
      // Special case for m.
      if (code === "m.") {
        return `${definitionText} measure word ${expanded}`;
      }
      return `${definitionText} ${expanded}`;
    }
    return def;
  }

  // Pattern B: "m.[general]"
  const bracketMatch = def.match(/^(\w+\.)\[(.+)\]$/);
  if (bracketMatch) {
    const [, code, definitionText] = bracketMatch;
    const expanded = codeMap[code];
    if (expanded) {
      if (code === "m.") {
        return `${definitionText} measure word ${expanded}`;
      }
      return `${definitionText} ${expanded}`;
    }
    return def;
  }

  return def;
}