import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const statuses = [
        "INITIALIZING_NEURAL_CORE...",
        "LOADING_TENSOR_WEIGHTS...",
        "CONFIGURING_VISION_PIPELINE...",
        "OPTIMIZING_INFERENCE_ENGINE...",
        "SYSTEM_READY",
    ];

    // Render hex stream
    useEffect(() => {
        const interval = setInterval(() => {
            const hex = "0x" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
            setLogs(prev => [hex, ...prev.slice(0, 15)]);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Wake backend server
        const wakeUpBackend = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                if (baseUrl) {
                    await fetch(`${baseUrl}/health`, { method: 'GET' }).catch(() => { });
                }
            } catch (error) { }
        };

        wakeUpBackend();

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 8;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, 80);

        const statusTimer = setInterval(() => {
            setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
        }, 900);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, []);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                onComplete();
            }, 800);
        }
    }, [progress, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#020202] text-white flex flex-col items-center justify-center font-mono overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            {/* Background Data Stream (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex justify-between p-4 selection:bg-none">
                <div className="flex flex-col text-[10px] leading-tight">
                    {logs.map((log, i) => (
                        <span key={i} className="text-emerald-500">{log}</span>
                    ))}
                </div>
                <div className="flex flex-col text-[10px] leading-tight text-right">
                    {logs.map((log, i) => (
                        <span key={i} className="text-blue-500">:: {log}</span>
                    ))}
                </div>
            </div>



            <div className="flex flex-col items-center max-w-sm w-full px-8 relative z-10">
                {/* Scanner Beam Container */}
                <div className="relative mb-12 group">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="/LiteNeTX_logo_bwhite.png"
                            alt="LiteNeTX Logo"
                            className="w-24 h-auto object-contain md:w-32 opacity-80"
                        />
                    </motion.div>



                    {/* Glow effect under logo */}
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl -z-10 rounded-full" />
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold tracking-[0.3em] text-white mb-2 flex items-center gap-2">
                    LITENET<span className="text-blue-500">X</span>
                </h1>
                <div className="h-px w-12 bg-blue-500/30 mb-8" />

                {/* Status & Confidence */}
                <div className="w-full space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] tracking-widest text-slate-500 uppercase">System Status</span>
                        <span className="text-[10px] tracking-widest text-slate-500 uppercase">Confidence</span>
                    </div>

                    <div className="flex justify-between items-center font-mono text-xs">
                        <div className="h-4 overflow-hidden text-blue-400">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={statusIndex}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {">"} {statuses[statusIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="text-blue-500 font-bold">{Math.round(progress)}%</span>
                    </div>

                    {/* Tech Progress Bar */}
                    <div className="w-full h-[1px] bg-slate-800 mt-2 relative overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Tech Indicators */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 text-[9px] text-slate-600 font-mono tracking-widest">
                <span>V.3.1.0-RC</span>
                <span className="animate-pulse">AWAITING_INPUT</span>
                <span>SECURE_CONN</span>
            </div>
        </motion.div>
    );
}
