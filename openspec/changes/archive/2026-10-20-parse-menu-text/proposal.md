# Proposal

## Why

`recognize()` now returns the page text straight from Tesseract (psm 3, 300 dpi) and nothing consumes it: `app.ts` only logs it. The menu text has a regular shape (one ingredient per line, long ones wrapped, each ending in a quantity such as `44 g`), so a small, readable parser can turn it into ingredient names and quantities. The earlier `cleanLines` header filter is gone from the code, which leaves its tests failing and its spec stale.

## What Changes

- Add a parser for the text `recognize()` returns, in three plain steps a reader can follow:
  1. Drop blank lines and join a line that starts with a lowercase letter or a digit onto the previous one (wrapped ingredients, wrapped unit).
  2. Keep only lines that contain a quantity (`<number> g` or `<number> ml`); headers, day names, the date range and recipe names have none and disappear.
  3. For each kept line return the ingredient name (the words before the household measure such as `2 piezas`) and the quantity: `Tortilla 2 piezas 44 g` gives `Tortilla`, `44`, `g`.
- Log the parsed entries from `app.ts` where the raw text is logged today.
- Replace the stale `tests/recognizer.test.ts` (it imports the removed `cleanLines`) with parser tests that use real text samples.
- Retire the `ocr-text-cleanup` capability, whose code no longer exists.

Out of scope: summing quantities into a shopping list, changing the `POST /upload` response, fixing OCR misreads (e.g. `159` for `15 g`, `mi` for `ml`), merged columns on some pages, upload storage and the `screenshots/` folder.

## Capabilities

### New Capabilities
- `menu-text-parsing`: turning the OCR text of a menu page into ingredient entries (name, amount, unit).

### Modified Capabilities
- `ocr-text-cleanup`: all requirements removed; the capability is retired.

## Impact

- New `src/menuParser.ts`; small edit in `src/app.ts`; tests replaced in `tests/`.
- No new dependencies, no API shape change.

## Rollback

Revert the commit; nothing persistent is touched.
