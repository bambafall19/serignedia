import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

const points = [
    { icon: 'fa-pencil', title: 'Artiste', text: 'Je transforme des photos en dessins sur papier grâce à une vision artistique précise.' },
    { icon: 'fa-palette', title: 'Créatif', text: 'Je crée des cover art uniques qui donnent une identité forte à chaque projet.' },
    { icon: 'fa-rocket', title: 'Entrepreneur', text: 'CEO d\'ARTAVECMOI, je construis une startup d\'art made in Sénégal.' },
];

export default function About() {
    return (
        <section className="section" id="about">
            <div className="container">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <span className="section-tag">À propos</span>
                    <h2 className="section-title">Qui suis-je <span className="hl">?&nbsp;</span></h2>
                    <p className="section-text">
                        Basé à <strong>Thiès Khombole, Keur Macodou</strong>, je suis étudiant et entrepreneur.
                        En tant que CEO de <strong>ARTAVECMOI</strong>, je transforme les photos en dessins sur
                        papier et en cover art, pour donner une touche artistique et personnelle à chaque visuel.
                    </p>
                </motion.div>

                <div className="points">
                    {points.map((p, i) => (
                        <motion.div
                            className="point"
                            key={p.title}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            custom={i}
                            whileHover={{ y: -6 }}
                        >
                            <div className="icon"><i className={`fa-solid ${p.icon}`}></i></div>
                            <h4>{p.title}</h4>
                            <p>{p.text}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="about-chip"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className="status"></span>
                    Disponible pour projets &amp; collaborations
                </motion.div>
            </div>
        </section>
    );
}
