import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
    const [enabled, setEnabled] = useState(() => {
        try {
            return localStorage.getItem('smd_sound') !== 'off';
        } catch {
            return true;
        }
    });
    const audioCtxRef = useRef(null);

    useEffect(() => {
        try {
            localStorage.setItem('smd_sound', enabled ? 'on' : 'off');
        } catch { /* ignore */ }
    }, [enabled]);

    const getCtx = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    const playTone = useCallback(({ type = 'sine', from = 620, to = from, duration = 0.08, gain = 0.04 }) => {
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(from, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), ctx.currentTime + duration);
            g.gain.setValueAtTime(gain, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch { /* ignore */ }
    }, []);

    const hover = useCallback(() => {
        if (!enabled) return;
        playTone({ type: 'triangle', from: 420, to: 500, duration: 0.05, gain: 0.02 });
    }, [enabled, playTone]);

    const click = useCallback(() => {
        if (!enabled) return;
        playTone({ type: 'sine', from: 660, to: 880, duration: 0.09, gain: 0.04 });
    }, [enabled, playTone]);

    const success = useCallback(() => {
        if (!enabled) return;
        playTone({ type: 'sine', from: 523, to: 523, duration: 0.09, gain: 0.04 });
        setTimeout(() => playTone({ type: 'sine', from: 659, to: 659, duration: 0.09, gain: 0.04 }), 90);
        setTimeout(() => playTone({ type: 'sine', from: 784, to: 784, duration: 0.14, gain: 0.04 }), 180);
    }, [enabled, playTone]);

    const value = { enabled, setEnabled, toggle: () => setEnabled((v) => !v), hover, click, success };

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
    return useContext(SoundContext);
}
