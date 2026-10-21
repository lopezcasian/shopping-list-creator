# Design

## Context

Today `app.ts` (memory storage, `getScreenshot({scale: 4})`) renders each page, writes `screenshots/page_N.png`, calls `recognize` and logs `parseMenu(text)` per page. `parseMenu` already returns `IngredientEntry[]` (`{ name, amount, unit: 'g' | 'ml' }`) in text order (main spec `menu-text-parsing`). Nothing combines the entries. An earlier trial on the three real pages (entries from the parser, summed by normalised name and unit) gave 46 distinct items, 42 with exactly the right total; the 4 off were OCR losses or misspelled names, which this change does not address.

## Goals / Non-Goals

**Goals:**
- One small pure function that turns all entries into the shopping list; the endpoint returns it.

**Non-Goals:**
- OCR or parser changes, synonyms, unit conversion, persistence, and validation of the upload.

## Decisions

- **`buildShoppingList(entries: IngredientEntry[]): IngredientEntry[]` in `src/shoppingList.ts`.** It reuses the entry type: a list item has the same shape as an entry, so no new type. Alternative: put it in `menuParser.ts`; rejected, parsing text and combining pages are different jobs.
- **Key = normalised name + unit.** Normalise with `normalize('NFD')`, strip combining marks, lowercase, collapse whitespace, trim. The display name is the first spelling seen (whitespace collapsed). Alternative: fuzzy matching of OCR misspellings (`Champión`/`Champiñón`); rejected, it can merge different ingredients and is a separate problem.
- **Order and rounding:** accumulate in a `Map`, then sort by normalised name (then unit) with a plain string comparison, and round each sum once at the end with `Math.round(x * 10) / 10` so floating point noise (`47.199999`) never reaches the response. Sorting compares the name and the unit separately; joining them into one key would put `Pollo asado` before `Pollo`.
- **Endpoint:** in `app.ts` keep the existing per-page loop but push `...parseMenu(text)` into one `entries` array that spans pages and files, drop the per-page `console.log`, and end with `res.json(buildShoppingList(entries))`. The route keeps processing files and pages sequentially. No unit test for the route (it only wires external pieces); the logic lives in the tested function.
- **No OCR in verification:** tests use entry fixtures copied from real parser output (e.g. the `Arroz`, `Brócoli cocido` and `Nuez` repeats), so nothing runs Tesseract.

## Risks / Trade-offs

- OCR errors flow straight into the totals (a lost entry lowers a sum, a misspelled name creates a second item) → visible in the list, fixed at the OCR/parser level, not here.
- `POST /upload` response format changes (**BREAKING**) → only this project calls it.
- Pages of two uploaded files are summed together by assumption; if separate lists per file are ever wanted it is a small change in the route.
- `screenshots/page_N.png` is shared by all requests, so two simultaneous uploads can overwrite each other's pages → existing issue, out of scope.

## Open Questions

- None blocking.
