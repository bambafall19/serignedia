import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

const skills = [
    { label: 'Dessin & Illustration sur papier', value: 92 },
    { label: 'Cover Art & Design digital', value: 88 },
    { label: 'Créativité & Direction artistique', value: 90 },
    { label: 'Entrepreneuriat & Communication', value: 85 },
];

export default function Skills() {
    return (
        <section className="section" id="competences" style={{ background: 'var(--bg-soft)' }}>
            <div className="container">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <span className="section-tag">Compétences</span>
                    <h2 className="section-title">Mes <span className="hl">talents</span></h2>
                    <p className="section-text">
                        Un savoir-faire artistique unique, entre le dessin à la main et la création de cover art.
                    </p>
                </motion.div>

                <div className="skills-list">
                    {skills.map((s, i) => (
                        <motion.div
                            className="skill-item"
                            key={s.label}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            custom={i}
                        >
                            <div className="skill-top">
                                <span className="skill-label">{s.label}</span>
                                <span className="skill-value">{s.value}%</span>
                            </div>
                            <div className="skill-bar">
                                <motion.div
                                    className="skill-fill"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${s.value}%` }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
