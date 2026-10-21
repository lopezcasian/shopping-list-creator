# Tasks

## 1. Red: summing tests

- [x] 1.1 Create tests/shoppingList.test.ts with failing tests for every scenario in specs/shopping-list/spec.md (sum across pages, case and accent differences, first spelling kept, separate units, alphabetical order including `Pollo` before `Pollo asado`, one-decimal rounding, empty input), using entry fixtures copied from real parser output; verify `pnpm test` fails because `src/shoppingList.ts` does not exist

## 2. Green: implement the list

- [x] 2.1 Create src/shoppingList.ts with `buildShoppingList` (normalised name + unit key, first spelling kept, sorted, rounded once at the end); verify all shoppingList tests and the existing menuParser tests pass and `pnpm tsc --noEmit` is clean

## 3. Return it from the endpoint

- [x] 3.1 In src/app.ts collect `parseMenu(text)` of every page of every file into one array, remove the per-page log and respond with `res.json(buildShoppingList(entries))`; verify `pnpm tsc --noEmit` and `pnpm test` pass (do not run OCR or `pnpm run dev`)
