import express, {type Express, type Request, type Response} from 'express';
import multer from 'multer';
import { PDFParse, type Screenshot } from 'pdf-parse';
import { recognize } from './recognizer.ts'
import { parseMenu, type IngredientEntry } from './menuParser.ts'
import { buildShoppingList } from './shoppingList.ts'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const app: Express = express();

const getScreenshots = async (file: Express.Multer.File) => {
    const parser = new PDFParse({ data: file.buffer });
    const results = await parser.getScreenshot({scale: 4});
    await parser.destroy();
    return results.pages;
}

app.post('/upload', upload.array('files', 2), async (req: Request, res: Response) => {
    if (req.files!.length !== 2) {
        return res.status(400).json({ error: 'Exactly 2 files must be uploaded' });
    }
    
    const screenshots: Screenshot[] = [];
    const screenshotPromises = (req.files as Express.Multer.File[]).map(file => getScreenshots(file));
    const screenshotResults = await Promise.all(screenshotPromises);
    for (const result of screenshotResults) {
        screenshots.push(...result);
    }
    const texts = [];
    const textsPromises = screenshots.map(screenshot => recognize(screenshot.data as Buffer))
    const textsResults = await Promise.all(textsPromises)
    for (const result of textsResults) {
        texts.push(result)
    }
    
    const entries: IngredientEntry[] = [];
    for (const text of texts) {
        const parsedEntries = parseMenu(text);
        entries.push(...parsedEntries);
    }

    res.json(buildShoppingList(entries).map(entry => ({
        ingredient: `${entry.name} ${entry.amount} ${entry.unit}`,
    })));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
