"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { Spot } from "@/lib/data";

interface SpiritChatProps {
    spot: Spot;
    onClose: () => void;
}

export function SpiritChat({ spot, onClose }: SpiritChatProps) {
    const [messages, setMessages] = useState([
        { role: 'model', text: `(Un souffle léger parcourt les feuilles...) Je suis l'esprit de ${spot.name}. Approche, Gardien.` }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulation of API call (placeholder for now)
        setTimeout(() => {
            const responses = [
                "Le vent me murmure que tu es un ami de la nature.",
                "Mes racines sentent l'eau fraîche en profondeur.",
                "Les oiseaux chantent ton arrivée, Gardien.",
                "J'ai vu passer un écureuil ce matin, il était pressé."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { role: 'model', text: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Header Chat */}
            <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shadow-lg z-10 glass">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles size={20} className="text-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight">Esprit du Lieu</h3>
                        <p className="text-xs text-purple-300">{spot.name}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${msg.role === 'user'
                                ? 'bg-primary/20 text-white rounded-tr-sm border border-primary/30'
                                : 'glass-card text-indigo-100 rounded-tl-sm border border-indigo-500/30'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm flex gap-2 items-center border border-white/10">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/50 border-t border-white/5 backdrop-blur-md">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Parlez à l'esprit..."
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-purple-500/20"
                    >
                        {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
