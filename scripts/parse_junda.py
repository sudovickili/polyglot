"""Parser step 1: read the Junda HTML file, extract <pre> block, and split on <br/> tags.

Run: python scripts/parse_junda.py
This will print the number of lines and a small sample.
"""

from __future__ import annotations

import re
from pathlib import Path
import json
import argparse

HTML_RELATIVE_PATH = Path(
    "data/junda chinese character frequency/Chinese character frequency list 汉字字频表.html"
)

PRE_TAG_PATTERN = re.compile(r"<pre[^>]*>(.*?)</pre>", re.IGNORECASE | re.DOTALL)
BR_SPLIT_PATTERN = re.compile(r"<br\s*/?>", re.IGNORECASE)
LINE_PATTERN = re.compile(r"^\s*(\d+)\s+(\S)\s+(\d+)\s+([\d.]+)\s+(\S+)\s+(.*)$")


def read_html(path: Path) -> str:
    """Read the raw HTML file trying GBK first then falling back to GB18030/UTF-8.

    Returns raw text; raises FileNotFoundError if missing.
    """
    if not path.exists():
        raise FileNotFoundError(f"HTML file not found: {path}")

    encodings = ["gbk", "gb18030", "utf-8"]
    last_error: Exception | None = None
    for enc in encodings:
        try:
            return path.read_text(encoding=enc)
        except Exception as e:  # noqa: BLE001 - broad but intentional fallback chain
            last_error = e
            continue
    assert last_error is not None
    raise last_error


def extract_pre_block(html: str) -> str:
    """Extract inner HTML of the first <pre>...</pre> block.

    Returns empty string if none found (we'll treat as no lines).
    """
    match = PRE_TAG_PATTERN.search(html)
    if not match:
        return ""
    return match.group(1)


def split_lines(pre_inner_html: str) -> list[str]:
    """Split the <pre> inner HTML on <br/> (or <br>) boundaries and normalize whitespace.

    Internal newlines are replaced with spaces to keep definitions intact.
    """
    if not pre_inner_html:
        return []
    # Replace raw newlines inside the block with spaces so wrapped definitions join.
    normalized = pre_inner_html.replace("\r", " ").replace("\n", " ")
    parts = BR_SPLIT_PATTERN.split(normalized)
    cleaned: list[str] = []
    for p in parts:
        txt = p.strip()
        if not txt:
            continue
        cleaned.append(re.sub(r"\s+", " ", txt))  # collapse excess whitespace
    return cleaned


def parse_line(line: str):
    """Parse a single frequency line into its components or return None if malformed."""
    m = LINE_PATTERN.match(line)
    if not m:
        return None
    rank_str, char, freq_str, _cum_pct, pinyin, definition = m.groups()
    try:
        return {
            "n": int(rank_str),
            "char": char,
            # "frequency": int(freq_str),
            "pin": pinyin,
            "def": definition.strip(),
        }
    except ValueError:
        return None


def build_entries(lines: list[str], top_n: int) -> list[dict]:
    entries: list[dict] = []
    for ln in lines:
        parsed = parse_line(ln)
        if not parsed:
            continue
        entries.append(parsed)
        if len(entries) >= top_n:
            break
    return entries


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract top-N Chinese character frequencies from Junda list"
    )
    parser.add_argument(
        "--top",
        type=int,
        default=100,
        help="Number of most frequent characters to output",
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parents[1]
    html_path = project_root / HTML_RELATIVE_PATH
    raw_html = read_html(html_path)
    pre_block = extract_pre_block(raw_html)
    lines = split_lines(pre_block)
    print(f"Total raw lines parsed: {len(lines)}")

    entries = build_entries(lines, args.top)
    print(f"Built {len(entries)} structured entries (top {args.top}).")
    for sample in entries[:5]:
        print(sample)

    # Write JSON output in same folder as HTML file
    out_path = html_path.parent / "frequency_list.json"
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)
    print(f"Wrote JSON to {out_path.relative_to(project_root)}")


if __name__ == "__main__":  # pragma: no cover
    main()
