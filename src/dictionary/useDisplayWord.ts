import { useAppState } from "@/state/hooks"
import { dict } from "./Dictionary"
import { Word } from "./Word"

/**
 * Hook that returns a function to convert words to their display form
 * (traditional Chinese if enabled, otherwise simplified)
 */
export function useDisplayWord() {
  const languageAlternate = useAppState((state) => state.language.alternate)

  return (word: Word | string): string => {
    if (!languageAlternate) return word

    const alternate = dict.alternate(word as Word)
    return alternate || word
  }
}

/**
 * Converts a word to its display form based on language settings
 * Use this for non-component contexts where hooks can't be used
 */
export function toDisplayWord(word: Word | string, useTraditional?: boolean): string {
  if (!useTraditional) return word

  const alternate = dict.alternate(word as Word)
  return alternate || word
}

/**
 * Converts text (potentially multi-character) to traditional Chinese
 * by converting each character individually
 */
export function toDisplayText(text: string, useTraditional?: boolean): string {
  if (!useTraditional) return text

  return text.split("").map(char => {
    const alternate = dict.alternate(char as Word)
    return alternate || char
  }).join("")
}
