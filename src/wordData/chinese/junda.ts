import jundaText from './data/junda_frequency_list.json?raw'
import { Char } from '../Word';

interface JundaEntryIn {
  n: number;
  char: Char;
  pin: string;
  def: string;
}

export interface JundaEntry {
  ranking: number;
  simplified: Char;
  pinyin: string;
  definition: string;
}

function parseJunda(jsonText: string): Map<string, JundaEntry> {
  const data = JSON.parse(jsonText);
  const list = data as JundaEntryIn[];
  return new Map<string, JundaEntry>(
    list.map((entry) => [entry.char, {
      ranking: entry.n,
      simplified: entry.char,
      pinyin: entry.pin,
      definition: entry.def,
    }])
  );
}

/** A map from simplified character to frequency info */
export const jundaMap = parseJunda(jundaText);