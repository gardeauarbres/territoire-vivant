import { useRef, useState, useCallback } from 'react';

interface UseCameraReturn {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    isStreaming: boolean;
    error: string | null;
    startCamera: () => Promise<void>;
    stopCamera: () => void;
    takePhoto: () => string | null;
}

export function useCamera(): UseCameraReturn {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Prefer back camera
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
            setIsStreaming(false);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsStreaming(false);
    }, []);

    const takePhoto = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return null;

        // Set canvas dimensions to match video stream
        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, width, height);

        // Convert to base64
        return canvas.toDataURL('image/jpeg', 0.8); // 80% quality jpeg
    }, []);

    return {
        videoRef,
        canvasRef,
        isStreaming,
        error,
        startCamera,
        stopCamera,
        takePhoto
    };
}
