import confetti from 'canvas-confetti';

export function showToast(message, containerId = 'toast-container') {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }

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

export function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(`${label} copié !`))
            .catch(() => fallbackCopyText(text, label));
    } else {
        fallbackCopyText(text, label);
    }
}

function fallbackCopyText(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(`${label} copié !`);
    } catch {
        showToast("Erreur de copie");
    }
    document.body.removeChild(textArea);
}

export function downloadVCard() {
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
    fireConfetti();
}

function trackVCardDownload() {
    const key = 'smd_vcard_downloads';
    const today = new Date().toISOString().slice(0, 10);
    try {
        const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"lastDate":""}');
        if (data.lastDate !== today) {
            data.count = 1;
            data.lastDate = today;
        } else {
            data.count += 1;
        }
        localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }
}

export function fireConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;
    const colors = ['#fbbf24', '#8b5cf6', '#06b6d4', '#25d366', '#ff6b6b', '#ffe259'];

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();

    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors,
    });
}

export function createRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    const existing = btn.querySelector('.ripple');
    if (existing) existing.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
}
