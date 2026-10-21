# Design

## Context

`recognize()` (src/recognizer.ts) runs Tesseract with `lang: 'spa'`, `oem: 1`, `psm: 3`, `dpi: 300`; `app.ts` renders PDF pages with `getScreenshot({scale: 2})` (about 1224 px wide). `parseMenu` (main spec `menu-text-parsing`) depends on psm 3 returning text column by column.

Measurement method (scratch scripts outside the repo): the three sample pages in `screenshots/` (scale 2), ground truth of 97 ingredients read off the images (`ground-truth.json` in this change), each setting run through Tesseract and the real `parseMenu`, an entry counted correct when amount and unit match exactly and the name is within 3 edits after removing case and accents. Larger images were made by smooth 2x/3x upscaling of the existing PNGs (the original PDFs are gone), which approximates, but is not, rendering the PDF larger.

## Goals / Non-Goals

**Goals:**
- Recover more of the real ingredients and invent fewer, by changing only recognition inputs and options.

**Non-Goals:**
- Parser changes, image preprocessing, a recognition accuracy test inside Jest (it would test Tesseract, an external dependency).

## Decisions

Results (correct of 97 / wrong or extra), same pages and truth throughout:

- Image size, psm 3: x1 (current) 80/3, x1.5 85/2, x2 85/2, x2.5 74/3, x3 82/0.
- `dpi` at x2: 100 → 90/0, 150 → 90/0, 200 → 85/3, 300 → 85/2. Lower dpi is consistently better; 150 is the middle of the good 100-150 range.
- Language at x2: spa 85/2 (dpi 300), spa+eng 91/2 (dpi 300); with dpi 150: spa 90/0, spa+eng **96/0**.
- Not helpful: grayscale (83-84), black-and-white threshold (79-91, inconsistent), psm 4 and 6 (about 22%, columns merge so the parser fails), psm 1 (same as 3), `preserve_interword_spaces` (no change), Tesseract user-patterns/user-words (no effect on the LSTM engine).

Choices:
- **Render at scale 4** (`getScreenshot({scale: 4})`): the glyph height on the page then falls in the range Tesseract reads best; x2 and x1.5 were equally good, x2.5-x3 worse, so 2x is the simple round choice.
- **`dpi: 150`, `lang: 'spa+eng'`**, keeping `psm: 3`, `oem: 1`. The English model helps with digits and the `g`/`ml` units; best combined result 96/97 with no wrong entries. Alternative: keep only scale + dpi (90/97) to avoid the extra language dependency; rejected because the gain (6 more ingredients) is large, but it is the fallback if `eng` cannot be installed.
- **Verification is a one-off script**, not a Jest test: it needs Tesseract. It reuses `ground-truth.json`.

## Risks / Trade-offs

- **Tuned on the same three pages:** about 30 combinations were tried against 97 ingredients, so the best figure (99%) is optimistic. The trends are consistent across neighbours (dpi 100-150 beat 200-300; 2x beats 1x; spa+eng helps at 2x but not at 1x), but expect lower on other menus.
- **Upscaled PNG is not a re-render:** rendering the PDF at scale 4 should be at least as sharp as the 2x-upscaled screenshot used here, but it has not been run on a real PDF → confirm once a PDF is available.
- **Cost:** recognition of the three pages takes about 20 s against 14 s, and the images are 4x the pixels (memory, disk in `screenshots/`).
- **Deployment:** `eng.traineddata` must be installed with `spa.traineddata` (it is present on this machine); without it Tesseract fails to start rather than degrading.
- One known miss remains: `Aguacate 113.3 g`.

## Open Questions

- Does a real PDF rendered at scale 4 score the same as the upscaled screenshots? Answer by running one real upload after the change; it cannot change the specs or tasks.
