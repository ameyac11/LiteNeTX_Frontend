import { motion } from 'framer-motion';
import { Shirt, ImageIcon, ChevronRight, Cpu, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// --- Data Structures matching backend models ---

const architectures = [
  {
    id: 'fashion',
    name: 'LiteGrayCNN',
    subtitle: 'Fashion-MNIST Classifier',
    version: 'v1.0.0',
    icon: Shirt,
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    bgGradient: 'from-blue-500/5 to-blue-600/10',
    params: '6.5M',
    accuracy: '98.2%',
    layers: [
      { name: 'Input', type: 'Input', shape: '1×28×28', description: 'Grayscale image' },
      { name: 'conv1', type: 'Conv2d', shape: '32×28×28', description: '1→32, kernel=3, padding=1' },
      { name: 'ReLU', type: 'Activation', shape: '32×28×28', description: 'Non-linearity' },
      { name: 'conv2', type: 'Conv2d', shape: '64×28×28', description: '32→64, kernel=3, padding=1' },
      { name: 'ReLU', type: 'Activation', shape: '64×28×28', description: 'Non-linearity' },
      { name: 'MaxPool2d', type: 'Pooling', shape: '64×14×14', description: '2×2, stride=2' },
      { name: 'Flatten', type: 'Reshape', shape: '12544', description: '64×14×14 → 12544' },
      { name: 'fc1', type: 'Linear', shape: '512', description: '12544 → 512' },
      { name: 'ReLU', type: 'Activation', shape: '512', description: 'Non-linearity' },
      { name: 'fc2', type: 'Linear', shape: '128', description: '512 → 128' },
      { name: 'ReLU', type: 'Activation', shape: '128', description: 'Non-linearity' },
      { name: 'fc3', type: 'Linear', shape: '10', description: '128 → 10 classes' },
    ]
  },
  {
    id: 'cifar',
    name: 'LiteRGBCNN',
    subtitle: 'CIFAR-10 ResNet Classifier',
    version: 'ResNet',
    icon: ImageIcon,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    bgGradient: 'from-emerald-500/5 to-emerald-600/10',
    params: '11.2M',
    accuracy: '95.8%',
    layers: [
      { name: 'Input', type: 'Input', shape: '3×32×32', description: 'RGB image' },
      { name: 'conv1', type: 'Conv2d', shape: '64×32×32', description: '3→64, kernel=3, padding=1' },
      { name: 'bn1', type: 'BatchNorm2d', shape: '64×32×32', description: 'Batch normalization' },
      { name: 'ReLU', type: 'Activation', shape: '64×32×32', description: 'Non-linearity' },
      { name: 'layer1', type: 'ResBlock×2', shape: '64×32×32', description: '64→64, identity shortcut' },
      { name: 'layer2', type: 'ResBlock×2', shape: '128×16×16', description: '64→128, stride=2' },
      { name: 'layer3', type: 'ResBlock×2', shape: '256×8×8', description: '128→256, stride=2' },
      { name: 'AvgPool', type: 'Pooling', shape: '256×1×1', description: 'Global average pooling' },
      { name: 'fc', type: 'Linear', shape: '10', description: '256 → 10 classes' },
    ]
  }
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="section-padding pt-32 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Cpu className="w-4 h-4" />
            <span>Model Architecture</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Neural Network <span className="gradient-text">Schematics</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Layer-by-layer breakdown of our custom CNN architectures built from scratch
          </p>
        </motion.div>

        {/* Architecture Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {architectures.map((arch, index) => (
            <motion.div
              key={arch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-3xl border ${arch.borderColor} bg-gradient-to-br ${arch.bgGradient} backdrop-blur-sm overflow-hidden hover:border-opacity-40 transition-all duration-300`}
            >
              {/* Card Header */}
              <div className="p-8 pb-6 border-b border-white/5">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-black/40 ${arch.accentColor} group-hover:scale-110 transition-transform duration-300`}>
                      <arch.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight mb-1">{arch.name}</h3>
                      <p className="text-sm text-muted-foreground">{arch.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${arch.accentColor} border-current font-mono text-xs`}>
                    {arch.version}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Parameters</div>
                    <div className={`text-lg font-bold font-mono ${arch.accentColor}`}>{arch.params}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                    <div className={`text-lg font-bold font-mono ${arch.accentColor}`}>{arch.accuracy}</div>
                  </div>
                </div>
              </div>

              {/* Layers */}
              <div className="p-8 pt-6 max-h-[600px] overflow-y-auto architecture-scrollbar">
                <div className="space-y-2">
                  {arch.layers.map((layer, idx) => (
                    <div
                      key={idx}
                      className="group/layer flex items-start gap-4 p-4 rounded-xl bg-black/20 hover:bg-black/30 border border-white/5 hover:border-white/10 transition-all duration-200"
                    >
                      {/* Layer Number */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${arch.accentColor} bg-current/10 flex items-center justify-center text-xs font-bold`}>
                        {idx.toString().padStart(2, '0')}
                      </div>

                      {/* Layer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`font-semibold ${arch.accentColor}`}>{layer.name}</span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          <Badge variant="secondary" className="text-[10px] bg-white/5">
                            {layer.type}
                          </Badge>
                        </div>
                        <div className="font-mono text-xs text-muted-foreground mb-1">
                          {layer.shape}
                        </div>
                        <div className="text-xs text-muted-foreground/70">
                          {layer.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className={`p-6 border-t border-white/5 bg-black/20 flex items-center justify-between`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="w-3.5 h-3.5" />
                  <span className="font-mono">PyTorch Implementation</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  CPU Inference
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
