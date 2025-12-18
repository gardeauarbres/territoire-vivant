import Link from 'next/link'
import { NeonButton } from '@/components/ui/NeonButton'
import { MapPinOff } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-8">
                <MapPinOff size={48} className="text-red-400" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 neon-text-red">Zone Hors-Carte</h1>
            <p className="text-slate-400 max-w-md mb-8">
                Il semble que vous vous soyez aventuré dans une zone inconnue de l'esprit du territoire.
                Revenez sur vos pas pour retrouver le sentier.
            </p>

            <Link href="/">
                <NeonButton variant="primary">
                    Retour au Portail
                </NeonButton>
            </Link>
        </div>
    )
}
