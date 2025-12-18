import { ProfileClient } from "@/components/profile/ProfileClient";


export const dynamic = "force-dynamic";

import { GalleryGrid } from "@/components/profile/GalleryGrid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    return (
        <ProfileClient
            gallerySlot={
                <Suspense fallback={
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                }>
                    <GalleryGrid />
                </Suspense>
            }
        />
    );
}
