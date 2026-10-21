import express, {type Express} from 'express';
import multer from 'multer';
import uploads from './uploads.ts'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const app: Express = express();

app.post('/upload', upload.array('files', 2), uploads.post);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
