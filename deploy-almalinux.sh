#!/bin/bash

# AlmaLinux Düğün QR Sistemi Deployment Script
# Bu scripti sunucunuzda çalıştırın

echo "🚀 Düğün QR Sistemi AlmaLinux Sunucuya Yükleniyor..."

# Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
sudo dnf update -y

# Node.js kurulumu
echo "📦 Node.js kuruluyor..."
sudo dnf install -y nodejs npm

# Node.js versiyonunu kontrol et
echo "✅ Node.js versiyonu:"
node --version
npm --version

# PM2 kurulumu (process manager)
echo "📦 PM2 kuruluyor..."
sudo npm install -g pm2

# Nginx kurulumu
echo "📦 Nginx kuruluyor..."
sudo dnf install -y nginx

# Firewall ayarları
echo "🔥 Firewall ayarları yapılıyor..."
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Nginx'i başlat
echo "🌐 Nginx başlatılıyor..."
sudo systemctl enable nginx
sudo systemctl start nginx

echo "✅ Temel kurulum tamamlandı!"
echo "📁 Şimdi proje dosyalarını yükleyin ve aşağıdaki adımları takip edin." 