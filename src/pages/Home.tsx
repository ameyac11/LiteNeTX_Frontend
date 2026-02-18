import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Cpu, MessageSquare, Target, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import HomeScene3D from '@/components/HomeScene3D';
import NeuralNetworkBg from '@/components/NeuralNetworkBg';


const quickLinks = [
  {
    title: 'Model Demos',
    description: 'Run real-time inference directly in your browser with our interactive playground.',
    icon: Box,
    href: '/demos',
    gradient: 'icon-gradient-blue',
    glow: 'group-hover:shadow-slate-500/10',
    border: 'group-hover:border-slate-300 dark:group-hover:border-white/20',
    badge: 'Live',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  },
  {
    title: 'Architecture',
    description: 'Deep dive into the LiteNeTX design — layers, residual blocks, and SE attention.',
    icon: Cpu,
    href: '/architecture',
    gradient: 'icon-gradient-indigo',
    glow: 'group-hover:shadow-slate-500/10',
    border: 'group-hover:border-slate-300 dark:group-hover:border-white/20',
    badge: 'Docs',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  },
  {
    title: 'Contact',
    description: 'Get in touch for collaboration, research inquiries, or feedback.',
    icon: MessageSquare,
    href: '/contact',
    gradient: 'icon-gradient-cyan',
    glow: 'group-hover:shadow-slate-500/10',
    border: 'group-hover:border-slate-300 dark:group-hover:border-white/20',
    badge: 'Open',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  },
];

const features = [
  {
    title: 'Low Parameter Count',
    desc: 'Designed to minimize model size while preserving representational capacity — from 0.43M to 18.88M params.',
    icon: Layers,
    gradient: 'icon-gradient-blue',
    number: '01',
  },
  {
    title: 'High Accuracy',
    desc: 'Achieves 98.93% on FashionMNIST, 96.71% on CIFAR-10, and 91.54% on CIFAR-100.',
    icon: Target,
    gradient: 'icon-gradient-indigo',
    number: '02',
  },
  {
    title: 'CPU-Optimized Inference',
    desc: 'Structured for efficient execution on standard processors with minimal memory overhead.',
    icon: Cpu,
    gradient: 'icon-gradient-cyan',
    number: '03',
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
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">

          {/* Neural Network Background Animation */}
          <NeuralNetworkBg />

          {/* Ambient glow orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/5 dark:bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/6 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 dark:bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            style={{ y, opacity }}
            className="relative z-10 max-w-5xl mx-auto space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-8 backdrop-blur-sm shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                v1.0.0 — Stable Release
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-6 leading-[0.95]"
              >
                LiteNet<span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">TX</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
              >
                A high-performance, custom-built CNN architecture designed for efficiency.
                <span className="hidden md:inline"> Experience real-time inference directly in your browser.</span>
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 border-0 shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <Link to="/demos">
                  Launch Studio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-full border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all backdrop-blur-sm bg-white/60 dark:bg-transparent text-slate-700 dark:text-slate-300">
                <Link to="/architecture">
                  View Architecture
                  <ChevronRight className="ml-1 w-5 h-5 opacity-60" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="flex items-center justify-center gap-8 pt-4"
            >
              {[
                { label: 'Models', value: '3' },
                { label: 'Best Accuracy', value: '98.93%' },
                { label: 'Min Params', value: '0.43M' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 -z-20 h-full w-full bg-white dark:bg-[#09090b] [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link to={link.href} className="block h-full">
                  <div className={`group h-full p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:shadow-2xl ${link.glow} ${link.border} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>

                    {/* Subtle background glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-slate-500/[0.05] dark:to-white/[0.02] pointer-events-none rounded-2xl" />

                    {/* Top row: icon + badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl ${link.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <link.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${link.badgeColor}`}>
                        {link.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                      {link.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-400 dark:text-slate-500" />
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 3D Interactive Section */}
        <section className="py-24 px-4 bg-slate-50/80 dark:bg-[#0c0c0e] border-y border-slate-200 dark:border-white/5 relative overflow-hidden">

          {/* Ambient glow */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Interactive 3D
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Explore the Architecture
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">in 3D Space</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag, rotate, and zoom to understand the spatial relationships between layers.
                A live representation of the neural network topology.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                {['Drag to rotate', 'Scroll to zoom', 'Real-time'].map((tag, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {tag}
                  </div>
                ))}
              </div>

              <Link to="/3d-nn">
                <Button className="rounded-full mt-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 border-0 hover:-translate-y-0.5 transition-all">
                  Open Full 3D View
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-[420px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121214] relative shadow-2xl"
            >
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5"
            >
              Core Principles
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Parameter-Efficient Neural Design
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-slate-500 dark:text-slate-400 leading-relaxed"
            >
              LiteNeTX is trained with GPU acceleration for efficient convergence, then optimized for
              low-latency CPU inference — enabling practical deployment without heavy compute.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                viewport={{ once: true }}
                className="group p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Number watermark */}
                <div className="absolute top-5 right-6 text-5xl font-black text-slate-100 dark:text-white/[0.04] select-none pointer-events-none leading-none">
                  {feature.number}
                </div>

                <div className={`w-11 h-11 rounded-xl ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
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
