"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, MessageCircle } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { askEsprit } from "@/app/actions/esprit";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export function EspritCompanion() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "esprit"; content: string }[]>([
        { role: "esprit", content: "Je suis l'Esprit du Territoire. Le vent me porte tes paroles..." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { playSound } = useSound();

    const [spiritType, setSpiritType] = useState<'territory' | 'fauna' | 'flora' | 'water'>('territory');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        playSound("click");
        const userMsg = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await askEsprit(userMsg, spiritType);
            setMessages(prev => [...prev, { role: "esprit", content: response }]);
            playSound("notification"); // Or success
        } catch (error) {
            setMessages(prev => [...prev, { role: "esprit", content: "Le lien spirituel est brouillé..." }]);
            playSound("notification");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated || pathname === '/login') return null;

    return (
        <>
            {/* Toggle Button (Floating Orb) */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsOpen(!isOpen);
                    playSound("click");
                }}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-white/20"
            >
                {isOpen ? <X className="text-white w-8 h-8" /> : <Sparkles className="text-white w-8 h-8 animate-pulse" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] glass-panel rounded-2xl flex flex-col overflow-hidden border border-emerald-500/30"
                        style={{
                            background: "rgba(10, 20, 30, 0.8)",
                            backdropFilter: "blur(12px)"
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-emerald-900/50 to-transparent">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white neon-text text-sm">L'Esprit du Territoire</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] text-emerald-400/80 uppercase tracking-wider">Connecté</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {/* Persona Selector */}
                            <div className="flex gap-2 justify-center mb-4">
                                {(['territory', 'fauna', 'flora', 'water'] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setSpiritType(type);
                                            setMessages([]); // Clear chat on switch
                                            playSound("click");
                                        }}
                                        className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border transition-colors ${spiritType === type
                                            ? 'bg-emerald-500 text-white border-emerald-400'
                                            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {type === 'territory' ? 'Territoire' :
                                            type === 'fauna' ? 'Faune' :
                                                type === 'flora' ? 'Flore' : 'Eau'}
                                    </button>
                                ))}
                            </div>

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-emerald-600/20 border border-emerald-500/30 text-white rounded-tr-none"
                                            : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={`Parlez à l'Esprit de la ${spiritType === 'territory' ? 'Forêt' : spiritType}...`}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSend}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/50 hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
