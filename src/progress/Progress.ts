import { Word } from "@/wordData/Word";



interface Progress {
  wordsSeen: number;
  storiesSeen: number;
  definitionsRequested: Record<Word, number>
}

interface WordStats {
  seen: number;
  hint: number;
  lastHintStory: number;
  definition: number;
  lastDefinitionStory: number;
}

interface StruggleInfo {
  word: Word;
}

const LevelNames = ["Beginner", "Intermediate", "Advanced"] as const;
export type LevelName = typeof LevelNames[number];

interface Level {
  name: LevelName;
  progressionInLevel: number;
}

export function knownWords(progress: Progress):

  export function calculateLevel(progress: Progress): Level {

  }