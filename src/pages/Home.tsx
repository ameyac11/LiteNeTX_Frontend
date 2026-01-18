import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, ImageIcon, Flame, Server, Database, Zap, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';

const stats = [
  { value: '98%', label: 'Accuracy', icon: Activity },
  { value: '<50ms', label: 'Latency', icon: Zap },
  { value: '2', label: 'Models', icon: Database },
  { value: '100%', label: 'Custom', icon: Sparkles },
];

export default function Home() {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-32">

        {/* Background Effects */}
        <div className="absolute inset-0 -z-20 bg-background" />
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[128px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Content */}
            <div className="text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  PyTorch x React Inference Engine
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-4">
                  Lite<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">NeT</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                  Next-generation neural networks running directly in your browser.
                  Experience <span className="text-foreground font-semibold">real-time classification</span> with zero setup.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] transition-all hover:scale-105">
                  <Link to="/demos">
                    Launch Studio
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full hover:bg-white/5 transition-all">
                  <Link to="/architecture">
                    View Blueprint
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Visual Abstract */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl border border-white/5 backdrop-blur-sm p-8 overflow-hidden">
                {/* Abstract Neural Web Visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-primary/30 to-purple-500/20 rounded-full blur-[64px] animate-pulse" />

                {/* "Floating" Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-20 right-20 p-4 glass-card rounded-2xl border-white/10 shadow-xl"
                >
                  <Flame className="w-8 h-8 text-orange-500 mb-2" />
                  <div className="text-xs text-muted-foreground">Backend</div>
                  <div className="font-bold">FastAPI</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-32 left-10 p-4 glass-card rounded-2xl border-white/10 shadow-xl"
                >
                  <Server className="w-8 h-8 text-blue-500 mb-2" />
                  <div className="text-xs text-muted-foreground">Model Size</div>
                  <div className="font-bold">&lt; 2 MB</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 right-10 p-4 glass-card rounded-2xl border-white/10 shadow-xl"
                >
                  <Database className="w-8 h-8 text-emerald-500 mb-2" />
                  <div className="text-xs text-muted-foreground">Training</div>
                  <div className="font-bold">PyTorch</div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Floating Stats Dock - Positioned at bottom but part of flow now thanks to padding-bottom on section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center px-4 pointer-events-none"
        >
          <div className="glass-card px-8 py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-12 overflow-x-auto max-w-[90vw] pointer-events-auto">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold leading-none">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
