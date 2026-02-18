import { motion } from 'framer-motion';
import { Cpu, Network, Zap } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NeuralNetwork3D from '@/components/NeuralNetwork3D';

export default function NeuralNetworkPage() {
  return (
    <PageTransition>
      <div className="h-screen pt-24 pb-20 md:pb-4 bg-black relative overflow-hidden flex flex-col">

        {/* Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_70%)]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Dashboard Header Overlay */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-4 md:px-12 py-3 md:py-6 flex flex-col md:flex-row items-center justify-between pointer-events-none"
        >
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-0.5 md:mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="text-xs font-mono text-emerald-500 tracking-wider">SYSTEM ONLINE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Neural Architecture
            </h1>
          </div>

          {/* Stats — hidden on mobile to save vertical space */}
          <div className="hidden md:flex items-center gap-6 mt-4 md:mt-0 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500/80" />
              <span>Latence: &lt;50ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-500/80" />
              <span>WebGL: 2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500/80" />
              <span>FPS: 60</span>
            </div>
          </div>
        </motion.div>

        {/* Main 3D Viewport - Occupies remaining space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 relative mx-2 md:mx-8 mb-2 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-b from-white/5 to-black/40 backdrop-blur-sm shadow-2xl"
        >
          <NeuralNetwork3D />

          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/20 rounded-tl-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20 rounded-tr-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/20 rounded-bl-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/20 rounded-br-2xl pointer-events-none" />
        </motion.div>

      </div>
    </PageTransition>
  );
}
