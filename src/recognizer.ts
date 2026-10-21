import { type Input, recognize as ocr_recognize } from 'node-tesseract-ocr';
import { readFile } from 'node:fs/promises';

export async function recognize(path: Input): Promise<string> {
    const text = await ocr_recognize(path, {
        lang: 'spa+eng',
        oem: 1,
        psm: 3,
        dpi: 150,
    });
    return text;
}
