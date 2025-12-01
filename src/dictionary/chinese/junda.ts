import { fetchResult } from '@/util/result/fetchResults';
import { Char } from '../Word';
import { prettyPinyin } from './prettyPinyin';
import { rmap } from '@/util/result/Result';

interface JundaEntryIn {
  n: number;
  char: Char;
  pin: string;
  def: string;
}

export interface JundaEntry {
  frequencyRanking: number;
  simplified: Char;
  pinyin: string;
  definition: string;
}

function parseJunda(jsonText: string): Map<string, JundaEntry> {
  const data = JSON.parse(jsonText);
  const list = data as JundaEntryIn[];
  return new Map<string, JundaEntry>(
    list.map((entry) => [entry.char, {
      frequencyRanking: entry.n,
      simplified: entry.char,
      pinyin: prettyPinyin(entry.pin),
      definition: entry.def,
    }])
  );
}

export async function loadJundaFromUrl(url: string) {
  const jundaJson = await fetchResult(url);
  return rmap(jundaJson, parseJunda);
}