# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Jun Da Chinese Character Frequency Parser

A helper script `scripts/parse_junda.py` was added to convert the Jun Da Chinese character frequency list into JSON. It produces an array of objects:

```jsonc
// Each object:
{
  "rank": 1,
  "character": "的",
  "frequency": 792438,
  "pinyin": "de/di4",
  "definition": "of; possessive particle ..."
}
```

### Usage

From the project root:

```bash
python3 scripts/parse_junda.py --input "data/junda chinese character frequency/Chinese character frequency list 汉字字频表.html" --top 200 --output junda_top200.json
```

If the local file lacks the raw rows, the script will try to fetch the remote source (`https://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=IM`). You can override with `--remote-url`.

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--input, -i` | Path to saved HTML/plain file | optional |
| `--output, -o` | Output JSON file | `junda_top.json` |
| `--top, -n` | Number of top characters | `100` |
| `--encoding, -e` | Encoding for local file | `gbk` |
| `--remote-url` | Alternate source URL | built-in |

### Dependencies

Pure stdlib by default. (Optional) Install for richer HTML parsing / remote fetch:

```bash
pip install requests beautifulsoup4
```

### Notes

The remote page sometimes renders without `<tr>` tags accessible to the simple parser. If you see `No rows parsed`, open the page in a browser, copy the visible frequency table, save it as a text file with tab separation, and rerun pointing `--input` to that cleaned file. Further enhancements could include a headless browser fetch.
