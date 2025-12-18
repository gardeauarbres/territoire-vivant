import { notFound } from "next/navigation";
import { getSpot } from "@/lib/data";
import SpotPageClient from "./SpotPageClient";
export const dynamic = "force-dynamic";




export default async function SpotPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const spot = getSpot(id);

    if (!spot) {
        notFound();
    }

    return <SpotPageClient spot={spot} />;
}
