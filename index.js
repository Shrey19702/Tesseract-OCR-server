const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
