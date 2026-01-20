import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Activity, Cpu, Database, Cpu as Chip, Globe } from "lucide-react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        "Initializing Core Systems...",
        "Waking up Backend Server...",
        "Loading Neural Weights...",
        "Configuring Tensor Layers...",
        "LiteNet System Ready."
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
            className="fixed inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            {/* 1. Cyberpunk Mesh & Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                {/* Floating Gradient Orbs */}
                <motion.div
                    className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Vertical Scanline Line */}
                <motion.div
                    className="absolute w-full h-[1px] bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* 2. Corners Diagnostic HUD */}
            <div className="absolute inset-8 pointer-events-none hidden sm:block">
                <div className="absolute top-0 left-0 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest flex items-center gap-2">
                        <Chip className="w-3 h-3" /> System_v2.0.4
                    </span>
                    <div className="h-[1px] w-24 bg-primary/10" />
                </div>
                <div className="absolute top-0 right-0 flex flex-col items-end gap-1 text-right">
                    <span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest flex items-center gap-2">
                        Lat. Optimize <Globe className="w-3 h-3" />
                    </span>
                    <div className="h-[1px] w-24 bg-primary/10" />
                </div>
                <div className="absolute bottom-0 left-0 flex flex-col gap-1">
                    <div className="h-[1px] w-24 bg-primary/10" />
                    <span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest flex items-center gap-2">
                        <Database className="w-3 h-3" /> Weights.pth_64M
                    </span>
                </div>
                <div className="absolute bottom-0 right-0 flex flex-col items-end gap-1 text-right">
                    <div className="h-[1px] w-24 bg-primary/10" />
                    <span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest flex items-center gap-2">
                        Node_Active <Activity className="w-3 h-3" />
                    </span>
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">

                {/* 3. Central AI Core Icon */}
                <div className="relative mb-14">
                    {/* Pulsing Aura */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Icon Container */}
                    <motion.div
                        className="relative bg-black/40 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex items-center justify-center group"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "circOut" }}
                    >
                        <Network className="w-14 h-14 text-primary" />

                        {/* Independent Spinning Ring */}
                        <motion.div
                            className="absolute inset-2 border-2 border-primary/20 border-t-primary/60 rounded-[1.8rem]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>

                    {/* Orbiting HUD Marker */}
                    <motion.div
                        className="absolute -inset-6 border border-primary/5 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full absolute -top-0.5 left-1/2 -track-x-1/2 shadow-[0_0_15px_rgba(59,130,246,1)]" />
                    </motion.div>
                </div>

                {/* 4. Brand & Progress Feed */}
                <div className="w-full text-center mb-10">
                    <motion.h1
                        className="text-4xl font-extrabold tracking-[0.2em] uppercase mb-2 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        LiteNet
                    </motion.h1>
                    <motion.div
                        className="h-[1px] w-12 bg-primary mx-auto mb-6"
                        initial={{ width: 0 }}
                        animate={{ width: 48 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    />
                </div>

                {/* 5. Progress System */}
                <div className="w-full space-y-5">
                    <div className="flex justify-between items-end px-1">
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest font-bold flex items-center gap-2">
                                <Activity className="w-3 h-3 animate-pulse" />
                                Analysis Status
                            </span>
                        </div>
                        <span className="text-2xl font-mono font-bold tracking-tighter text-white">
                            {Math.round(progress)}<span className="text-xs opacity-40 ml-0.5">%</span>
                        </span>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="h-1.5 w-full bg-white/5 dark:bg-black/40 rounded-full relative overflow-hidden border border-white/10 p-[1px]">
                        <motion.div
                            className="h-full rounded-full relative bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                            animate={{ width: `${progress}%` }}
                            initial={{ width: "0%" }}
                            transition={{ type: "spring", stiffness: 30, damping: 15 }}
                        >
                            {/* Animated Sweep highlight */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                animate={{ x: ['-100%', '300%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>

                    {/* Cycling Log Feed */}
                    <div className="h-5 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statuses[statusIndex]}
                                initial={{ y: 10, opacity: 0, filter: 'blur(5px)' }}
                                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                exit={{ y: -10, opacity: 0, filter: 'blur(5px)' }}
                                transition={{ duration: 0.4 }}
                                className="text-[10px] text-primary/80 text-center font-mono uppercase tracking-[0.2em] absolute w-full"
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
