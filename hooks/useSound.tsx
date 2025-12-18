"use client";

import { createContext, useContext, useEffect, useRef } from "react";

type SoundType = "hover" | "click" | "success" | "notification" | "scan" | "error" | "buy" | "level-up";

interface SoundContextType {
    playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType>({ playSound: () => { } });

export function useSound() {
    return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on user interaction
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
        };
        window.addEventListener('click', initAudio, { once: true });
        return () => window.removeEventListener('click', initAudio);
    }, []);

    const playSound = (type: SoundType) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case "hover":
                // Very subtle high frequency blip
                osc.type = "sine";
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
                gain.gain.setValueAtTime(0.01, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case "click":
                // Sharp tech click
                osc.type = "triangle";
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case "success":
                // Nice major chord arpeggio
                [440, 554, 659, 880].forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = "sine";
                    o.frequency.value = freq;
                    const release = now + 0.1 * i;
                    g.gain.setValueAtTime(0, now);
                    g.gain.linearRampToValueAtTime(0.15, release); // Bumped to 0.15
                    g.gain.exponentialRampToValueAtTime(0.001, release + 0.5);
                    o.start(now);
                    o.stop(release + 0.5);
                });
                break;

            case "notification":
                // Soft double ping
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);

                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.frequency.setValueAtTime(1760, now + 0.15);
                gain2.gain.setValueAtTime(0.1, now + 0.15);
                gain2.gain.linearRampToValueAtTime(0, now + 0.3);
                osc2.start(now + 0.15);
                osc2.stop(now + 0.3);
                break;

            case "scan":
                // Sci-fi data processing sound
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(800, now + 0.2);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;

            case "error":
                // Low buzz
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case "buy":
                // "Ka-ching" - Coin sound (High sine + rapid arpeggio)
                const coinOsc = ctx.createOscillator();
                const coinGain = ctx.createGain();
                coinOsc.connect(coinGain);
                coinGain.connect(ctx.destination);

                coinOsc.type = "sine";
                coinOsc.frequency.setValueAtTime(1200, now); // High B
                coinOsc.frequency.exponentialRampToValueAtTime(2000, now + 0.1); // Slide up slightly

                coinGain.gain.setValueAtTime(0.1, now);
                coinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5); // Long ring

                coinOsc.start(now);
                coinOsc.stop(now + 0.5);

                // Second ping for "Cha-ching" effect
                setTimeout(() => {
                    const coin2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    coin2.connect(gain2);
                    gain2.connect(ctx.destination);
                    coin2.frequency.setValueAtTime(2400, ctx.currentTime);
                    gain2.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                    coin2.start(ctx.currentTime);
                    coin2.stop(ctx.currentTime + 0.6);
                }, 80);
                break;

            case "level-up":
                // Orchestral Fanfare (C Maj -> G Maj -> C Maj7)
                const chords = [
                    { f: [261.63, 329.63, 392.00], t: 0 },    // C Major
                    { f: [392.00, 493.88, 587.33], t: 0.2 },  // G Major
                    { f: [523.25, 659.25, 783.99, 1046.50], t: 0.5 } // C Major High
                ];

                chords.forEach(chord => {
                    chord.f.forEach(freq => {
                        const o = ctx.createOscillator();
                        const g = ctx.createGain();
                        o.connect(g);
                        g.connect(ctx.destination);
                        o.type = "triangle"; // Brighter tone
                        o.frequency.value = freq;

                        const start = now + chord.t;
                        g.gain.setValueAtTime(0, start);
                        g.gain.linearRampToValueAtTime(0.05, start + 0.05);
                        g.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

                        o.start(start);
                        o.stop(start + 0.8);
                    });
                });
                break;
        }
    };

    return (
        <SoundContext.Provider value={{ playSound }}>
            {children}
        </SoundContext.Provider>
    );
}
