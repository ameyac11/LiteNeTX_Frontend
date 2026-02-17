import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Cpu, MessageSquare, Target, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import HomeScene3D from '@/components/HomeScene3D';
import NeuralNetworkBg from '@/components/NeuralNetworkBg';


const quickLinks = [
  {
    title: 'Model Demos',
    description: 'Interactive inference demos.',
    icon: Box,
    href: '/demos',
    color: 'text-blue-500',
  },
  {
    title: 'Architecture',
    description: 'Deep dive into LiteNeTX design.',
    icon: Cpu,
    href: '/architecture',
    color: 'text-indigo-500',
  },
  {
    title: 'Contact',
    description: 'Get in touch for collaboration.',
    icon: MessageSquare,
    href: '/contact',
    color: 'text-cyan-500',
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <PageTransition>
      <div ref={containerRef} className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-white selection:bg-blue-500/20">

        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">

          {/* Neural Network Background Animation */}
          <NeuralNetworkBg />


          <motion.div
            style={{ y, opacity }}
            className="relative z-10 max-w-5xl mx-auto space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                v1.0.0 Stable Release
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-6">
                LiteNet<span className="text-blue-600 dark:text-blue-500">TX</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                A high-performance, custom-built CNN architecture designed for efficiency.
                <span className="hidden md:inline"> Experience real-time inference directly in your browser.</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6"
            >
              <Button asChild size="lg" className="h-14 px-10 text-base font-semibold rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <Link to="/demos">
                  Launch Studio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-10 text-base font-semibold rounded-full border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all backdrop-blur-sm bg-white/50 dark:bg-transparent">
                <Link to="/architecture">
                  View Architecture
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Background Grid Pattern - Made subtler */}
          <div className="absolute inset-0 -z-20 h-full w-full bg-white dark:bg-[#09090b] [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.href}>
                <div className="group h-full p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-900/10">
                  <div className={`w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300 ${link.color}`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    {link.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* 3D Interactive Section */}
        <section className="py-24 px-4 bg-slate-50 dark:bg-[#0c0c0e] border-y border-slate-200 dark:border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Interactive Visualization
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore the neural network architecture in 3D space.
                Drag, rotate, and zoom to understand the spatial relationships between layers.
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Interactive
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Real-time
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121214] relative shadow-lg"
            >
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5">
                Generic Model Representation
              </div>
              <HomeScene3D />
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-2xl"></div>
            </motion.div>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Parameter-Efficient Neural Design
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              LiteNeTX is a convolutional neural network trained using GPU acceleration for efficient convergence and experimentation.
              The final architecture is optimized for low-latency CPU inference, enabling practical deployment without heavy computational requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Low Parameter Count",
                desc: "Designed to minimize model size while preserving representational capacity.",
                icon: Layers,
                color: "text-blue-500"
              },
              {
                title: "High Accuracy",
                desc: "Achieves strong classification performance despite reduced parameter complexity.",
                icon: Target,
                color: "text-indigo-500"
              },
              {
                title: "CPU-Optimized Inference",
                desc: "Structured for efficient execution on standard processors with minimal memory overhead.",
                icon: Cpu,
                color: "text-cyan-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all hover:scale-105 duration-300 shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
