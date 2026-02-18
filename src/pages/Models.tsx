import { motion } from 'framer-motion';
import { Shirt, ImageIcon, Grid3X3, CheckCircle2, Cpu, Database, Zap, Layers, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';

const models = [
  {
    name: 'LiteNeTX-FMNIST',
    id: 'fashion',
    icon: Shirt,
    dataset: 'FashionMNIST',
    inputSize: '28×28',
    channels: 1,
    classes: 10,
    params: '0.43M',
    modelSize: '1.63 MB',
    convLayers: 6,
    accuracy: '98.93%',
    endpoint: '/predict/fashion',
    useCase: 'Grayscale Fashion Item Classification',
    gradient: 'from-blue-500 to-cyan-500',
    iconGradient: 'icon-gradient-blue',
    accentText: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/20',
    description: 'A compact CNN with strided-conv downsampling designed for single-channel fashion recognition. Achieves 98.93% accuracy with just 426K parameters.',
    architecture: 'Compact CNN',
  },
  {
    name: 'LiteNeTX-CIFAR10',
    id: 'cifar',
    icon: ImageIcon,
    dataset: 'CIFAR-10',
    inputSize: '32×32',
    channels: 3,
    classes: 10,
    params: '1.90M',
    modelSize: '7.26 MB',
    convLayers: 13,
    accuracy: '96.71%',
    endpoint: '/predict/cifar',
    useCase: 'RGB Object Classification',
    gradient: 'from-emerald-500 to-teal-500',
    iconGradient: 'icon-gradient-emerald',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    description: 'Custom Residual architecture with 6 residual blocks and progressive channel widening (32→192). 96.71% accuracy on CIFAR-10.',
    architecture: 'Custom Residual',
  },
  {
    name: 'LiteNeTX-CIFAR100',
    id: 'cifar100',
    icon: Grid3X3,
    dataset: 'CIFAR-100',
    inputSize: '32×32',
    channels: 3,
    classes: 100,
    params: '18.88M',
    modelSize: '72.14 MB',
    convLayers: 23,
    accuracy: '91.54%',
    endpoint: '/predict/cifar100',
    useCase: 'Fine-Grained 100-Class Classification',
    gradient: 'from-purple-500 to-fuchsia-500',
    iconGradient: 'icon-gradient-purple',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
    description: 'PreAct Wide SE-ResNet with wider basic blocks, SE attention, and stochastic depth. 11 residual blocks optimized for CIFAR-100.',
    architecture: 'PreAct Wide SE-ResNet',
  },
];

const comparisonData = [
  { property: 'Dataset', values: ['FashionMNIST', 'CIFAR-10', 'CIFAR-100'] },
  { property: 'Input Shape', values: ['1×28×28', '3×32×32', '3×32×32'] },
  { property: 'Architecture', values: ['Compact CNN', 'Custom Residual', 'PreAct Wide SE-ResNet'] },
  { property: 'Parameters', values: ['0.43M', '1.90M', '18.88M'] },
  { property: 'Model Size', values: ['1.63 MB', '7.26 MB', '72.14 MB'] },
  { property: 'Conv Layers', values: ['6', '13', '23'] },
  { property: 'Accuracy', values: ['98.93%', '96.71%', '91.54%'] },
];

const accentColors = ['text-blue-400', 'text-emerald-400', 'text-purple-400'];

export default function Models() {
  return (
    <PageTransition>
      <div className="page-container relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-header mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5">
              3 Production Models
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Model Catalog</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Three production-ready neural networks optimized for real-time inference.
            </p>
          </motion.div>

          {/* Model Cards */}
          <div className="space-y-20 mb-32">
            {models.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                {/* Visual card */}
                <div className="w-full lg:w-1/2">
                  <div className={`relative rounded-3xl overflow-hidden aspect-video group shadow-2xl border border-white/10 bg-gradient-to-br ${model.gradient} p-px`}>
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-500 rounded-3xl" />

                    {/* Floating icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <model.icon className="w-28 h-28 text-white relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]" />
                      </div>
                    </div>

                    {/* Bottom badges */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-400' : index === 1 ? 'bg-emerald-400' : 'bg-purple-400'} animate-pulse`} />
                        <span className="text-xs font-mono font-medium text-white/90">LIVE</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-mono text-white/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          {model.params} params
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-mono font-semibold text-green-400">{model.accuracy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="w-full lg:w-1/2 space-y-7">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${model.accentBg} ${model.accentBorder} ${model.accentText}`}>
                      {model.architecture}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{model.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{model.description}</p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Database, label: 'Dataset', value: model.dataset },
                      { icon: Layers, label: 'Input', value: `${model.inputSize} × ${model.channels}ch` },
                      { icon: Cpu, label: 'Conv Layers', value: model.convLayers },
                      { icon: TrendingUp, label: 'Accuracy', value: model.accuracy },
                    ].map((stat, si) => (
                      <div key={si} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${model.iconGradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{stat.label}</div>
                          <div className="font-semibold text-sm text-slate-900 dark:text-white">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <Button asChild size="lg" className="rounded-full px-7 shadow-lg transition-all hover:-translate-y-0.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 border-0">
                      <Link to="/demos">
                        Run Inference <Zap className="w-4 h-4 ml-2 fill-current" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full px-7 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20">
                      <Link to="/architecture">
                        Specs <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-xl"
          >
            <div className="p-7 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl icon-gradient-blue flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                Technical Specifications
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Side-by-side comparison</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-white/[0.02]">
                  <tr>
                    <th className="text-left p-5 font-semibold text-slate-400 dark:text-slate-500 text-sm">Feature</th>
                    <th className="text-left p-5 font-bold text-blue-500 text-sm">FMNIST</th>
                    <th className="text-left p-5 font-bold text-emerald-500 text-sm">CIFAR-10</th>
                    <th className="text-left p-5 font-bold text-purple-500 text-sm">CIFAR-100</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-medium text-slate-600 dark:text-slate-400 text-sm">{row.property}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className={`p-5 font-mono text-sm font-medium ${accentColors[i]}`}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Footer badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">All models optimized for CPU inference</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
