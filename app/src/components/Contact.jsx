import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound.jsx';
import { CONTACT } from '../data/contact';
import { copyText } from '../utils/helpers';
import { fadeInUp } from '../utils/animations';

export default function Contact() {
    const { hover, success } = useSound();

    const items = [
        { icon: 'fa-phone', label: 'Téléphone / WhatsApp', val: CONTACT.phoneDisplay, onClick: () => copyText(CONTACT.phone, 'Téléphone') },
        { icon: 'fa-envelope', label: 'Email', val: CONTACT.email, onClick: () => copyText(CONTACT.email, 'Email') },
        { icon: 'fa-location-dot', label: 'Localisation', val: CONTACT.address, onClick: () => copyText(CONTACT.address, 'Adresse') },
    ];

    const handleCopy = (item) => () => {
        hover();
        item.onClick();
        success();
    };

    return (
        <section className="section" id="contact">
            <div className="container">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <span className="section-tag">Contact</span>
                    <h2 className="section-title">Restons <span className="hl">en contact</span></h2>
                    <p className="section-text">
                        Une idée, un projet, une collaboration ? Écrivez-moi directement, je réponds vite.
                    </p>
                </motion.div>

                <div className="contact-row">
                    {items.map((item, i) => (
                        <motion.div
                            className="contact-item"
                            key={item.label}
                            role="button"
                            tabIndex="0"
                            onClick={handleCopy(item)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCopy(item)()}
                            onMouseEnter={hover}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            custom={i}
                            whileHover={{ x: 6 }}
                        >
                            <div className="icon"><i className={`fa-solid ${item.icon}`}></i></div>
                            <div>
                                <div className="label">{item.label}</div>
                                <div className="val">{item.val}</div>
                            </div>
                            <i className="fa-regular fa-copy" style={{ marginLeft: 'auto', opacity: 0.5 }}></i>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
