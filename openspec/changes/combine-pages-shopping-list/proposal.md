# Proposal

## Why

`POST /upload` recognises each page and logs the ingredients page by page, but the goal of the project is one shopping list. A weekly menu spreads the same ingredients over many days and across 3 pages (`Arroz 100 g` appears on three days, `Brócoli cocido` on five), so the quantities must be added up across all pages into one combined list.

## What Changes

- Add a pure function that sums ingredient entries into a shopping list: entries with the same ingredient and unit are added together (names compared ignoring case, accents and extra spaces), `g` and `ml` stay separate, sums are rounded to one decimal, and items are sorted by name.
- In `POST /upload`, collect the entries of every page of every uploaded file, build one list and respond with it as JSON (`[{ "name": "Arroz", "amount": 300, "unit": "g" }, ...]`). The per-page console log is dropped.
- Add unit tests for the summing function. OCR is not exercised again; the function is tested with entry fixtures taken from real parser output.

Assumptions (recorded, not asked): "combine the 3 pages" means all pages of the menu; if two PDFs are uploaded, their pages are combined too, as the project describes similar menus to sum up. Synonyms (`Jitomate` vs `Tomate rojo`) and `g`/`ml` conversion are not attempted.

**BREAKING**: `POST /upload` responds with JSON instead of the text `Files uploaded successfully`.

Out of scope: any OCR or parser change, correcting OCR mistakes (an earlier trial on the real pages gave 46 distinct items with 42 totals exactly right; the other four were off because OCR lost an entry or misspelled a name, e.g. `Champión` for `Champiñón`), validation of missing files, the shared `screenshots/page_N.png` file names that make concurrent uploads collide, and a UI.

## Capabilities

### New Capabilities
- `shopping-list`: combining ingredient entries from all pages into one summed list and returning it from the upload endpoint.

### Modified Capabilities

## Impact

- New `src/shoppingList.ts`; `src/app.ts` collects entries and responds with JSON; new `tests/shoppingList.test.ts`.
- No new dependencies.

## Rollback

Revert the commit; nothing is persisted.
