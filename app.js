const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Utility function to check if a string is numeric
function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// Function to validate Base64 file string and get MIME type & file size
function validateFile(base64String) {
    try {
        if (!base64String) return { file_valid: false, file_mime_type: '', file_size_kb: 0 };
        
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return { file_valid: false, file_mime_type: '', file_size_kb: 0 };

        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const fileSizeKb = buffer.length / 1024;

        return { file_valid: true, file_mime_type: mimeType, file_size_kb: fileSizeKb.toFixed(2) };
    } catch (error) {
        return { file_valid: false, file_mime_type: '', file_size_kb: 0 };
    }
}

// POST request to /bfhl
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: 'Invalid data format' });
    }

    // Separate numbers and alphabets
    const numbers = data.filter(item => isNumeric(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
    const lowercaseAlphabets = alphabets.filter(item => /^[a-z]$/.test(item));

    // Determine the highest lowercase alphabet
    const highestLowercaseAlphabet = lowercaseAlphabets.length ? [lowercaseAlphabets.sort().pop()] : [];

    // Validate file
    const fileValidation = validateFile(file_b64);

    // Construct the response
    const response = {
        is_success: true,
        user_id: "Dinakar_S_29072002",   // Replace with your details
        email: "ds0062@srmist.edu.in",  // Replace with your details
        roll_number: "RA2111003010999", // Replace with your details
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValidation.file_valid,
        file_mime_type: fileValidation.file_mime_type,
        file_size_kb: fileValidation.file_size_kb
    };

    // Send the response
    res.json(response);
});

// GET request to /bfhl
app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
