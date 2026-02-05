import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Activity } from "lucide-react";

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
            className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center overflow-hidden font-sans"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
            {/* Background Grid & Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] z-10" />
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(30,64,175,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,64,175,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0,
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Corner HUD Elements */}
            <div className="absolute top-8 left-10 z-20 hidden md:block">
                <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] text-blue-500/60 font-mono">
                    <Activity className="w-3 h-3" />
                    <span>SYSTEM_V2.0.4</span>
                </div>
            </div>

            <div className="absolute top-8 right-10 z-20 hidden md:block">
                <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] text-blue-500/60 font-mono">
                    <span>LAT. OPTIMIZE</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
            </div>

            <div className="absolute bottom-8 left-10 z-20 hidden md:block">
                <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] text-blue-500/60 font-mono">
                    <div className="w-2 h-3 border border-blue-500/40 border-t-0 border-r-0" />
                    <span>WEIGHTS.PIN_64M</span>
                </div>
            </div>

            <div className="absolute bottom-8 right-10 z-20 hidden md:block">
                <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] text-blue-500/60 font-mono">
                    <span>NODE_ACTIVE</span>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <Network className="w-3 h-3" />
                    </motion.div>
                </div>
            </div>

            {/* Main Center Content */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Logo Section */}
                <div className="relative mb-12">
                    {/* Outer Glowing Ring */}
                    <motion.div
                        className="absolute -inset-4 rounded-full border border-blue-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    />
                    <motion.div
                        className="absolute -inset-4 rounded-full border-t border-blue-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Circle Gradient */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-b from-blue-900/40 to-black border border-blue-500/50 flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                        <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />

                        {/* Logo Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <Network className="w-12 h-12 text-blue-400" />
                        </motion.div>
                    </div>
                </div>

                {/* Title */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1 className="text-4xl font-bold tracking-[0.3em] text-white">
                        LITENETX
                    </h1>
                    <div className="mt-2 h-0.5 w-12 bg-blue-600 mx-auto rounded-full" />
                </motion.div>

                {/* Progress Section */}
                <div className="w-80 md:w-96 relative">
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
                            <span className="text-[10px] tracking-widest text-blue-400 font-mono uppercase">
                                Analysis Status
                            </span>
                        </div>
                        <span className="text-2xl font-mono text-white">
                            {Math.round(progress)}<span className="text-sm text-gray-500">%</span>
                        </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-[20px] bg-white/50 blur-[4px]" />
                        </motion.div>
                    </div>

                    {/* Status Text Feed */}
                    <div className="mt-4 h-4 overflow-hidden relative text-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statusIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-[10px] text-gray-400 tracking-widest uppercase font-mono"
                            >
                                {statuses[statusIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
