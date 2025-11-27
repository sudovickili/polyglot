export function infoSection(title: string, info: string): string {
  return `
${title}:
---
${info}
---
`
}

// Ensures data passed to the LLM is serialized consistently
export function serializeForLlm(obj: object): string {
  return JSON.stringify(obj, null, 2)
}