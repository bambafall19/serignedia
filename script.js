/* ==========================================================================
   Serigne Mbacké Dia - Digital Business Card & Portfolio Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initQRCode();
    initAmbientCanvas();
    initNavigation();
    initVanillaTilt();
    updateShareUrlInput();
});

/* 1. Theme Management */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('smd_theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('smd_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    // Update PWA theme-color meta tag
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#07080d' : '#f1f5f9');
}

/* 2. 3D Card Flip Mechanism */
function flipCard() {
    const card = document.getElementById('business-card');
    if (card) {
        card.classList.toggle('flipped');
    }
}

/* 3. Dynamic vCard (.vcf) Generator & Downloader */
function downloadVCard() {
    const vCardData = 
`BEGIN:VCARD
VERSION:3.0
N:Dia;Serigne Mbacké;;;
FN:Serigne Mbacké Dia
ORG:ARTAVECMOI
TITLE:Étudiant / Entrepreneur - CEO ARTAVECMOI
TEL;TYPE=CELL,VOICE;PREF:+221781838701
EMAIL;TYPE=INTERNET,PREF:diaserignembacke221@gmail.com
ADR;TYPE=WORK;PREF:;;Thiès Khombole, Keur macodou;Khombole;Thiès;;Sénégal
NOTE:CEO ARTAVECMOI - Carte de Visite Digitale Officielle
URL:https://diaserignembacke.com
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Serigne_Mbacke_Dia_ARTAVECMOI.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackVCardDownload();
    showToast('Fiche contact (.vcf) enregistrée !');
}

/* Track vCard downloads (privacy-friendly, localStorage) */
function trackVCardDownload() {
    const key = 'smd_vcard_downloads';
    const today = new Date().toISOString().slice(0, 10);
    const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"lastDate":""}');

    if (data.lastDate !== today) {
        data.count = 1;
        data.lastDate = today;
    } else {
        data.count += 1;
    }

    localStorage.setItem(key, JSON.stringify(data));
}

/* 4. QR Code Generator */
function initQRCode() {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;
    
    qrContainer.innerHTML = '';

    const currentUrl = window.location.href.split('#')[0];
    
    // Generate QR code using QRCode.js library
    if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: currentUrl,
            width: 120,
            height: 120,
            colorDark: "#07080d",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

/* 5. Copy Text & Toast Notification */
function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label} copié : ${text}`);
        }).catch(err => {
            fallbackCopyText(text, label);
        });
    } else {
        fallbackCopyText(text, label);
    }
}

/* Anti-spam check: honeypot field (hidden) */
function isSpam() {
    const honeypot = document.getElementById('website-field');
    return honeypot && honeypot.value.trim() !== '';
}

function validateQuickForm() {
    const name = document.getElementById('sender-name');
    const message = document.getElementById('sender-message');

    let valid = true;
    [name, message].forEach(field => {
        field.classList.remove('input-error');
    });

    if (!name.value.trim()) {
        name.classList.add('input-error');
        valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 5) {
        message.classList.add('input-error');
        valid = false;
    }

    return valid;
}

function fallbackCopyText(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(`${label} copié : ${text}`);
    } catch (err) {
        showToast(`Erreur de copie`);
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* 6. Quick Form Submission to WhatsApp or Mail */
function sendQuickMessage(event) {
    event.preventDefault();

    if (isSpam()) {
        showToast('Message enregistré. Merci !');
        return;
    }

    if (!validateQuickForm()) {
        showToast('Veuillez remplir tous les champs correctement');
        return;
    }

    const name = document.getElementById('sender-name').value.trim();
    const subject = document.getElementById('message-subject').value;
    const message = document.getElementById('sender-message').value.trim();

    const fullMessage = `*Nouveau Message depuis la Carte Digitale*\n\n` +
                        `👤 *Nom:* ${name}\n` +
                        `📌 *Objet:* ${subject}\n` +
                        `💬 *Message:* ${message}`;

    const encodedMsg = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/221781838701?text=${encodedMsg}`;

    window.open(whatsappUrl, '_blank');
    showToast('Redirection vers WhatsApp...');
}

function sendMailMessage() {
    if (isSpam()) {
        showToast('Message enregistré. Merci !');
        return;
    }

    if (!validateQuickForm()) {
        showToast('Veuillez remplir tous les champs correctement');
        return;
    }

    const name = document.getElementById('sender-name').value.trim();
    const subject = document.getElementById('message-subject').value;
    const message = document.getElementById('sender-message').value.trim();

    const body = `Bonjour Serigne Mbacké Dia,\n\nNom: ${name}\nObjet: ${subject}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:diaserignembacke221@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    showToast('Ouverture de votre application d\'email...');
}

/* 7. Web Share Modal Logic */
function openShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.classList.add('active');
        updateShareUrlInput();
    }
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function updateShareUrlInput() {
    const shareInput = document.getElementById('share-url');
    if (shareInput) {
        shareInput.value = window.location.href;
    }
}

function copyShareLink() {
    const url = window.location.href;
    copyText(url, 'Lien de la carte');
    closeShareModal();
}

function shareVia(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Consultez la carte de visite de Serigne Mbacké Dia - CEO ARTAVECMOI :");
    
    let shareUri = '';

    switch(platform) {
        case 'whatsapp':
            shareUri = `https://api.whatsapp.com/send?text=${text}%20${url}`;
            break;
        case 'telegram':
            shareUri = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case 'email':
            shareUri = `mailto:?subject=Carte%20de%20visite%20Serigne%20Mbacké%20Dia&body=${text}%20${url}`;
            break;
        case 'sms':
            shareUri = `sms:?body=${text}%20${url}`;
            break;
    }

    if (shareUri) {
        window.open(shareUri, '_blank');
    }
    closeShareModal();
}

/* 8. Mobile Navigation & Scroll Observer */
function initNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Intersection Observer for Nav Links
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* 9. Vanilla Tilt 3D Card Initialization */
function initVanillaTilt() {
    const card = document.getElementById('business-card');
    if (card && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(card, {
            max: 12,
            speed: 400,
            glare: true,
            "max-glare": 0.25,
        });
    }
}

/* 10. Ambient Particle Background Canvas */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile
        ? Math.min(Math.floor(width / 80), 15)
        : Math.min(Math.floor(width / 35), 45);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    let rafId;
    let isRunning = true;

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
            ctx.fill();
        });

        if (isRunning) {
            rafId = requestAnimationFrame(animate);
        }
    }

    rafId = requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isRunning = false;
            cancelAnimationFrame(rafId);
        } else {
            isRunning = true;
            rafId = requestAnimationFrame(animate);
        }
    });
}

/* 11. Logo Modal Lightbox */
function openLogoModal() {
    const modal = document.getElementById('logo-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeLogoModal() {
    const modal = document.getElementById('logo-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

