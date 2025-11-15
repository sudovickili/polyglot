/** The ideal ratios of words to mix into a story */
interface PreferredWordMixture {
  knownWords: number;
  strugglingWords: number;
  unknownWords: number;
}

export const defaultPreferredMixture: PreferredWordMixture = {
  knownWords: 70,
  strugglingWords: 20,
  unknownWords: 10,
};
