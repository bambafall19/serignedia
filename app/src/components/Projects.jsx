import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

const projects = [
    { title: 'Dessin sur papier', icon: 'fa-pencil', text: 'Transformation de vos photos en dessins au crayon et à l\'encre sur papier, fidèles et expressifs.' },
    { title: 'Cover Art', icon: 'fa-palette', text: 'Création de covers art originaux pour vos musique, albums et contenus digitaux, à partir de vos images.' },
    { title: 'Commandes personnalisées', icon: 'fa-star', text: 'Portraits, cadeaux et supports sur mesure, réalisés à la main selon vos envies et votre histoire.' },
    { title: 'Projets & Partenariats', icon: 'fa-handshake', text: 'Collaborations avec artistes, marques et événements pour valoriser l\'art dessiné et le cover art.' },
];

export default function Projects() {
    return (
        <section className="section" id="projets">
            <div className="container">
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <span className="section-tag">Nos services</span>
                    <h2 className="section-title">Ce que fait <span className="hl">ARTAVECMOI</span></h2>
                    <p className="section-text">
                        De vos photos à des œuvres dessinées sur papier et des cover art uniques.
                    </p>
                </motion.div>

                <div className="projects-grid">
                    {projects.map((p, i) => (
                        <motion.div
                            className="project-card"
                            key={p.title}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            custom={i}
                            whileHover={{ y: -8 }}
                        >
                            <div className="project-icon"><i className={`fa-solid ${p.icon}`}></i></div>
                            <h4>{p.title}</h4>
                            <p>{p.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
