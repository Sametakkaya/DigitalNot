# 💒 Düğün QR Kod Sistemi

Düğün misafirlerinizin fotoğraf ve videolarını kolayca paylaşabilecekleri modern bir QR kod sistemi. **Güvenlik odaklı tasarım** - misafirler sadece yükleme yapabilir, yüklenen içerikleri sadece siz görebilirsiniz.

## ✨ Özellikler

- 📱 **QR Kod Oluşturma**: Otomatik QR kod oluşturma ve indirme
- 📸 **Fotoğraf & Video Yükleme**: Desteklenen formatlar: JPG, PNG, GIF, MP4, MOV, AVI
- 🔒 **Güvenli Sistem**: Misafirler sadece yükleme yapar, galeri sadece size görünür
- 🎨 **Modern Arayüz**: Responsive tasarım, mobil uyumlu
- 📊 **Admin Paneli**: Yüklenen tüm medya dosyalarını görüntüleme
- 🔄 **Gerçek Zamanlı Güncelleme**: Yeni yüklemeler anında görünür
- 📱 **Mobil Dostu**: Tüm cihazlarda mükemmel çalışır

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Sunucuyu başlatın:**
```bash
npm start
```

3. **Geliştirme modunda çalıştırın:**
```bash
npm run dev
```

4. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## 📱 Kullanım

### Misafirler İçin:
1. QR kodu telefonunuzla okutun
2. "Dosya Seç" butonuna tıklayın
3. Fotoğraf veya video seçin
4. "Yükle" butonuna tıklayın
5. Başarı mesajını görün

### Siz İçin (Admin):
1. QR kodu indirin ve yazdırın
2. Düğün mekanına asın
3. **Admin paneline erişin**: `http://localhost:3000?admin=1234`
4. Misafirlerin yüklediği anıları gerçek zamanlı takip edin

## 🔐 Güvenlik Sistemi

### Admin Erişimi:
- **Varsayılan şifre**: `1234`
- **Admin linki**: `http://localhost:3000?admin=1234`
- **Şifreyi değiştirmek için**: `public/script.js` ve `server.js` dosyalarında `ADMIN_CODE` değerini değiştirin

### Güvenlik Özellikleri:
- ✅ Misafirler galeri göremez
- ✅ Sadece siz yüklenen dosyaları görebilirsiniz
- ✅ Dosya yükleme güvenli
- ✅ Admin erişimi şifre korumalı

## 🛠️ Teknik Detaylar

### Dosya Limitleri:
- **Maksimum dosya boyutu**: 50MB
- **Desteklenen formatlar**: 
  - Resimler: JPG, JPEG, PNG, GIF, WebP
  - Videolar: MP4, MOV, AVI, WebM

### Klasör Yapısı:
```
dugun-qr-sistemi/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── uploads/
│   └── files.json
├── server.js
├── package.json
└── README.md
```

### API Endpoints:
- `GET /` - Ana sayfa (misafir arayüzü)
- `GET /qr` - QR kod oluşturma
- `POST /upload` - Dosya yükleme
- `GET /files?admin=1234` - Yüklenen dosyaları listeleme (sadece admin)

## 🎨 Özelleştirme

### Admin Şifresini Değiştirme:
1. `public/script.js` dosyasında `ADMIN_CODE` değerini değiştirin
2. `server.js` dosyasında `ADMIN_CODE` değerini değiştirin
3. Sunucuyu yeniden başlatın

### Renk Teması Değiştirme:
`public/style.css` dosyasında CSS değişkenlerini düzenleyebilirsiniz:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
}
```

### Başlık ve Metin Değiştirme:
`public/index.html` dosyasında başlık ve açıklamaları düzenleyebilirsiniz.

## 🔧 Geliştirme

### Yeni Özellik Ekleme:
1. `server.js` dosyasında yeni endpoint'ler ekleyin
2. `public/script.js` dosyasında frontend fonksiyonlarını güncelleyin
3. `public/style.css` dosyasında gerekli stilleri ekleyin

### Veritabanı Entegrasyonu:
Şu anda dosya tabanlı JSON kullanılıyor. MongoDB, PostgreSQL gibi veritabanlarına geçiş yapabilirsiniz.

## 📦 Production Deployment

### Heroku:
```bash
heroku create your-app-name
git push heroku main
```

### Vercel:
```bash
vercel
```

### Docker:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🚨 Güvenlik Notları

### Production'da Dikkat Edilecekler:
1. **Admin şifresini değiştirin** - Varsayılan `1234` şifresini mutlaka değiştirin
2. **HTTPS kullanın** - Güvenli bağlantı için SSL sertifikası ekleyin
3. **Rate limiting** - Dosya yükleme hızını sınırlayın
4. **Dosya türü kontrolü** - Sadece güvenli dosya türlerine izin verin

### Önerilen Admin Şifresi:
- En az 8 karakter
- Büyük/küçük harf, rakam ve özel karakter içermeli
- Örnek: `Dugun2024!`

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues bölümünde sorun bildirin
2. Detaylı hata mesajları ile birlikte açıklama yapın

## 🎉 Teşekkürler

Düğününüzde kullanacağınız bu güvenli sistem için teşekkürler! Umarız harika anılar biriktirirsiniz! 💕

---

**Not**: Bu sistem yerel ağda çalışır. İnternet üzerinden erişim için bir hosting servisi kullanmanız gerekir. 