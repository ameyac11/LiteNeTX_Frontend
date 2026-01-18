import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Activity } from "lucide-react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        "Initializing Core Systems...",
        "Loading Neural Weights...",
        "Configuring Tensor Layers...",
        "Optimizing GPU Kernels...",
        "LiteNet System Ready."
    ];

    useEffect(() => {
        // Progress timer
        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 5;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, 100);

        // Status text text cycle
        const statusTimer = setInterval(() => {
            setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
        }, 800);

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
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            {/* Dynamic Background Mesh */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[100px] transform -translate-y-1/2" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">

                {/* Central Neural Icon */}
                <div className="relative mb-12">
                    {/* Pulsing rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className="relative bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Network className="w-12 h-12 text-primary" />
                    </motion.div>

                    {/* Orbiting particles */}
                    <motion.div
                        className="absolute -inset-4 border border-primary/20 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-2 h-2 bg-primary rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                    </motion.div>
                </div>

                {/* Brand Name */}
                <motion.h1
                    className="text-4xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    LiteNet
                </motion.h1>

                {/* Progress System */}
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs font-mono text-primary/60 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                            <Activity className="w-3 h-3 animate-pulse" />
                            System Status
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>

                    {/* Premium Progress Line */}
                    <div className="h-[3px] w-full bg-white/10 rounded-full relative overflow-hidden">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                            animate={{ width: `${progress}%` }}
                            initial={{ width: "0%" }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        />
                    </div>

                    {/* Cycling Status Text */}
                    <div className="h-6 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statuses[statusIndex]}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs text-muted-foreground text-center font-mono absolute w-full"
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
