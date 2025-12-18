import { getUserDiscoveries } from "@/app/actions/gallery";
import { BiodexUI } from "./BiodexUI";

export async function GalleryGrid() {
    const discoveries = await getUserDiscoveries();

    return <BiodexUI initialDiscoveries={discoveries || []} />;
}
