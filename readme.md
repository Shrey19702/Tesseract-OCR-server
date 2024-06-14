# Tesseract OCR Server

This is a Node.js server that uses Tesseract OCR Version 5 to extract text and bounding boxes from images.

## Setup

### Prerequisites
- Node.js (>= 14.x)

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/tesseract-ocr-server.git
    cd tesseract-ocr-server
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Run the server:
    ```sh
    node server.js
    ```

### Testing
check unit test using the Jest and supertest:
    ```sh
    npm test
    ```

The server will start on port 3000.

## API Endpoints

### 1. `/api/get-text`
- **Method**: POST
- **Description**: Extract the entire text from the image
- **Request Body**:
    ```json
    {
        "base64_image": "<valid base64 encoded image>"
    }
    ```
- **Responses**:
    - **Success**:
        ```json
        {
            "success": true,
            "result": {
                "text": "Extracted text from the image."
            }
        }
        ```
    - **Invalid base64 image**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid base64_image."
            }
        }
        ```

### 2. `/api/get-bboxes`
- **Method**: POST
- **Description**: Extract the bounding boxes from the image for a particular type
- **Request Body**:
    ```json
    {
        "base64_image": "<valid base64 encoded image>",
        "bbox_type": "word" | "line" | "paragraph" | "block" | "page"
    }
    ```
- **Responses**:
    - **Success**:
        ```json
        {
            "success": true,
            "result": {
                "bboxes": [
                    {
                        "x_min": 0,
                        "y_min": 0,
                        "x_max": 320,
                        "y_max": 320
                    }
                ]
            }
        }
        ```
    - **Invalid base64 image**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid base64_image."
            }
        }
        ```
    - **Invalid bounding box type**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid bbox_type."
            }
        }
        ```

## Example Requests and Responses

### `/api/get-text`
1. **Valid base64 image**
    - **Request**:
        ```json
        {
            "base64_image": "A valid base64 encoded image."
        }
        ```
    - **Response**:
        ```json
        {
            "success": true,
            "result": {
                "text": "ser had opened a shop that\nellar. Every night, mice came\ninto the shop. They ate apples\nand did not spare the\nher. No goods that were in the\nall intrusive rodents between\nng as there was noise in the\nre driving by, the mice still\nBut as soon as the old clock\nmidnight and it became quiet\nin droves, enjoyed the sweet\nasts, whose remains filled the\nrorning when he entered the\nhimself against the mice. At\n\u2018the shop.\n\n"
            }
        }
        ```

2. **Invalid base64 image**
    - **Request**:
        ```json
        {
            "base64_image": "An invalid base64 encoded image."
        }
        ```
    - **Response**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid base64_image."
            }
        }
        ```

3. **Non-image file encoded in base64**
    - **Request**:
        ```json
        {
            "base64_image": "A non-image file encoded in base64."
        }
        ```
    - **Response**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid base64_image."
            }
        }
        ```

### `/api/get-bboxes`
1. **Valid base64 image and valid bbox_type**
    - **Request**:
        ```json
        {
            "base64_image": "A valid base64 encoded image.",
            "bbox_type": "word"
        }
        ```
    - **Response**:
        ```json
        {
            "success": true,
            "result": {
                "bboxes": [
                    {
                        "x_min": 0,
                        "y_min": 0,
                        "x_max": 320,
                        "y_max": 320
                    }
                ]
            }
        }
        ```

2. **Invalid base64 image**
    - **Request**:
        ```json
        {
            "base64_image": "An invalid base64 encoded image.",
            "bbox_type": "word"
        }
        ```
    - **Response**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid base64_image."
            }
        }
        ```

3. **Non-image file encoded in base64**
    - **Request**:
        ```json
        {
            "base64_image": "A non-image file encoded in base64.",
            "bbox_type": "word"
        }
        ```
    - **Response**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid base64_image."
            }
        }
        ```

4. **Valid base64 image but invalid bbox_type**
    - **Request**:
        ```json
        {
            "base64_image": "A valid base64 encoded image.",
            "bbox_type": "foo"
        }
        ```
    - **Response**:
        ```json
        {
            "success": false,
            "error": {
                "message": "Invalid bbox_type."
            }
        }
        ```

## Error Handling
The server responds with appropriate error messages for invalid base64 images or invalid bounding box types.
