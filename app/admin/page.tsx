import { getAdminDiscoveries } from "@/app/actions/gallery";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Shield } from "lucide-react";






export default async function AdminPage() {
    // Fetch ALL discoveries (pending, approved, rejected)
    const allDiscoveries = await getAdminDiscoveries();

    return (
        <main className="min-h-screen p-8 bg-black/95">
            <header className="max-w-6xl mx-auto mb-8 flex items-center gap-4 border-b border-slate-800 pb-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Centre de Modération</h1>
                    <p className="text-slate-400">Bibliothèque de contrôle total (Quêtes & Validations).</p>
                </div>
            </header>

            <section className="max-w-6xl mx-auto">
                <AdminDashboard initialDiscoveries={allDiscoveries} />
            </section>
        </main>
    );
}
