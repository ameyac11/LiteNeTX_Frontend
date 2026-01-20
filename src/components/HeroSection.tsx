import { motion } from 'framer-motion';
import { ArrowRight, Shirt, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container-custom pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <span className="w-2 h-2 rounded-full gradient-bg animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Custom CNN Models Built from Scratch
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">Lite</span><span className="gradient-text">NeT</span>
            <br />
            <span className="text-foreground">Custom CNN Models for</span>
            <br />
            <span className="text-foreground">Image Classification</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Two lightweight CNNs implemented from scratch.
            Experience the power of deep learning running directly in your browser.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="gradient-bg hover:opacity-90 transition-opacity group">
              <a href="#demo-fashion" className="flex items-center gap-2">
                <Shirt className="w-5 h-5" />
                Try Fashion Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <a href="#demo-cifar" className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Try CIFAR Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border"
          >
            {[
              { value: '2', label: 'CNN Models' },
              { value: '20', label: 'Total Classes' },
              { value: '<50ms', label: 'Inference Time' },
              { value: '95%+', label: 'Accuracy' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
