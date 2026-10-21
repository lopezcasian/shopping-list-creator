import {type Request, type Response} from 'express';

import { PDFParse, type Screenshot } from 'pdf-parse';
import { recognize } from './recognizer.ts'
import { parseMenu } from './menuParser.ts'
import { buildShoppingList } from './shoppingList.ts'

const getFileScreenshots = async (file: Express.Multer.File) => {
    const parser = new PDFParse({ data: file.buffer });
    const results = await parser.getScreenshot({scale: 4});
    await parser.destroy();
    return results.pages;
}

async function post(req: Request, res: Response) {
    const screenshotResults = await Promise.all(
        (req.files as Express.Multer.File[]).map(file => getFileScreenshots(file)));
    
    const screenshots: Screenshot[] = [];
    for (const result of screenshotResults) {
        screenshots.push(...result);
    }

    const textsResults = await Promise.all(
        screenshots.map(screenshot => recognize(screenshot.data as Buffer))
    )

    const parsedEntries = parseMenu(textsResults.join('\n'));

    res.json(buildShoppingList(parsedEntries).map(entry => ({
        ingredient: `${entry.name} ${entry.amount} ${entry.unit}`,
    })));
}

export default { post }