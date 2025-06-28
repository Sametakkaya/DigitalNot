const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin erişim kodu (sunucu tarafında da aynı olmalı)
const ADMIN_CODE = 'Dugun2024!';

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Uploads klasörünü oluştur
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: function (req, file, cb) {
        // Sadece resim ve video dosyaları
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim ve video dosyaları yüklenebilir!'), false);
        }
    }
});

// Admin erişim kontrolü middleware
function checkAdminAccess(req, res, next) {
    const adminParam = req.query.admin || req.body.admin;
    
    if (adminParam === ADMIN_CODE) {
        next();
    } else {
        res.status(403).json({ error: 'Yetkisiz erişim' });
    }
}

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// QR kod oluşturma
app.get('/qr', async (req, res) => {
    try {
        const url = `${req.protocol}://${req.get('host')}/hosgeldiniz/`;
        const qrCode = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        res.json({ qrCode });
    } catch (error) {
        res.status(500).json({ error: 'QR kod oluşturulamadı' });
    }
});

// Dosya yükleme
app.post('/upload', upload.single('media'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Dosya seçilmedi' });
        }

        const fileInfo = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadDate: new Date().toISOString(),
            isVideo: req.file.mimetype.startsWith('video/')
        };

        // Dosya bilgilerini kaydet
        const filesPath = path.join(__dirname, 'uploads', 'files.json');
        let files = [];
        
        if (fs.existsSync(filesPath)) {
            files = JSON.parse(fs.readFileSync(filesPath, 'utf8'));
        }
        
        files.push(fileInfo);
        fs.writeFileSync(filesPath, JSON.stringify(files, null, 2));

        res.json({ 
            success: true, 
            message: 'Dosya başarıyla yüklendi!',
            file: fileInfo
        });
    } catch (error) {
        res.status(500).json({ error: 'Dosya yüklenirken hata oluştu' });
    }
});

// Yüklenen dosyaları listele (sadece admin erişimi)
app.get('/files', checkAdminAccess, (req, res) => {
    try {
        const filesPath = path.join(__dirname, 'uploads', 'files.json');
        if (fs.existsSync(filesPath)) {
            const files = JSON.parse(fs.readFileSync(filesPath, 'utf8'));
            res.json(files);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Dosyalar listelenirken hata oluştu' });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 Düğün QR sistemi ${PORT} portunda çalışıyor!`);
    console.log(`📱 QR kod: http://localhost:${PORT}/qr`);
    console.log(`🌐 Web sayfası: http://localhost:${PORT}`);
    console.log(`🔐 Admin paneli: http://localhost:${PORT}?admin=${ADMIN_CODE}`);
}); 