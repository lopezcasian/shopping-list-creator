# Proposal

## Why

The ingredients that `parseMenu` extracts are only as good as the text Tesseract returns. On the three sample menu pages the current setup (page rendered at scale 2, `lang: 'spa'`, `dpi: 300`, psm 3) gives 80 of the 97 real ingredients, with 3 wrong or invented entries. Misses are mostly OCR errors: units read as digits (`159` for `15 g`), numbers glued together, and columns merged into one line, which also produces wrong names.

## What Changes

Measured in an experiment outside the repo (ground truth: the 97 ingredients read off the sample pages, scored through the real `parseMenu`):

| Setting | Correct | Wrong/extra |
|---|---|---|
| current: scale 2, dpi 300, spa | 80/97 (82%) | 3 |
| image 2x larger (render scale 4) | 85/97 (88%) | 2 |
| 2x larger + dpi 150 | 90/97 (93%) | 0 |
| 2x larger + dpi 150 + spa+eng | **96/97 (99%)** | **0** |

- Render the PDF pages at scale 4 instead of 2 (`src/app.ts`).
- Call Tesseract with `dpi: 150` and `lang: 'spa+eng'` (`src/recognizer.ts`); keep `psm: 3`, `oem: 1`.
- Keep the 97-ingredient ground truth in this change as the reference for checking the result.

Out of scope: changing the parser, image preprocessing (grayscale and black-and-white thresholding gave no consistent gain), other page-segmentation modes (psm 4 and 6 collapsed to about 22% because the parser expects psm 3's column order), aggregating a shopping list, and re-validating with the original PDFs, which are no longer in the repo.

## Capabilities

### New Capabilities
- `menu-page-recognition`: how well the recognised page text must cover the ingredients of a menu page.

### Modified Capabilities

## Impact

- `src/recognizer.ts`: two option values change.
- `src/app.ts`: one number changes; recognition takes about 40% longer (about 20 s against 14 s for the three sample pages) and page images are 4x larger in pixels.
- `eng.traineddata` must be installed next to `spa.traineddata` wherever the app runs.
- No API or dependency changes.

## Rollback

Revert the commit (three values).
