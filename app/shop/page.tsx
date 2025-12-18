import { getShopItems, getUserInventory } from "@/app/actions/shop";
import { ShopUI } from "@/components/shop/ShopUI";
import { BottomDock } from "@/components/ui/BottomDock";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";






export default async function ShopPage() {
    const [items, inventory] = await Promise.all([
        getShopItems(),
        getUserInventory()
    ]);

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            <main className="container max-w-lg mx-auto p-4 pt-8">
                <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-500" /></div>}>
                    <ShopUI
                        initialItems={items || []}
                        initialInventory={inventory || []}
                    />
                </Suspense>
            </main>
            <BottomDock />
        </div>
    );
}
