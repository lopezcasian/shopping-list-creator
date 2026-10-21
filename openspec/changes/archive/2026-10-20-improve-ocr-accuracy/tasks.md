# Tasks

## 1. Recognition options

- [x] 1.1 In src/recognizer.ts set `lang: 'spa+eng'` and `dpi: 150` (keep `oem: 1`, `psm: 3`); first verify `tesseract --list-langs` lists `eng` and `spa`, then verify `pnpm tsc --noEmit` and `pnpm test` still pass

## 2. Render size

- [x] 2.1 In src/app.ts change `getScreenshot({scale: 2})` to `{scale: 4}`; verify `pnpm tsc --noEmit` and `pnpm test` still pass

## 3. Verify against the ground truth

- [x] 3.1 Write a throwaway script in the scratchpad that doubles the size of screenshots/page_1..3.png, runs `recognize` and `parseMenu` on them and compares with ground-truth.json (amount and unit equal, name within 3 edits ignoring case and accents); verify at least 92 of 97 are correct and at most 2 entries are wrong, and that `Almendras 10 g`, `Almendras 15 g`, `Brócoli cocido 184 g`, `Aguacate 103.3 g` and `Fresas enteras 108 g` are present
- [x] 3.2 Run the same script with the old settings (`spa`, `dpi: 300`, original screenshots) and verify it reproduces about 80 of 97, so the comparison is trustworthy; report both numbers and the ingredients still missed
