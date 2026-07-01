import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Increase JSON body limits for large updates
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads saving to public/assets
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/assets');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage });

// API to get content
app.get('/api/content', (req, res) => {
    try {
        const contentPath = path.join(__dirname, 'src/data/owmarkContent.json');
        const data = fs.readFileSync(contentPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading content:', error);
        res.status(500).json({ error: 'Failed to read content file' });
    }
});

// API to save content
app.post('/api/content', (req, res) => {
    try {
        const contentPath = path.join(__dirname, 'src/data/owmarkContent.json');
        const data = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(contentPath, data, 'utf8');
        res.json({ success: true, message: 'Content saved successfully' });
    } catch (error) {
        console.error('Error writing content:', error);
        res.status(500).json({ error: 'Failed to write content file' });
    }
});

// API to upload image
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Return public asset path
        const publicPath = `/assets/${req.file.filename}`;
        res.json({ success: true, url: publicPath });
    } catch (error) {
        console.error('Error handling upload:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

app.listen(PORT, () => {
    console.log(`[OWLMARK CMS Backend] Server running on port ${PORT}`);
});
