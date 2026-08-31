import { useEffect, useState } from 'react';
import { useSound } from './hooks/useSound.jsx';
import ScrollProgress from './components/ScrollProgress';
import Hero from './components/Hero';
import About from './components/About';
import ArtAvecMoi from './components/ArtAvecMoi';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CONTACT } from './data/contact';

function App() {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('smd_theme') || 'dark';
        } catch {
            return 'dark';
        }
    });
    const { click, click: soundClick, enabled, toggle: toggleSound } = useSound();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('smd_theme', theme);
        } catch { /* ignore */ }
    }, [theme]);

    const toggleTheme = () => {
        click();
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    };

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <ScrollProgress />

            <div className="float-actions">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer le thème" title="Changer le thème">
                    <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
                </button>
                <button
                    className={`theme-toggle sound-toggle${enabled ? '' : ' muted'}`}
                    onClick={() => { soundClick(); toggleSound(); }}
                    aria-label={enabled ? 'Couper le son' : 'Activer le son'}
                    title={enabled ? 'Couper le son' : 'Activer le son'}
                >
                    <i className={enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'}></i>
                </button>
            </div>

            <main>
                <Hero onAction={scrollToAbout} />
                <About />
                <ArtAvecMoi />
                <Projects />
                <Skills />
                <Contact />
            </main>

            <Footer />

            <a
                className="fab-wa"
                href={CONTACT.whatsappUrl("Bonjour Serigne Mbacké Dia !")}
                target="_blank"
                rel="noreferrer"
                aria-label="Discuter sur WhatsApp"
            >
                <i className="fa-brands fa-whatsapp"></i>
            </a>
        </>
    );
}

export default App;
