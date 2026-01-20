import { motion } from 'framer-motion';
import { Shirt, ImageIcon, CheckCircle2, Cpu, Database, Zap, FileCode, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';

const models = [
  {
    name: 'LiteNet-Fashion',
    id: 'fashion',
    icon: Shirt,
    dataset: 'FashionMNIST',
    inputSize: '28×28',
    channels: 1,
    classes: 10,
    endpoint: '/predict/fashion',
    modelFile: 'best_model.pth',
    useCase: 'Grayscale Fashion Item Classification',
    color: 'from-blue-500 to-cyan-500',
    accent: 'text-blue-400',
    description: 'A highly optimized CNN designed for single-channel fashion article recognition. Achieving 90%+ accuracy with minimal parameter count.'
  },
  {
    name: 'LiteNet-CIFAR',
    id: 'cifar',
    icon: ImageIcon,
    dataset: 'CIFAR-10',
    inputSize: '32×32',
    channels: 3,
    classes: 10,
    endpoint: '/predict/cifar',
    modelFile: 'best_model_cifar.pth',
    useCase: 'Complex RGB Object Classification',
    color: 'from-emerald-500 to-teal-500',
    accent: 'text-emerald-400',
    description: 'ResNet-inspired architecture capable of distinguishing between animals and vehicles in full color with low latency.'
  },
];

const comparisonData = [
  { property: 'Dataset', fashion: 'FashionMNIST', cifar: 'CIFAR-10' },
  { property: 'Input Shape', fashion: '28×28 (1 channel)', cifar: '32×32 (3 channels)' },
  { property: 'Architecture Type', fashion: 'Standard CNN', cifar: 'ResNet-like' },
  { property: 'Model Size', fashion: '26 MB', cifar: '42 MB' },
  { property: 'Inference Time', fashion: '~15ms', cifar: '~35ms' },
  { property: 'Training Epochs', fashion: '50', cifar: '100+' },
];

export default function Models() {
  return (
    <PageTransition>
      <div className="page-container relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 p-20 opacity-20 pointer-events-none">
          <div className="w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-header mb-16"
          >
            <h1 className="page-title text-5xl font-bold">Model Catalog</h1>
            <p className="page-description text-xl max-w-3xl mx-auto">
              Production-ready neural networks optimized for browser-based inference.
            </p>
          </motion.div>

          {/* Model Showcase Cards */}
          <div className="space-y-24 mb-32">
            {models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                {/* Visual Side */}
                <div className="w-full lg:w-1/2">
                  <div className={`relative rounded-3xl overflow-hidden aspect-video group shadow-2xl border border-white/10 bg-gradient-to-br ${model.color} p-1`}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] group-hover:bg-black/20 transition-all duration-500" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse`} />
                        <model.icon className="w-32 h-32 text-white relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-400' : 'bg-emerald-400'} animate-pulse`} />
                        <span className="text-xs font-mono font-medium text-white/90">LIVE</span>
                      </div>
                      <div className="text-xs font-mono text-white/60 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        v1.0.0
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-3">{model.name}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                        <Database className="w-4 h-4" /> Dataset
                      </div>
                      <div className="font-semibold">{model.dataset}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                        <Layers className="w-4 h-4" /> Input
                      </div>
                      <div className="font-semibold">{model.inputSize}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button asChild size="lg" className={`rounded-full px-8 shadow-lg transition-transform hover:scale-105 bg-gradient-to-r ${model.color}`}>
                      <Link to="/demos">
                        Run Inference <Zap className="w-4 h-4 ml-2 fill-current" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                      <Link to="/architecture">
                        Specs <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical Specs Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-8 border-b border-border">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Cpu className="w-6 h-6 text-primary" />
                Technical Specifications Comparison
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-muted-foreground">Feature</th>
                    <th className="text-left p-6 font-bold text-blue-400">LiteNet-Fashion</th>
                    <th className="text-left p-6 font-bold text-emerald-400">LiteNet-CIFAR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/50 transition-colors">
                      <td className="p-6 font-medium text-foreground/80">{row.property}</td>
                      <td className="p-6 font-mono text-sm">{row.fashion}</td>
                      <td className="p-6 font-mono text-sm">{row.cifar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">All models optimized for WebGL / CPU fallback</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
