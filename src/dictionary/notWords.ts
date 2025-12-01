export const NOT_WORDS = new Set(Array.from('.。,，” “：？！…）（》《；—、』『「」·－～﹏『』【】〖〗﹑﹔﹕﹖﹗﹙﹚﹛﹜︰︱︳︴︵︶︷︸︹︺︻︼︽︾︿﹀﹁﹂﹃﹄'))

export function isNotWord(word: string): boolean {
  return NOT_WORDS.has(word)
}