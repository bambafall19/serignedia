import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound.jsx';
import { fadeInUp } from '../utils/animations';
import artLogo from '../assets/artavecmoi_logo.webp';
import { CONTACT } from '../data/contact';

export default function ArtAvecMoi() {
    const { hover, click } = useSound();

    return (
        <section className="section" id="artavecmoi" style={{ background: 'var(--bg-soft)' }}>
            <div className="container">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <span className="section-tag">Ma startup</span>
                    <h2 className="section-title">
                        <span className="hl">ARTAVECMOI</span>
                    </h2>
                    <p className="section-text">
                        Une startup qui transforme vos photos en dessins sur papier et en <strong>cover art</strong>.
                        De l'esquisse au visuel final, l'art devient une signature originale et personnelle.
                    </p>
                </motion.div>

                <motion.div
                    className="brand-card"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div style={{ overflow: 'hidden' }}>
                        <img src={artLogo} alt="ARTAVECMOI - Cover Art & Dessin sur papier" loading="lazy" />
                    </div>
                    <div className="brand-body">
                        <span className="pill"><i className="fa-solid fa-gem"></i> Startup de Cover Art</span>
                        <h3>ARTAVECMOI</h3>
                        <p>Photos &rarr; Dessins sur papier · Cover art · Créativité</p>
                        <div style={{ marginTop: 20 }}>
                            <a
                                className="btn wa"
                                href={CONTACT.whatsappUrl("Bonjour CEO Serigne Mbacké Dia, je souhaite transformer ma photo en dessin / cover art.")}
                                target="_blank"
                                rel="noreferrer"
                                onMouseEnter={hover}
                                onClick={click}
                            >
                                <i className="fa-brands fa-whatsapp"></i> Commander un dessin
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
