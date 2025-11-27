const tableFilenames: string[] = [
  "1-1000",
  "1001-2000",
  "2001-3000",
  "3001-4000",
  "4001-5000",
  "5001-6000",
  "6001-7000",
  "7001-8000",
  "8001-9000",
  "9001-10000",
]

/** These will return html pages with a table of words, ordered by use frequency.
 * 
 * These will have the following format:
 * ```
 * <tbody><tr>
<th>Traditional</th>
<th>Simplified</th>
<th>Pinyin</th>
<th>Meaning
</th></tr>
<tr>
<td><span class="Hant" lang="zh-Hant"><a href="/wiki/%E4%B8%80#Chinese" title="一">一</a></span></td>
<td><span class="Hans" lang="zh-Hans"><a href="/wiki/%E4%B8%80#Chinese" title="一">一</a></span></td>
<td><span class="Latn" lang="cmn-Latn-pinyin"><a href="/wiki/y%C4%AB#Mandarin" title="yī">yī</a></span></td>
<td>det.: one <style data-mw-deduplicate="TemplateStyles:r50165410">.mw-parser-output .k-player .k-attribution{visibility:hidden}</style><table class="audiotable" style="vertical-align: middle; display: inline-block; list-style: none; line-height: 1em; border-collapse: collapse; margin: 0;"><tbody><tr><td>yī<span class="ib-colon qualifier-colon">:</span></td><td class="audiofile"><span typeof="mw:File"><span><audio id="mwe_player_0" controls="" preload="none" data-mw-tmh="" class="mw-file-element" width="175" style="width:175px;" data-durationhint="1" data-mwtitle="Zh-yi1.ogg" data-mwprovider="wikimediacommons"><source src="//upload.wikimedia.org/wikipedia/commons/6/64/Zh-yi1.ogg" type="audio/ogg; codecs=&quot;vorbis&quot;" data-width="0" data-height="0" /><source src="//upload.wikimedia.org/wikipedia/commons/transcoded/6/64/Zh-yi1.ogg/Zh-yi1.ogg.mp3" type="audio/mpeg" data-transcodekey="mp3" data-width="0" data-height="0" /></audio></span></span></td><td class="audiometa" style="font-size: 80%;">(<a href="/wiki/File:Zh-yi1.ogg" title="File:Zh-yi1.ogg">file</a>)</td></tr></tbody></table>
</td></tr>
<tr>
<td><span class="Hant" lang="zh-Hant"><a href="/wiki/%E5%9C%A8#Chinese" title="在">在</a></span></td>
<td><span class="Hans" lang="zh-Hans"><a href="/wiki/%E5%9C%A8#Chinese" title="在">在</a></span></td>
<td><span class="Latn" lang="cmn-Latn-pinyin"><a href="/wiki/z%C3%A0i#Mandarin" title="zài">zài</a></span></td>
<td>in, at, on, etc. <link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r50165410" /><table class="audiotable" style="vertical-align: middle; display: inline-block; list-style: none; line-height: 1em; border-collapse: collapse; margin: 0;"><tbody><tr><td>zài<span class="ib-colon qualifier-colon">:</span></td><td class="audiofile"><span typeof="mw:File"><span><audio id="mwe_player_1" controls="" preload="none" data-mw-tmh="" class="mw-file-element" width="175" style="width:175px;" data-durationhint="1" data-mwtitle="Zh-zài.ogg" data-mwprovider="wikimediacommons"><source src="//upload.wikimedia.org/wikipedia/commons/9/94/Zh-z%C3%A0i.ogg" type="audio/ogg; codecs=&quot;vorbis&quot;" data-width="0" data-height="0" /><source src="//upload.wikimedia.org/wikipedia/commons/transcoded/9/94/Zh-z%C3%A0i.ogg/Zh-z%C3%A0i.ogg.mp3" type="audio/mpeg" data-transcodekey="mp3" data-width="0" data-height="0" /></audio></span></span></td><td class="audiometa" style="font-size: 80%;">(<a href="/wiki/File:Zh-z%C3%A0i.ogg" title="File:Zh-zài.ogg">file</a>)</td></tr></tbody></table>
</td></tr>
 * ```
 */
function getUrl(tableFilename: string): string {
  return `https://en.wiktionary.org/wiki/Appendix:Mandarin_Frequency_lists/${tableFilename}.html`
}

interface WiktionaryEntry {
  traditional: string
  simplified: string
  pinyin: string
  meaning: string
}

// Lightweight HTML entity decode for a few common entities we may encounter.
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function cleanMeaningCell(html: string): string {
  // Remove style/link/table/audio clutter specific to wiktionary excerpts
  let cleaned = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<table class="audiotable"[\s\S]*?<\/table>/gi, '')
    .replace(/<link[^>]*>/gi, '')
  // Strip remaining tags
  cleaned = cleaned.replace(/<[^>]+>/g, ' ')
  cleaned = decodeEntities(cleaned)
  // Collapse whitespace
  return cleaned.replace(/\s+/g, ' ').trim()
}

function extractTdInnerAnchorText(tdHtml: string): string {
  const anchorMatch = tdHtml.match(/<a[^>]*>([\s\S]*?)<\/a>/i)
  const inner = anchorMatch ? anchorMatch[1] : tdHtml
  return decodeEntities(inner.replace(/<[^>]+>/g, '').trim())
}

function parseSingleTable(html: string): WiktionaryEntry[] {
  const rows: WiktionaryEntry[] = []
  // Extract all <tr>...</tr> blocks
  const trMatches = html.match(/<tr>[\s\S]*?<\/tr>/gi) || []
  for (const tr of trMatches) {
    // Skip header rows containing <th>
    if (/<th>/i.test(tr)) continue
    const tdMatches = tr.match(/<td[\s\S]*?<\/td>/gi)
    if (!tdMatches || tdMatches.length < 4) continue
    const [tradTd, simpTd, pinyinTd, meaningTd] = tdMatches
    const traditional = extractTdInnerAnchorText(tradTd)
    const simplified = extractTdInnerAnchorText(simpTd)
    const pinyin = extractTdInnerAnchorText(pinyinTd)
    const meaning = cleanMeaningCell(meaningTd)
    if (traditional && simplified && pinyin) {
      rows.push({ traditional, simplified, pinyin, meaning })
    }
  }
  return rows
}

export async function parseWiktionaryMandarinFrequencyList(): Promise<WiktionaryEntry[]> {
  const all: WiktionaryEntry[] = []
  // Fetch in parallel for speed.
  const fetches = tableFilenames.map(async (filename) => {
    const url = getUrl(filename)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
    const html = await res.text()
    return parseSingleTable(html)
  })
  const results = await Promise.all(fetches)
  for (const arr of results) all.push(...arr)
  return all
}