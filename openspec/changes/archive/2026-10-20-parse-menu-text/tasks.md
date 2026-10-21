# Tasks

## 1. Red: parser tests

- [x] 1.1 Delete the stale tests/recognizer.test.ts (imports the removed `cleanLines`) and create tests/menuParser.test.ts with failing tests for every scenario in specs/menu-text-parsing/spec.md, using text lines copied from the real OCR output; verify `pnpm test` fails because `parseMenu` does not exist

## 2. Green: implement the parser

- [x] 2.1 Create src/menuParser.ts with `joinWrappedLines` (blank lines dropped, lowercase/digit-leading lines joined); verify the "Wrapped lines are joined" tests pass
- [x] 2.2 Add `toEntry` and `parseMenu` (quantity lines only, name before the household measure, amount and unit, order kept); verify all menuParser tests pass and `pnpm tsc --noEmit` is clean

## 3. Use it and check it on real text

- [x] 3.1 In src/app.ts log `parseMenu(text)` where the raw text is logged today; verify `pnpm tsc --noEmit` passes and the response is unchanged
- [x] 3.2 Run `recognize` then `parseMenu` once over screenshots/page_1..3.png (script, not `pnpm run dev`); verify about 80 entries come out, no header, day name, date or recipe name appears, and write down the entries that are wrong or missing
