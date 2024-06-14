const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

//limit request size(image size) by 10mb
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



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
