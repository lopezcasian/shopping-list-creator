import express, {type Express, type Request, type Response} from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { writeFile } from 'node:fs/promises';
import { recognize } from './recognizer.ts'
import { parseMenu } from './menuParser.ts'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const app: Express = express();

app.post('/upload', upload.array('files', 2), async (req: Request, res: Response) => {
    for (const file of req.files as Express.Multer.File[]) {
        const parser = new PDFParse({ data: file.buffer });
        
        const results = await parser.getScreenshot({scale: 4});
        await parser.destroy();

        for (const page of results.pages) {
            await writeFile(`screenshots/page_${page.pageNumber}.png`, page.data);
        }

        for (const page of results.pages) {
            const text = await recognize(`screenshots/page_${page.pageNumber}.png`)
            console.log(`Ingredients from page ${page.pageNumber}:`, parseMenu(text));
        }
        
    }
    res.send('Files uploaded successfully');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
