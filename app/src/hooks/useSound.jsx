import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const SoundContext = createContext(null);

const PENTATONIC_MAJOR = [523, 587, 659, 784, 880]; // C D E G A
const HOVER_CHORD = [440, 554, 659];    // A4 C#5 E5
const CLICK_CHORD = [523, 659, 784];    // C5 E5 G5
const WELCOME_MELODY = [523, 659, 784, 1047]; // C E G C6

function getVolume() {
    try {
        const v = parseFloat(localStorage.getItem('smd_volume'));
        return Number.isFinite(v) ? v : 0.6;
    } catch {
        return 0.6;
    }
}

export function SoundProvider({ children }) {
    const [enabled, setEnabled] = useState(() => {
        try {
            return localStorage.getItem('smd_sound') !== 'off';
        } catch {
            return true;
        }
    });
    const [volume, setVolume] = useState(getVolume);
    const audioCtxRef = useRef(null);
    const playRef = useRef(() => {});
    const welcomesPlayed = useRef(false);

    useEffect(() => {
        try {
            localStorage.setItem('smd_sound', enabled ? 'on' : 'off');
            localStorage.setItem('smd_volume', String(volume));
        } catch { /* ignore */ }
    }, [enabled, volume]);

    const getCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    }, []);

    // Rich note: harmonic stack + low-pass filter + soft envelope
    const playNote = useCallback((freqs, { dur = 0.3, vol = 0.05, type = 'sine', delay = 0 } = {}) => {
        try {
            if (!Array.isArray(freqs)) freqs = [freqs];
            const ctx = getCtx();
            const t0 = ctx.currentTime + delay;

            const master = ctx.createGain();
            master.gain.setValueAtTime(0.0001, t0);
            master.gain.exponentialRampToValueAtTime(vol * volume, t0 + 0.008);
            master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.setValueAtTime(2400, t0);
            lp.frequency.exponentialRampToValueAtTime(900, t0 + dur);

            master.connect(lp);
            lp.connect(ctx.destination);

            freqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                osc.type = type;
                osc.frequency.setValueAtTime(f, t0);
                if (i === 0) {
                    // subtle vibrato on the fundamental
                    const lfo = ctx.createOscillator();
                    lfo.frequency.value = 5;
                    const lfoGain = ctx.createGain();
                    lfoGain.gain.value = f * 0.003;
                    lfo.connect(lfoGain);
                    lfoGain.connect(osc.frequency);
                    lfo.start(t0);
                    lfo.stop(t0 + dur);
                }
                osc.connect(master);
                osc.start(t0);
                osc.stop(t0 + dur);
            });
        } catch { /* ignore */ }
    }, [getCtx, volume]);

    useEffect(() => {
        playRef.current = playNote;
    }, [playNote]);

    const hover = useCallback(() => {
        if (!enabled) return;
        playNote(HOVER_CHORD, { dur: 0.18, vol: 0.03, type: 'triangle' });
    }, [enabled, playNote]);

    const click = useCallback(() => {
        if (!enabled) return;
        playNote(CLICK_CHORD, { dur: 0.22, vol: 0.045, type: 'sine' });
    }, [enabled, playNote]);

    const success = useCallback(() => {
        if (!enabled) return;
        PENTATONIC_MAJOR.forEach((f, i) => {
            playNote([f], { dur: 0.18, vol: 0.045, type: 'triangle', delay: i * 0.09 });
        });
    }, [enabled, playNote]);

    const welcome = useCallback(() => {
        if (!enabled) return;
        WELCOME_MELODY.forEach((f, i) => {
            playNote([f, f * 1.5], { dur: 0.3, vol: 0.04, type: 'sine', delay: i * 0.13 });
        });
    }, [enabled, playNote]);

    const section = useCallback(() => {
        if (!enabled) return;
        playNote([392, 523], { dur: 0.14, vol: 0.025, type: 'triangle' });
    }, [enabled, playNote]);

    // Welcome melody on first user interaction (autoplay requires a gesture)
    useEffect(() => {
        if (!enabled) return;
        const playOnce = () => {
            if (welcomesPlayed.current) return;
            welcomesPlayed.current = true;
            welcome();
            window.removeEventListener('pointerdown', playOnce);
        };
        window.addEventListener('pointerdown', playOnce);
        return () => window.removeEventListener('pointerdown', playOnce);
    }, [enabled, welcome]);

    const setVolumeSafe = useCallback((v) => setVolume(Math.max(0, Math.min(1, v))), []);

    const value = {
        enabled, setEnabled, toggle: () => setEnabled((v) => !v),
        volume, setVolume: setVolumeSafe,
        hover, click, success, welcome, section, playNote,
    };

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
    return useContext(SoundContext);
}
