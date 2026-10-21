import express, {type Express, type Request, type Response} from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { writeFile } from 'node:fs/promises';
import { recognize } from './recognizer.ts'
import { parseMenu, type IngredientEntry } from './menuParser.ts'
import { buildShoppingList } from './shoppingList.ts'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const app: Express = express();

app.post('/upload', upload.array('files', 2), async (req: Request, res: Response) => {
    const entries: IngredientEntry[] = [];
    for (const file of req.files as Express.Multer.File[]) {
        const parser = new PDFParse({ data: file.buffer });
        
        const results = await parser.getScreenshot({scale: 4});
        await parser.destroy();

        for (const page of results.pages) {
            const text = await recognize(page.data as Buffer);
            entries.push(...parseMenu(text));
        }
    }
    res.json(buildShoppingList(entries).map(entry => ({
        ingredient: `${entry.name} ${entry.amount} ${entry.unit}`,
    })));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
