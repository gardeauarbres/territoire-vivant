"use client";

import { Battery, Signal, Wifi } from "lucide-react";

export function ScannerHud() {
    return (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-8">
            {/* Top HUD */}
            <div className="flex justify-between items-start">
                <div className="flex gap-2">
                    <div className="bg-black/40 backdrop-blur border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400">
                        REC ● 00:12
                    </div>
                    <div className="bg-black/40 backdrop-blur border border-emerald-500/30 px-3 py-1 rounded text-xs font-mono text-emerald-400 animate-pulse">
                        SEARCHING
                    </div>
                </div>
                <div className="flex gap-4 text-emerald-400/80">
                    <Signal size={18} />
                    <Wifi size={18} />
                    <Battery size={18} />
                </div>
            </div>

            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-emerald-500/20 rounded-2xl">
                {/* Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

                {/* Center Cross */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/50"></div>
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-emerald-500/50"></div>
                </div>
            </div>

            {/* Bottom HUD */}
            <div className="flex justify-between items-end">
                <div className="text-[10px] sm:text-xs font-mono text-emerald-500/50 space-y-1">
                    <div>LAT: 48.8566 N</div>
                    <div>LON: 2.3522 E</div>
                    <div>ALT: 35m</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono text-emerald-400 mb-1">DATA STREAM</div>
                    <div className="w-32 h-1 bg-emerald-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-2/3 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
