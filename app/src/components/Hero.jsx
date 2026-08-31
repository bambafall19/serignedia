import { motion, useScroll, useTransform } from 'framer-motion';
import { useSound } from '../hooks/useSound.jsx';
import { CONTACT } from '../data/contact';
import { downloadVCard } from '../utils/helpers';
import profileImg from '../assets/profile.webp';
import { fadeIn, scaleIn } from '../utils/animations';
import MagneticButton from './MagneticButton';

export default function Hero({ onAction }) {
    const { hover, click } = useSound();
    const { scrollY } = useScroll();
    const orbY1 = useTransform(scrollY, [0, 600], [0, 120]);
    const orbY2 = useTransform(scrollY, [0, 600], [0, -100]);
    const orbY3 = useTransform(scrollY, [0, 600], [0, 80]);

    return (
        <section className="hero" id="hero">
            <motion.div style={{ y: orbY1 }} className="hero-orb-wrap"><div className="hero-orb one"></div></motion.div>
            <motion.div style={{ y: orbY2 }} className="hero-orb-wrap"><div className="hero-orb two"></div></motion.div>
            <motion.div style={{ y: orbY3 }} className="hero-orb-wrap"><div className="hero-orb three"></div></motion.div>

            <motion.img
                src={profileImg}
                alt="Serigne Mbacké Dia"
                className="hero-avatar"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
            />

            <motion.p className="hero-greeting" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                Salut, moi c'est
            </motion.p>

            <motion.h1 className="hero-name" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <Typewriter text="Serigne Mbacké Dia" />
            </motion.h1>

            <motion.p className="hero-role" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                Étudiant &amp; Entrepreneur · CEO de <span className="brand">ARTAVECMOI</span>
            </motion.p>

            <motion.div className="hero-actions" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.75 }}>
                <MagneticButton>
                    <button className="btn primary" onMouseEnter={hover} onClick={() => { click(); onAction(); }}>
                        <i className="fa-solid fa-arrow-down"></i> Découvrir
                    </button>
                </MagneticButton>
                <MagneticButton>
                    <button
                        className="btn ghost"
                        onMouseEnter={hover}
                        onClick={() => { click(); downloadVCard(); }}
                    >
                        <i className="fa-solid fa-address-book"></i> Enregistrer (.vcf)
                    </button>
                </MagneticButton>
                <MagneticButton>
                    <a
                        className="btn wa"
                        href={CONTACT.whatsappUrl("Bonjour Serigne Mbacké Dia ! J'ai vu ton portfolio.")}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={hover}
                        onClick={() => click()}
                    >
                        <i className="fa-brands fa-whatsapp"></i> WhatsApp
                    </a>
                </MagneticButton>
            </motion.div>

            <div className="scroll-hint">
                <span>Défiler</span>
                <div className="dot"></div>
            </div>
        </section>
    );
}

function Typewriter({ text }) {
    const { hover } = useSound();
    const chars = text.split('');

    return (
        <span className="typewriter">
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    onMouseEnter={hover}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.3, ease: 'easeOut' }}
                    className="tw-char"
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}
