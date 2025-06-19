import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

const STREAM_ID = 'webcam-node-1';
const USER_ID = 'guardian-operator';
const POST_INTERVAL_MS = 5000; // Every 5s
const FPS_LIMIT = 5; // 1 frame per second (you can raise/lower this)
const MOTION_THRESHOLD = 0.98; // 98% similarity → considered same

export default function VisionStream() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [streaming, setStreaming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [lastFrame, setLastFrame] = useState<string | null>(null);
    const [lastSentAt, setLastSentAt] = useState<number>(0);

    function base64Similarity(a: string, b: string): number {
        // Simple normalized Levenshtein-like fallback
        if (!a || !b) return 0;
        let matches = 0;
        const minLen = Math.min(a.length, b.length);
        for (let i = 0; i < minLen; i++) {
            if (a[i] === b[i]) matches++;
        }
        return matches / minLen;
    }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        });
    }, []);

    useEffect(() => {
        let interval: any;

        if (streaming) {
            interval = setInterval(() => {
                captureAndSendFrame();
            }, POST_INTERVAL_MS);
        }

        return () => clearInterval(interval);
    }, [streaming]);

    const captureAndSendFrame = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const now = Date.now();
        const elapsed = now - lastSentAt;

        if (elapsed < 1000 / FPS_LIMIT) {
            return; // FPS throttle
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const { videoWidth, videoHeight } = videoRef.current;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        const base64Image = canvasRef.current.toDataURL('image/jpeg');


        // 🔍 Compare with last frame to detect motion
        const similarity = base64Similarity(base64Image, lastFrame || '');
        if (similarity > MOTION_THRESHOLD) {
            console.log(`⚠️ Skipping frame — similarity: ${similarity.toFixed(3)}`);
            return;
        }

        setLastFrame(base64Image); // Store this for next time
        setLastSentAt(now);

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5859/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-stream-id': STREAM_ID,
                    'x-user-id': USER_ID,
                },
                body: JSON.stringify({ image: base64Image }),
            });

            const data = await response.json();
            console.log('🧠 Vision Result:', data);
            setLastResult(data?.result?.summary || '✔️ Frame sent');
        } catch (err) {
            console.error('❌ Vision error', err);
            setLastResult('⚠️ Error sending frame');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h5">🧠 Guardian Vision Node (Web)</Typography>
            <video ref={videoRef} style={{ width: '100%', maxWidth: 640, borderRadius: 8 }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Button
                variant="contained"
                color={streaming ? 'error' : 'primary'}
                onClick={() => setStreaming((prev) => !prev)}
            >
                {streaming ? 'Stop Stream' : 'Start Stream'}
            </Button>
            {loading && <CircularProgress />}
            {lastResult && (
                <Typography variant="body2" color="text.secondary">
                    Last result: {lastResult}
                </Typography>
            )}
        </Box>
    );
}
