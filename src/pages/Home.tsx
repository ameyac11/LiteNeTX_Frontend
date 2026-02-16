import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, ImageIcon, Flame, Server, Database, Zap, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';

const stats = [
  { value: '99%', label: 'Accuracy', icon: Activity },
  { value: '<50ms', label: 'Latency', icon: Zap },
  { value: '3', label: 'Models', icon: Database },
  { value: '100%', label: 'Custom', icon: Sparkles },
];

export default function Home() {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-6">

        {/* Background Effects */}
        <div className="absolute inset-0 -z-20 bg-background" />


        <div className="container-custom relative z-10 flex-1 flex flex-col justify-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Content */}
            <div className="text-left space-y-6">
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

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-3">
                  <span className="text-foreground">LiteNet</span><span className="text-primary">TX</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Custom-built CNN from scratch running directly in your browser.
                  Experience <span className="text-foreground font-semibold">real-time classification</span> with zero setup.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Button asChild size="lg" className="h-12 px-7 text-base rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] transition-all hover:scale-105">
                  <Link to="/demos">
                    Launch Studio
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base rounded-full hover:bg-white/5 transition-all">
                  <Link to="/3d-nn">
                    Explore 3D View
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Visual Abstract */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[350px] lg:h-[500px] min-h-[350px] lg:min-h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm p-4 lg:p-8 overflow-hidden">
                {/* Neural Network Background Image */}
                <div className="absolute inset-0">
                  <img
                    src="/Home_background_card_compressed.jpg"
                    alt="Neural Network"
                    className="w-full h-full object-cover opacity-80"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>


                {/* \"Floating\" Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 lg:top-20 lg:right-20 p-3 lg:p-4 glass-card rounded-2xl border-white/10"
                >
                  <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500 mb-2" />
                  <div className="text-xs text-muted-foreground">Backend</div>
                  <div className="font-bold text-sm lg:text-base">FastAPI</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-4 left-4 lg:bottom-32 lg:left-10 p-3 lg:p-4 glass-card rounded-2xl border-white/10"
                >
                  <Server className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 mb-2" />
                  <div className="text-xs text-muted-foreground">Model Size</div>
                  <div className="font-bold text-sm lg:text-base">1.6-56 MB</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-4 right-4 lg:bottom-20 lg:right-10 p-3 lg:p-4 glass-card rounded-2xl border-white/10"
                >
                  <Database className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-500 mb-2" />
                  <div className="text-xs text-muted-foreground">Training</div>
                  <div className="font-bold text-sm lg:text-base">PyTorch</div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Stats Section - Cards on mobile, horizontal bar on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="container-custom relative z-10 mt-4 px-4"
        >
          {/* Mobile: Grid of Cards */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto lg:hidden">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold leading-none">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Horizontal Bar */}
          <div className="hidden lg:flex glass-card px-6 py-3 rounded-full border border-white/10 items-center gap-10 mx-auto w-fit">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5 shrink-0">
                <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold leading-none">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
