// DOM elementleri
const uploadForm = document.getElementById('uploadForm');
const mediaFile = document.getElementById('mediaFile');
const filePreview = document.getElementById('filePreview');
const previewImage = document.getElementById('previewImage');
const previewVideo = document.getElementById('previewVideo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const uploadBtn = document.querySelector('.upload-btn');
const uploadStatus = document.getElementById('uploadStatus');
const gallery = document.getElementById('gallery');
const refreshGallery = document.getElementById('refreshGallery');
const qrCode = document.getElementById('qrCode');
const downloadQR = document.getElementById('downloadQR');
const successModal = document.getElementById('successModal');
const adminSection = document.getElementById('adminSection');
const showGallery = document.getElementById('showGallery');
const hideGallery = document.getElementById('hideGallery');
const adminGallery = document.getElementById('adminGallery');

// Admin login modal ve formu
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginError = document.getElementById('adminLoginError');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '35kamikazE';
const ADMIN_CODE = 'samet';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    loadQRCode();
    
    // Event listeners
    mediaFile.addEventListener('change', handleFileSelect);
    uploadForm.addEventListener('submit', handleUpload);
    downloadQR.addEventListener('click', downloadQRCode);
    
    // Admin panel event listeners
    showGallery.addEventListener('click', toggleGallery);
    hideGallery.addEventListener('click', toggleGallery);
    refreshGallery.addEventListener('click', loadGallery);
    
    // Admin erişim kontrolü
    checkAdminAccess();
});

// Admin erişim kontrolü
function checkAdminAccess() {
    // URL'de admin parametresi var mı kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    if (adminParam === ADMIN_CODE) {
        showAdminPanel();
    }
}

// Admin panelini göster
function showAdminPanel() {
    adminSection.style.display = 'block';
    loadGallery(); // Galeriyi otomatik yükle
}

// Galeriyi aç/kapat
function toggleGallery() {
    const isVisible = adminGallery.style.display !== 'none';
    
    if (isVisible) {
        adminGallery.style.display = 'none';
        showGallery.style.display = 'inline-flex';
        hideGallery.style.display = 'none';
    } else {
        adminGallery.style.display = 'block';
        showGallery.style.display = 'none';
        hideGallery.style.display = 'inline-flex';
        loadGallery(); // Galeriyi yenile
    }
}

// Dosya seçimi
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Dosya boyutu kontrolü (50MB)
    if (file.size > 50 * 1024 * 1024) {
        alert('Dosya boyutu 50MB\'dan küçük olmalıdır!');
        mediaFile.value = '';
        return;
    }
    
    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Sadece resim ve video dosyaları yüklenebilir!');
        mediaFile.value = '';
        return;
    }
    
    // Önizleme göster
    showFilePreview(file);
    
    // Upload butonunu aktif et
    uploadBtn.disabled = false;
}

// Dosya önizleme
function showFilePreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        if (file.type.startsWith('image/')) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewVideo.style.display = 'none';
        } else if (file.type.startsWith('video/')) {
            previewVideo.src = e.target.result;
            previewVideo.style.display = 'block';
            previewImage.style.display = 'none';
        }
        
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        filePreview.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
}

// Dosya boyutunu formatla
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Dosya yükleme
async function handleUpload(event) {
    event.preventDefault();
    
    const formData = new FormData();
    const file = mediaFile.files[0];
    
    if (!file) {
        alert('Lütfen bir dosya seçin!');
        return;
    }
    
    formData.append('media', file);
    
    // Upload durumunu göster
    uploadStatus.style.display = 'block';
    uploadBtn.disabled = true;
    
    try {
        const basePath = window.location.pathname.replace(/\/$/, '');
        const response = await fetch(`${basePath}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Başarı modalını göster
            showSuccessModal();
            
            // Formu temizle
            resetForm();
            
            // Admin paneli açıksa galeriyi yenile
            if (adminSection.style.display !== 'none') {
                loadGallery();
            }
        } else {
            alert('Hata: ' + result.error);
        }
    } catch (error) {
        alert('Yükleme sırasında bir hata oluştu!');
        console.error('Upload error:', error);
    } finally {
        uploadStatus.style.display = 'none';
        uploadBtn.disabled = false;
    }
}

// Formu sıfırla
function resetForm() {
    uploadForm.reset();
    filePreview.style.display = 'none';
    previewImage.style.display = 'none';
    previewVideo.style.display = 'none';
    uploadBtn.disabled = true;
}

// Başarı modalını göster
function showSuccessModal() {
    successModal.style.display = 'flex';
}

// Modalı kapat
function closeModal() {
    successModal.style.display = 'none';
}

// Galeriyi yükle
async function loadGallery() {
    try {
        gallery.innerHTML = '<div class="loading"><div class="spinner"></div><span>Anılar yükleniyor...</span></div>';
        
        const basePath = window.location.pathname.replace(/\/$/, '');
        const response = await fetch(`${basePath}/files?admin=${ADMIN_CODE}`);
        const files = await response.json();
        
        if (!Array.isArray(files)) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Galeri yüklenemedi</h3>
                    <p>Yetkisiz erişim veya sunucu hatası.</p>
                </div>
            `;
            return;
        }
        
        if (files.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>Henüz anı yüklenmemiş</h3>
                    <p>Misafirleriniz henüz fotoğraf veya video yüklemedi.</p>
                </div>
            `;
            return;
        }
        
        // Dosyaları tarihe göre sırala (en yeni önce)
        files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        
        gallery.innerHTML = files.map(file => createGalleryItem(file)).join('');
        
    } catch (error) {
        gallery.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Galeri yüklenemedi</h3>
                <p>Lütfen daha sonra tekrar deneyin.</p>
            </div>
        `;
        console.error('Gallery error:', error);
    }
}

// Galeri öğesi oluştur
function createGalleryItem(file) {
    const uploadDate = new Date(file.uploadDate).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (file.isVideo) {
        return `
            <div class="gallery-item">
                <video controls>
                    <source src="/uploads/${file.filename}" type="${file.mimetype}">
                    Tarayıcınız video oynatmayı desteklemiyor.
                </video>
                <div class="gallery-item-info">
                    <h3>${file.originalname}</h3>
                    <p>${uploadDate} • ${formatFileSize(file.size)}</p>
                    <a href="/uploads/${file.filename}" download class="download-btn" title="İndir">
                        <i class="fas fa-download"></i> İndir
                    </a>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="gallery-item">
                <img src="/uploads/${file.filename}" alt="${file.originalname}">
                <div class="gallery-item-info">
                    <h3>${file.originalname}</h3>
                    <p>${uploadDate} • ${formatFileSize(file.size)}</p>
                    <a href="/uploads/${file.filename}" download class="download-btn" title="İndir">
                        <i class="fas fa-download"></i> İndir
                    </a>
                </div>
            </div>
        `;
    }
}

// QR kod yükle
async function loadQRCode() {
    try {
        const basePath = window.location.pathname.replace(/\/$/, '');
        const response = await fetch(`${basePath}/qr`, {cache: "no-store"});
        const result = await response.json();
        
        qrCode.innerHTML = `<img src="${result.qrCode}" alt="QR Kod">`;
        downloadQR.style.display = 'inline-flex';
        
    } catch (error) {
        qrCode.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>QR kod yüklenemedi</p>
            </div>
        `;
        console.error('QR code error:', error);
    }
}

// QR kodu indir
function downloadQRCode() {
    const qrImage = qrCode.querySelector('img');
    if (!qrImage) return;
    
    const link = document.createElement('a');
    link.download = 'dugun-qr-kodu.png';
    link.href = qrImage.src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Modal dışına tıklandığında kapat
window.addEventListener('click', function(event) {
    if (event.target === successModal) {
        closeModal();
    }
});

// ESC tuşu ile modal kapat
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && successModal.style.display === 'flex') {
        closeModal();
    }
});

// Admin login form submit
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('isAdmin', 'true');
            adminLoginModal.style.display = 'none';
            adminLoginError.style.display = 'none';
            showAdminPanel();
        } else {
            adminLoginError.textContent = 'Kullanıcı adı veya şifre hatalı!';
            adminLoginError.style.display = 'block';
        }
    });
} 