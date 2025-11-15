export function prettyPinyin(numberedPinyin: string): string {
  // Mapping of vowels to their tone marks
  const toneMap: { [key: string]: string[] } = {
    'a': ['a', 'ā', 'á', 'ǎ', 'à'],
    'e': ['e', 'ē', 'é', 'ě', 'è'],
    'i': ['i', 'ī', 'í', 'ǐ', 'ì'],
    'o': ['o', 'ō', 'ó', 'ǒ', 'ò'],
    'u': ['u', 'ū', 'ú', 'ǔ', 'ù'],
    'ü': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
  };

  // Find the tone number (1-5)
  const match = numberedPinyin.match(/([a-zü]+)([1-5])$/i);
  if (!match) return numberedPinyin;
  let [_, syllable, toneStr] = match;
  const tone = parseInt(toneStr);
  if (tone === 5) return syllable; // Neutral tone, no mark

  // Replace 'v' with 'ü' (common in numbered pinyin)
  syllable = syllable.replace('v', 'ü');

  // Find which vowel to mark
  // Priority: a > o > e > i > u > ü
  let vowelIndex = -1;
  let vowelToMark = '';
  for (const v of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    vowelIndex = syllable.indexOf(v);
    if (vowelIndex !== -1) {
      vowelToMark = v;
      break;
    }
  }
  if (!vowelToMark) return numberedPinyin;

  // Replace the vowel with the marked vowel
  const markedVowel = toneMap[vowelToMark][tone];
  const result =
    syllable.slice(0, vowelIndex) + markedVowel + syllable.slice(vowelIndex + 1);
  return result;
}