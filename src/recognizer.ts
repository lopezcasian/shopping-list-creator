import { recognize as ocr_recognize } from 'node-tesseract-ocr';
import { readFile } from 'node:fs/promises';

export async function recognize(path: string): Promise<string> {
    const text = await ocr_recognize(await readFile(path), {
        lang: 'spa',
        oem: 1,
        psm: 3,
        dpi: 300,
    });
    return text;
}
