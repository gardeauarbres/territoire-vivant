
"use client";



import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Mail, Loader2, User as UserIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // For signup
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (signUpError) throw signUpError;
                // Auto-login logic usually happens if email confirmation is off, 
                // but let's assume it might not persist immediately without email verify.
                // For dev/test, typically disable email verification in Supabase dashboard.
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            }

            // Success
            router.push("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2544&auto=format&fit=crop')] bg-cover bg-center opacity-20 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <GlassCard className="p-8 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg mb-4 rotate-3 border border-white/20">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white neon-text mb-2">PORTAL GARDIEN</h1>
                        <p className="text-slate-400 text-center text-sm">
                            {isSignUp ? "Rejoignez le réseau Territoire Vivant." : "Identifiez-vous pour accéder au réseau."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider ml-1">Nom de Gardien</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:text-slate-600"
                                        placeholder="Ex: NeoDruide99"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:text-slate-600"
                                    placeholder="contact@nature.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider ml-1">Mot de Passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <NeonButton
                            type="submit"
                            variant="primary"
                            className="w-full justify-center group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isSignUp ? "Création..." : "Connexion..."}
                                </>
                            ) : (
                                <span>{isSignUp ? "INITIER L'ENREGISTREMENT" : "INITIALISER CONNEXION"}</span>
                            )}
                        </NeonButton>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors underline underline-offset-4"
                        >
                            {isSignUp ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? Devenir Gardien"}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                            Accès réservé au personnel autorisé.
                            <br />
                            Version Bêta 1.3 • Protocole Sécurisé Supabase
                        </p>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}

