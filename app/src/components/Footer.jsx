import { CONTACT } from '../data/contact';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="socials">
                <a href={CONTACT.whatsappUrl()} target="_blank" rel="noreferrer" title="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
                <a href={`mailto:${CONTACT.email}`} title="Email"><i className="fa-solid fa-envelope"></i></a>
                <a href={`tel:${CONTACT.phone}`} title="Téléphone"><i className="fa-solid fa-phone"></i></a>
            </div>
            <p>© 2026 Serigne Mbacké Dia · CEO ARTAVECMOI</p>
            <a
                className="signature"
                href={`https://wa.me/${CONTACT.creatorPhoneIntl.replace('+', '')}?text=${encodeURIComponent("Salut Mouhamadou Bamba !")}`}
                target="_blank"
                rel="noreferrer"
                title="Contacter Mouhamadou Bamba sur WhatsApp"
            >
                — {CONTACT.creator}
            </a>
            <p style={{ marginTop: 6 }}>Thiès Khombole, Keur Macodou · Sénégal</p>
        </footer>
    );
}
