const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const bodyParser = require('body-parser');

const app = express();

//limit request size(image size) by 10mb, parse json
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const upload = multer();

function isBase64(str) {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (err) {
        return false;
    }
}

// POST API to get english text from images extracted from OCR
app.post('/api/get-text', upload.none(), (req, res) => {
    const { base64_image } = req.body;
    //base64 encoding check
    if (!base64_image || !isBase64(base64_image)) {
        return res.status(400).json({ success: false, error: { message: 'Invalid base64_image.' } });
    }
    //extract text from image buffer and respond
    const imageBuffer = Buffer.from(base64_image, 'base64');
    Tesseract.recognize(imageBuffer, 'eng')
    .then(({ data: { text } }) => {
        res.json({ success: true, result: { text } });
    })
    .catch(error => {
        res.status(500).json({ success: false, error: { message: 'Error processing image' } });
    });
});

// POST API to get bboxes from images extracted from OCR 
app.post('/api/get-bboxes', upload.none(), (req, res) => {
    const { base64_image, bbox_type } = req.body;
    const validTypes = ["word", "line", "paragraph", "block", "page"];

    // check for base64 encoding
    if (!base64_image || !isBase64(base64_image)) {
        return res.status(400).json({ success: false, error: { message: 'Invalid base64_image.' } });
    }
    //check for correct bbox type
    if (!validTypes.includes(bbox_type)) {
        return res.status(400).json({ success: false, error: { message: 'Invalid bbox_type.' } });
    }

    //extract bbox from image buffer
    const imageBuffer = Buffer.from(base64_image, 'base64');
    Tesseract.recognize(imageBuffer, 'eng')
    .then(({ data }) => {
        let bboxes;
        switch (bbox_type) {
            case 'word':
                bboxes = data.words.map(word => ({
                    x_min: word.bbox.x0,
                    y_min: word.bbox.y0,
                    x_max: word.bbox.x1,
                    y_max: word.bbox.y1
                }));
                break;
            case 'line':
                bboxes = data.lines.map(line => ({
                    x_min: line.bbox.x0,
                    y_min: line.bbox.y0,
                    x_max: line.bbox.x1,
                    y_max: line.bbox.y1
                }));
                break;
            case 'paragraph':
                bboxes = data.paragraphs.map(paragraph => ({
                    x_min: paragraph.bbox.x0,
                    y_min: paragraph.bbox.y0,
                    x_max: paragraph.bbox.x1,
                    y_max: paragraph.bbox.y1
                }));
                break;
            case 'block':
                bboxes = data.blocks.map(block => ({
                    x_min: block.bbox.x0,
                    y_min: block.bbox.y0,
                    x_max: block.bbox.x1,
                    y_max: block.bbox.y1
                }));
                break;
            case 'page':
                bboxes = [{ bbox: [0, 0, 100, 100] }];
                break;
            default:
                bboxes = [];
        }
        res.json({ success: true, result: { bboxes } });
    })
    .catch(error => {
        res.status(500).json({ success: false, error: { message: 'Error processing image' } });
    });
});

exports.app = app;