import { motion } from 'framer-motion';
import { Shirt, ImageIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Model Architecture</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detailed breakdown of both CNN architectures with layer-by-layer specifications
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Fashion Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="gradient-bg p-6">
              <div className="flex items-center gap-3">
                <Shirt className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">{fashionArchitecture.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm mt-1">FashionMNIST Classification</p>
            </div>

            <div className="p-6">
              {/* Layer Breakdown */}
              <div className="space-y-3 mb-6">
                {fashionArchitecture.layers.map((layer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">{layer.name}</span>
                        <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">
                          {layer.shape}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{layer.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Training Features Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="training">
                  <AccordionTrigger className="text-sm font-semibold">
                    Training Features
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {fashionArchitecture.training.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>

          {/* CIFAR Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">{cifarArchitecture.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm mt-1">CIFAR-10 Classification</p>
            </div>

            <div className="p-6">
              {/* Layer Breakdown */}
              <div className="space-y-3 mb-6">
                {cifarArchitecture.layers.map((layer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium truncate">{layer.name}</span>
                        <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">
                          {layer.shape}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{layer.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Residual Block & Training Accordions */}
              <Accordion type="single" collapsible>
                <AccordionItem value="residual">
                  <AccordionTrigger className="text-sm font-semibold">
                    Residual Block Structure
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {cifarArchitecture.residualBlock.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="training">
                  <AccordionTrigger className="text-sm font-semibold">
                    Training Features
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {cifarArchitecture.training.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
