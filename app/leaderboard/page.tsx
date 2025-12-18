import { getLeaderboard } from "@/app/actions/leaderboard";





import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown } from "lucide-react";
import { BottomDock } from "@/components/ui/BottomDock";
import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";

const getRankTitle = (level: number) => {
    if (level < 5) return "Promeneur Curieux";
    if (level < 10) return "Observateur Averti";
    return "Gardien du Territoire";
};

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            {/* Header */}
            <header className="p-6 pt-12 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 relative z-10">
                    Classement
                </h1>
                <p className="text-muted-foreground relative z-10 text-center">
                    Les meilleurs Gardiens du Territoire Vivant
                </p>
            </header>

            {/* List */}
            <div className="max-w-md mx-auto px-6 space-y-4">
                {leaderboard.map((user, index) => {
                    const rank = index + 1;
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    return (
                        <div
                            key={user.username}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-transform hover:scale-[1.02] ${isTop1 ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/5 border-yellow-500/50' :
                                isTop2 ? 'bg-white/10 border-slate-400/30' :
                                    isTop3 ? 'bg-orange-500/10 border-orange-500/30' :
                                        'bg-white/5 border-white/5'
                                }`}
                        >
                            {/* Rank Badge */}
                            <div className={`w-10 h-10 flex items-center justify-center font-bold text-xl ${isTop1 ? 'text-yellow-400' :
                                isTop2 ? 'text-slate-300' :
                                    isTop3 ? 'text-orange-400' :
                                        'text-slate-500'
                                }`}>
                                {isTop1 ? <Crown size={28} /> :
                                    isTop2 ? <Medal size={24} /> :
                                        isTop3 ? <Medal size={24} /> :
                                            `#${rank}`}
                            </div>

                            {/* Avatar */}
                            <Avatar className={`w-12 h-12 border-2 ${isTop1 ? 'border-yellow-400' : 'border-emerald-500/30'
                                }`}>
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="bg-emerald-900 text-emerald-100">
                                    {user.username?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="font-bold text-lg leading-none mb-1 flex items-center gap-2">
                                    {user.username || "Explorateur Inconnu"}
                                    {isTop1 && <Trophy size={14} className="text-yellow-400" />}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Niveau {user.level} • <span className="text-emerald-500/80">{getRankTitle(user.level)}</span>
                                </div>
                            </div>

                            {/* XP */}
                            <div className="text-right">
                                <div className="text-xl font-bold font-mono text-emerald-400">
                                    {user.xp}
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                    XP
                                </div>
                            </div>
                        </div>
                    );
                })}

                {leaderboard.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Aucun explorateur classé pour le moment.
                        <br />
                        Sois le premier !
                    </div>
                )}
            </div>

            <div className="fixed bottom-24 right-6 left-6 flex justify-center pointer-events-none">
                {/* Floating CTA if needed, or rely on BottomDock */}
            </div>

            <BottomDock />
        </div>
    );
}
