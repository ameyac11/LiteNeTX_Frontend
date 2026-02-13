import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        "Initializing Core Systems...",
        "Waking up Backend Server...",
        "Loading Neural Weights...",
        "Configuring Tensor Layers...",
        "LiteNeTX System Ready.",
    ];

    useEffect(() => {
        // Wake up backend server
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
            className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center font-sans"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            <div className="flex flex-col items-center max-w-sm w-full px-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-8"
                >
                    <img
                        src="/LiteNeTX_logo_bwhite.png"
                        alt="LiteNeTX Logo"
                        className="w-32 h-auto object-contain md:w-40"
                    />
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-2xl font-semibold tracking-[0.2em] text-white mb-12"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    LITENETX
                </motion.h1>

                {/* Percentage */}
                <div className="w-full flex justify-end mb-2">
                    <span className="text-xs font-mono text-gray-500">{Math.round(progress)}%</span>
                </div>

                {/* Minimal Progress Bar */}
                <div className="w-full h-[2px] bg-gray-900 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                {/* Status Text */}
                <div className="h-6 overflow-hidden w-full text-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={statusIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-gray-500 font-medium tracking-wide"
                        >
                            {statuses[statusIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
