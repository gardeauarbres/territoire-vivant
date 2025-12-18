"use client";

import { useState, useEffect } from "react";
import { Camera, Search, Upload, Scan, Zap } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScannerHud } from "@/components/scanner/ScannerHud";
import { MissionSuccessModal } from "@/components/scanner/MissionSuccessModal";
import { AnimatePresence, motion } from "framer-motion";
import { useCamera } from "@/hooks/useCamera";
import { analyzeImage } from "@/app/actions/scanner";
import { saveDiscovery } from "@/app/actions/gallery";

export default function ScannerPage() {
    const [showSuccess, setShowSuccess] = useState(false);
    const { videoRef, canvasRef, startCamera, stopCamera, takePhoto, isStreaming, error: cameraError } = useCamera();
    const { playSound } = useSound();

    // Gameplay States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [scanResult, setScanResult] = useState<any>(null);
    const [questReward, setQuestReward] = useState<any>(null);

    // Initial Camera Start
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);


    const handleShutter = async () => {
        playSound("click"); // Shutter sound

        // 1. Flash Effect
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 200);

        // 2. Capture Image
        const imageBase64 = takePhoto();
        if (!imageBase64) {
            console.error("Failed to capture photo");
            playSound("error");
            return;
        }

        // 3. Start Analysis
        setIsAnalyzing(true);
        playSound("scan"); // Analysis loop sound
        stopCamera(); // Freeze/Stop camera during analysis

        try {
            // CALL AI
            console.log("Analyzing image...");
            const analysis = await analyzeImage(imageBase64);

            if (!analysis.success) {
                console.error("Analysis Failed:", analysis.error);
                throw new Error(analysis.error || "IA non disponible");
            }

            const scanData = analysis.data;
            console.log("AI Result:", scanData);

            // 2b. Capture Location
            let location = undefined;
            if ("geolocation" in navigator) {
                try {
                    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                } catch (e) {
                    console.warn("Location capture failed", e);
                }
            }

            // Save to Gallery
            const res = await saveDiscovery(imageBase64, scanData, { location });

            if (res?.error) {
                console.error("Gallery save error:", res.error);
                alert(`Erreur Sauvegarde: ${res.error}`);
                playSound("error");
            } else {
                console.log("Saved to gallery!");
                setScanResult(scanData);

                // Handle Quest Reward if verified
                if (res?.questReward) {
                    setQuestReward(res.questReward); // New State
                    playSound("success"); // Ultra win sound
                } else {
                    playSound("notification"); // Standard success
                }

                setShowSuccess(true);
            }

        } catch (error: any) {
            console.error("Capture/Analysis failed", error);
            // alert(`Erreur: ${error.message}`); // Optional: don't alert invasive
            playSound("error");

            // Optional: Fallback to manual mode if AI fails?
            // For now, failure stops flow.
        } finally {
            setIsAnalyzing(false);
        }
    };


    const resetScanner = () => {
        setShowSuccess(false);
        setScanResult(null);
        setQuestReward(null);
        setIsAnalyzing(false);
        setConfidence(0);
        startCamera(); // Restart camera for next scan
    };

    return (
        <div className="min-h-screen p-6 flex flex-col items-center justify-center relative overflow-hidden bg-black">
            {/* Flash Effect */}
            <AnimatePresence>
                {flashActive && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="relative z-10 w-full max-w-md text-center space-y-8">

                {/* Scanner Window */}
                <div className="relative mx-auto w-80 h-96 border-2 border-emerald-500/30 rounded-3xl overflow-hidden bg-black shadow-2xl group">
                    <ScannerHud />

                    {/* Camera Feed */}
                    <div className="absolute inset-0 z-0 bg-black">
                        {!cameraError ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-red-400 text-xs p-4">
                                {cameraError}
                            </div>
                        )}
                    </div>

                    {/* AI Analysis Overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-20 bg-emerald-900/50 flex flex-col items-center justify-center backdrop-blur-sm">
                            <Scan size={64} className="text-emerald-400 animate-spin-slow mb-4" />
                            <div className="text-emerald-400 font-mono text-sm animate-pulse">TRAITEMENT IMAGE...</div>
                            <div className="text-emerald-500/50 font-mono text-xs mt-1">VÉRIFICATION BIODEX</div>
                        </div>
                    )}

                    {/* Shutter Button (Only visible when idle) */}
                    {!isAnalyzing && isStreaming && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">
                            <button
                                onClick={handleShutter}
                                className="w-16 h-16 rounded-full border-4 border-white bg-white/20 backdrop-blur flex items-center justify-center transition-all active:scale-90 hover:bg-white/40 shadow-lg"
                                title="Prendre Photo"
                            >
                                <div className="w-12 h-12 rounded-full bg-white"></div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white neon-text">
                        {isAnalyzing ? "Analyse en cours..." : "Mode Identification"}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {isAnalyzing
                            ? "L'IA compare les motifs..."
                            : "Prenez une photo claire du sujet pour l'identifier."}
                    </p>
                </div>

                {/* Manual Input Fallback & Debug */}
                {!isAnalyzing && (
                    <div className="pt-4 flex flex-col gap-2">
                        <NeonButton href="/" variant="secondary">
                            Retour Carte
                        </NeonButton>

                        {/* DEBUG BUTTON */}
                        <button
                            onClick={async () => {
                                setIsAnalyzing(true);
                                const mockData = {
                                    name: "TEST FORCE",
                                    scientificName: "Debug Force",
                                    confidence: 100,
                                    description: "Validation forcée par l'utilisateur",
                                    category: "other" as const
                                };
                                const res = await saveDiscovery("", mockData, { forceQuestCompletion: true });
                                if (res?.questReward) {
                                    setScanResult(mockData);
                                    setQuestReward(res.questReward);
                                    playSound("success");
                                    setShowSuccess(true);
                                } else {
                                    alert("Pas de quête active à valider (ou erreur).");
                                }
                                setIsAnalyzing(false);
                            }}
                            className="text-[10px] text-emerald-500/50 hover:text-emerald-400 uppercase tracking-widest border border-emerald-500/20 rounded px-2 py-1"
                        >
                            [DEBUG] Forcer Réussite Quête
                        </button>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && scanResult && (
                    <MissionSuccessModal
                        missionTitle={questReward?.isCandidate ? "QUÊTE : VALIDATION REQUISE" : (scanResult.category === 'flora' ? "Plante Identifiée" : "Espèce Identifiée")}
                        spotName={questReward ? questReward.title : "Observations Locales"}
                        xpEarned={0} // No XP yet
                        speciesUnlocked={scanResult.name}
                        confidenceScore={scanResult.confidence}
                        onClose={resetScanner}
                        isPending={true}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
