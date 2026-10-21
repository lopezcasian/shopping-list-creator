# Design

## Context

See proposal.md. `recognize(path)` in `src/recognizer.ts` returns Tesseract's plain text (`lang: 'spa'`, `psm: 3`, `dpi: 300`). On the sample pages (`screenshots/page_1..3.png`) that text reads column by column with blank lines between blocks; ingredients are one per line, long ones wrap, and every ingredient ends in `<number> g` or `<number> ml`:

```
Pan de masa madre 2          Atún en agua,
piezas 70 g                  drenado 2 latas 180 ml
```

Recipe names (`Sándwich de` / `Jamón`), day names, meal headers and the date range never contain a quantity. Wrapped continuations start with a lowercase letter (`piezas`, `drenado`, `g`) or a digit (`3 rebanadas`), while every new line of text starts with a capital letter.

## Goals / Non-Goals

**Goals:**
- A parser a newcomer can read in one sitting: three small named steps, no geometry, no state machine.
- Pure function over a string, tested with real text samples (no Tesseract).

**Non-Goals:**
- Aggregation into a shopping list, response format, OCR quality fixes, column-aware parsing.

## Decisions

- **`parseMenu(text: string): IngredientEntry[]` in `src/menuParser.ts`, built from three small functions:**
  1. `joinWrappedLines(text)`: split on newlines, trim, drop blanks, append a line to the previous one when it starts with a lowercase letter or a digit (`/^(\p{Ll}|\d)/u`).
  2. A line is an entry only if it matches `quantityRegex = /(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i`; the first match is the quantity.
  3. `toEntry(line)`: the name is the words before the first word that starts with a digit, a vulgar fraction or `%` (the household measure; `%` is how OCR often reads `½`); amount and unit come from the quantity. Lines whose name would be empty are skipped.
- **No recipe-name detection at all:** recipe names and headers fall out because they have no quantity. Alternatives rejected: font/`x_size` via hOCR (more machinery, and `recognize()` no longer returns hOCR), indentation/column geometry (tried earlier; the data was worse and the code harder to follow).
- **Continuation rule instead of per-line rules:** joining first means an ingredient whose name wraps before its measure (`Atún en agua,` / `drenado 2 latas 180 ml`) is still one entry, which a "line has a digit" rule would break.
- **First quantity per line only:** one entry per line keeps the code obvious; lines that merge two columns lose their second entry (see risks).
- `IngredientEntry = { name: string, amount: number, unit: 'g' | 'ml' }`; decimal commas are read as dots.

## Risks / Trade-offs

- Psm 3 sometimes merges two columns into one line (page 3 and a few lines of page 1): then names can be wrong (`Huevo revuelto con piezas`, or `Alambre de pollo 10g` where `Almendras` was meant) or an entry is lost → accepted for simplicity; the cure is better OCR layout, not more parser.
- OCR misreads of the unit (`159` for `15 g`, `mi` for `ml`) leave no quantity, so that ingredient is dropped → out of scope here.
- A genuinely new ingredient line that starts with a lowercase letter or digit would be glued to the previous one → none in the samples; ingredient names start with a capital.
- Prototype on the three sample pages (outside the repo) gave 83 entries with clean names apart from the merged-column cases above.

## Open Questions

- None blocking. Summing quantities into a list and returning it from `POST /upload` is the natural next change.
