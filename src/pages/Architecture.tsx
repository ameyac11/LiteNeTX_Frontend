import { motion } from 'framer-motion';
import { Shirt, ImageIcon, Cpu, Layers, GitBranch, Terminal } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PageTransition from '@/components/PageTransition';

const fashionArchitecture = {
  name: 'LiteGrayCNN',
  layers: [
    { name: 'Input', type: 'Input', shape: '1 × 28 × 28', description: 'Grayscale image' },
    { name: 'conv1', type: 'Conv2d', shape: '32 × 28 × 28', description: '1→32, kernel=3, padding=1' },
    { name: 'ReLU', type: 'Activation', shape: '32 × 28 × 28', description: 'Non-linearity' },
    { name: 'conv2', type: 'Conv2d', shape: '64 × 28 × 28', description: '32→64, kernel=3, padding=1' },
    { name: 'ReLU', type: 'Activation', shape: '64 × 28 × 28', description: 'Non-linearity' },
    { name: 'MaxPool2d', type: 'Pooling', shape: '64 × 14 × 14', description: '2×2 pooling, stride=2' },
    { name: 'Flatten', type: 'Reshape', shape: '12544', description: '64 × 14 × 14 = 12544' },
    { name: 'fc1', type: 'Linear', shape: '4096', description: '12544 → 4096' },
    { name: 'fc2', type: 'Linear', shape: '2048', description: '4096 → 2048' },
    { name: 'fc3', type: 'Linear', shape: '1024', description: '2048 → 1024' },
    { name: 'fc4', type: 'Linear', shape: '10', description: '1024 → 10 (output)' },
  ],
  training: [
    'Data augmentation: Random horizontal flip, rotation',
    'Optimizer: Adam with weight decay',
    'Learning rate: Cosine annealing scheduler',
    'Checkpoint: best_model.pth saved on validation improvement',
    'Early stopping based on validation loss',
  ],
};

const cifarArchitecture = {
  name: 'LiteRGBCNN (ResNet-like)',
  layers: [
    { name: 'Input', type: 'Input', shape: '3 × 32 × 32', description: 'RGB image' },
    { name: 'conv1', type: 'Conv2d', shape: '64 × 32 × 32', description: '3→64, kernel=3, padding=1' },
    { name: 'bn1', type: 'BatchNorm2d', shape: '64 × 32 × 32', description: 'Batch normalization' },
    { name: 'ReLU', type: 'Activation', shape: '64 × 32 × 32', description: 'Non-linearity' },
    { name: 'layer1', type: 'ResidualBlock ×2', shape: '64 × 32 × 32', description: '64→64, identity shortcut' },
    { name: 'layer2', type: 'ResidualBlock ×2', shape: '128 × 16 × 16', description: '64→128, stride=2, conv shortcut' },
    { name: 'layer3', type: 'ResidualBlock ×2', shape: '256 × 8 × 8', description: '128→256, stride=2, conv shortcut' },
    { name: 'layer4', type: 'ResidualBlock ×2', shape: '512 × 4 × 4', description: '256→512, stride=2, conv shortcut' },
    { name: 'AdaptiveAvgPool', type: 'Pooling', shape: '512 × 1 × 1', description: 'Global average pooling' },
    { name: 'Dropout', type: 'Regularization', shape: '512', description: 'p=0.5' },
    { name: 'fc', type: 'Linear', shape: '10', description: '512 → 10 (output)' },
  ],
  residualBlock: [
    'Main path: Conv2d(3×3) → BN → ReLU → Conv2d(3×3) → BN',
    'Shortcut: Identity OR Conv2d(1×1) + BN (if stride≠1 or channels change)',
    'Output: Main + Shortcut → ReLU',
  ],
  training: [
    'Data augmentation: Random crop, horizontal flip, color jitter',
    'Optimizer: SGD with momentum + weight decay',
    'Learning rate: Step decay scheduler',
    'Checkpoint: best_model_cifar.pth saved on validation improvement',
    'Dropout for regularization',
  ],
};

export default function Architecture() {
  return (
    <PageTransition>
      <div className="page-container bg-[url('/grid.svg')] bg-fixed bg-center">
        {/* Technical Grid Overlay using CSS if SVG missing */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-header border-b border-border pb-8 mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4 text-primary font-mono text-sm uppercase tracking-widest">
              <Terminal className="w-4 h-4" />
              <span>System Blueprint</span>
            </div>
            <h1 className="page-title font-mono tracking-tighter">Architecture/Schematics</h1>
            <p className="page-description font-mono text-sm">
              // Technical breakdown of neural network layers and training pipelines
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Fashion Architecture */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group"
            >
              <div className="relative border border-primary/20 bg-background/50 backdrop-blur-md rounded-none md:rounded-lg overflow-hidden">
                {/* Header Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />

                <div className="p-6 border-b border-primary/10 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-mono tracking-tight">{fashionArchitecture.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono uppercase">Target: FashionMNIST</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">V1.0.0</span>
                    </div>
                  </div>
                </div>

                <div className="p-0">
                  {/* Layer List */}
                  <div className="font-mono text-sm">
                    {fashionArchitecture.layers.map((layer, index) => (
                      <div
                        key={index}
                        className="flex items-stretch border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors group/layer"
                      >
                        <div className="w-12 border-r border-border/50 flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                          {index.toString().padStart(2, '0')}
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-primary group-hover/layer:translate-x-1 transition-transform">{layer.name}</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                              {layer.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              {layer.shape}
                            </span>
                            <span className="opacity-50">|</span>
                            <span>{layer.description}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Training Info */}
                  <div className="p-6 bg-muted/10 border-t border-primary/20">
                    <h4 className="font-mono text-sm font-bold mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4" /> Training Hyperparameters
                    </h4>
                    <ul className="space-y-2 font-mono text-xs">
                      {fashionArchitecture.training.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-0.5">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CIFAR Architecture */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group"
            >
              <div className="relative border border-emerald-500/20 bg-background/50 backdrop-blur-md rounded-none md:rounded-lg overflow-hidden">
                {/* Header Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

                <div className="p-6 border-b border-emerald-500/10 bg-emerald-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-mono tracking-tight">{cifarArchitecture.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono uppercase">Target: CIFAR-10</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">RESNET</span>
                    </div>
                  </div>
                </div>

                <div className="p-0">
                  {/* Layer List */}
                  <div className="font-mono text-sm">
                    {cifarArchitecture.layers.map((layer, index) => (
                      <div
                        key={index}
                        className="flex items-stretch border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors group/layer"
                      >
                        <div className="w-12 border-r border-border/50 flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                          {index.toString().padStart(2, '0')}
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-emerald-500 group-hover/layer:translate-x-1 transition-transform">{layer.name}</span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                              {layer.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              {layer.shape}
                            </span>
                            <span className="opacity-50">|</span>
                            <span>{layer.description}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Residual Block Info */}
                  <div className="p-4 border-t border-border/50 bg-secondary/10">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="residual" className="border-emerald-500/20">
                        <AccordionTrigger className="font-mono text-xs hover:text-emerald-500 py-2">
                          <span className="flex items-center gap-2">
                            <GitBranch className="w-3 h-3" /> Residual Block Logic
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 font-mono text-xs pl-5 border-l border-emerald-500/20 ml-1.5">
                            {cifarArchitecture.residualBlock.map((item, i) => (
                              <li key={i} className="text-muted-foreground">{item}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>


                  {/* Training Info */}
                  <div className="p-6 bg-muted/10 border-t border-emerald-500/20">
                    <h4 className="font-mono text-sm font-bold mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4" /> Training Hyperparameters
                    </h4>
                    <ul className="space-y-2 font-mono text-xs">
                      {cifarArchitecture.training.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-emerald-500 mt-0.5">›</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
