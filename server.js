const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Konfiguracja multer do uploadu
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint do uploadu obrazu
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generuj unikalne ID
    const imageId = crypto.randomBytes(16).toString('hex');
    
    // W prawdziwej aplikacji zapisz obraz w bazie danych lub na dysku
    // Tutaj zapisujemy w pamięci dla uproszczenia
    if (!global.images) {
        global.images = {};
    }
    
    global.images[imageId] = req.file.buffer.toString('base64');
    
    // Zwróć ID i URL
    res.json({
        id: imageId,
        url: `/image/${imageId}`
    });
});

// Endpoint do pobierania obrazu po ID
app.get('/image/:id', (req, res) => {
    const imageId = req.params.id;
    
    if (!global.images || !global.images[imageId]) {
        return res.status(404).json({ error: 'Image not found' });
    }
    
    const base64Data = global.images[imageId];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    res.set('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
