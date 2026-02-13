import { motion } from 'framer-motion';
import {
  Shirt,
  ImageIcon,
  Grid3X3,
  Cpu,
  Layers,
  GitBranch,
  Terminal,
  Activity,
  Box,
  ArrowRight,
  Zap,
  Database,
  Code2,
  Settings,
  Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import PageTransition from '@/components/PageTransition';

const fashionArchitecture = {
  name: 'LiteNeTX_Base_CNN_FashionMNIST',
  id: 'fashion',
  icon: Shirt,
  color: 'blue',
  layers: [
    { name: 'Input', type: 'Input', shape: '1 × 28 × 28', description: 'Grayscale image', icon: Box },
    { name: 'conv1 + bn1', type: 'Conv2d+BN', shape: '32 × 28 × 28', description: '1→32, 3×3, bias=False + BN + ReLU', icon: Layers },
    { name: 'conv2 + bn2', type: 'Conv2d+BN', shape: '64 × 28 × 28', description: '32→64, 3×3, bias=False + BN + ReLU', icon: Layers },
    { name: 'Dropout2d', type: 'Regularization', shape: '64 × 28 × 28', description: 'p=0.1', icon: Shield },
    { name: 'conv_down1 + bn_down1', type: 'StridedConv', shape: '64 × 14 × 14', description: '64→64, 3×3, stride=2 + BN + ReLU', icon: ArrowRight },
    { name: 'conv3 + bn3', type: 'Conv2d+BN', shape: '128 × 14 × 14', description: '64→128, 3×3, bias=False + BN + ReLU', icon: Layers },
    { name: 'conv4 + bn4', type: 'Conv2d+BN', shape: '128 × 14 × 14', description: '128→128, 3×3, bias=False + BN + ReLU', icon: Layers },
    { name: 'Dropout2d', type: 'Regularization', shape: '128 × 14 × 14', description: 'p=0.15', icon: Shield },
    { name: 'conv_down2 + bn_down2', type: 'StridedConv', shape: '128 × 7 × 7', description: '128→128, 3×3, stride=2 + BN + ReLU', icon: ArrowRight },
    { name: 'AdaptiveAvgPool', type: 'Pooling', shape: '128 × 1 × 1', description: 'Global average pooling', icon: ArrowRight },
    { name: 'Dropout', type: 'Regularization', shape: '128', description: 'p=0.4', icon: Shield },
    { name: 'fc', type: 'Linear', shape: '10', description: '128 → 10 (output)', icon: Activity },
  ],
  specs: [
    { label: 'Parameters', value: '426,602' },
    { label: 'Model Size', value: '1.63 MB' },
    { label: 'Input Size', value: '28×28' },
    { label: 'Conv Layers', value: '6' },
  ],
  training: [
    'SGD with momentum',
    'Cosine annealing scheduler',
    'Mixed precision training',
    'Optimized for stable convergence',
  ]
};

const cifarArchitecture = {
  name: 'LiteNeTX_Base_CNN_C10',
  id: 'cifar',
  icon: ImageIcon,
  color: 'emerald',
  layers: [
    { name: 'Input', type: 'Input', shape: '3 × 32 × 32', description: 'RGB image', icon: Box },
    { name: 'conv1 + bn1', type: 'Conv2d+BN', shape: '32 × 32 × 32', description: '3→32, 3×3, bias=False + BN + ReLU', icon: Layers },
    { name: 'stage1', type: 'ResidualBlock ×2', shape: '64 × 32 × 32', description: '32→64, stride=1, identity shortcut', icon: Box },
    { name: 'stage2', type: 'ResidualBlock ×2', shape: '128 × 16 × 16', description: '64→128, stride=2, conv shortcut', icon: Box },
    { name: 'stage3', type: 'ResidualBlock ×2', shape: '192 × 8 × 8', description: '128→192, stride=2, conv shortcut', icon: Box },
    { name: 'Dropout2d', type: 'Regularization', shape: '192 × 8 × 8', description: 'p=0.1', icon: Shield },
    { name: 'AdaptiveAvgPool', type: 'Pooling', shape: '192 × 1 × 1', description: 'Global average pooling', icon: ArrowRight },
    { name: 'Dropout', type: 'Regularization', shape: '192', description: 'p=0.2', icon: Shield },
    { name: 'fc', type: 'Linear', shape: '10', description: '192 → 10 (output)', icon: Activity },
  ],
  specs: [
    { label: 'Parameters', value: '1,903,146' },
    { label: 'Model Size', value: '7.26 MB' },
    { label: 'Input Size', value: '32×32' },
    { label: 'Conv Layers', value: '13' },
  ],
  training: [
    'SGD with momentum',
    'Cosine annealing scheduler',
    'Mixed precision training',
    'Optimized for stable convergence',
  ]
};

const cifar100Architecture = {
  name: 'LiteNeTX_Base_CNN_C100',
  id: 'cifar100',
  icon: Grid3X3,
  color: 'purple',
  layers: [
    { name: 'Input', type: 'Input', shape: '3 × 32 × 32', description: 'RGB image', icon: Box },
    { name: 'conv1 + bn1', type: 'Conv2d+BN', shape: '64 × 32 × 32', description: '3→64, 3×3, bias=False + BN + ReLU', icon: Layers },
    { name: 'stage1', type: 'PreActBottleneckSE ×3', shape: '256 × 32 × 32', description: 'mid=64, out=256, SE(r=16), drop=5%', icon: Box },
    { name: 'stage2', type: 'PreActBottleneckSE ×12', shape: '512 × 16 × 16', description: 'mid=128, out=512, SE(r=16), drop=10%', icon: Box },
    { name: 'stage3', type: 'PreActBottleneckSE ×8', shape: '1024 × 8 × 8', description: 'mid=256, out=1024, SE(r=16), drop=15%', icon: Box },
    { name: 'final_bn', type: 'BatchNorm2d', shape: '1024 × 8 × 8', description: 'Final batch normalization + ReLU', icon: Settings },
    { name: 'AdaptiveAvgPool', type: 'Pooling', shape: '1024 × 1 × 1', description: 'Global average pooling', icon: ArrowRight },
    { name: 'Dropout', type: 'Regularization', shape: '1024', description: 'p=0.3', icon: Shield },
    { name: 'fc', type: 'Linear', shape: '100', description: '1024 → 100 (output)', icon: Activity },
  ],
  specs: [
    { label: 'Parameters', value: '14,579,492' },
    { label: 'Model Size', value: '55.62 MB' },
    { label: 'Input Size', value: '32×32' },
    { label: 'Conv Layers', value: '70' },
  ],
  training: [
    'SGD with momentum',
    'Cosine annealing scheduler',
    'Mixed precision training',
    'Advanced data augmentation',
    'Optimized for stable convergence',
  ]
};

type ArchData = typeof fashionArchitecture;

const ArchitectureDisplay = ({ data }: { data: ArchData }) => {
  const colorMap: Record<string, { primary: string; bgSoft: string; borderSoft: string; gradient: string }> = {
    blue: { primary: 'text-blue-500', bgSoft: 'bg-blue-500/10', borderSoft: 'border-blue-500/20', gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    emerald: { primary: 'text-emerald-500', bgSoft: 'bg-emerald-500/10', borderSoft: 'border-emerald-500/20', gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    purple: { primary: 'text-purple-500', bgSoft: 'bg-purple-500/10', borderSoft: 'border-purple-500/20', gradient: 'bg-gradient-to-r from-purple-500 to-fuchsia-500' },
  };
  const c = colorMap[data.color] || colorMap.blue;

  return (
    <div className="space-y-6">
      {/* Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.specs.map((spec, i) => (
          <Card key={i} className="bg-background/40 backdrop-blur border-border/50 overflow-hidden relative group">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.bgSoft}`} />
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</span>
              <span className={`text-xl md:text-2xl font-bold font-mono ${c.primary}`}>{spec.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Architecture Overview (Protected) */}
        <Card className="lg:col-span-2 bg-background/50 backdrop-blur-md border-border/50 h-[400px] flex flex-col relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${c.gradient}`} />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className={`w-5 h-5 ${c.primary}`} />
                <CardTitle className="font-mono text-lg">Architecture Overview</CardTitle>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border/50">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Proprietary</span>
              </div>
            </div>
            <CardDescription>High-level design philosophy and capabilities</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">

            {/* Background Tech Pattern */}
            <div className={`absolute inset-0 ${c.bgSoft} opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]`} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

            <div className="relative z-10 max-w-lg mx-auto">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${c.bgSoft} border ${c.borderSoft}`}>
                <data.icon className={`w-8 h-8 ${c.primary}`} />
              </div>

              <h3 className="text-xl font-bold mb-3">
                {data.id === 'fashion' && 'Optimized Grayscale CNN'}
                {data.id === 'cifar' && 'Lightweight Residual Network'}
                {data.id === 'cifar100' && 'Deep SE-CNN Architecture'}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {data.id === 'fashion' && 'A highly efficient 6-layer convolutional neural network designed specifically for single-channel fashion item classification. Features strategic stride-based downsampling and adaptive regularization.'}
                {data.id === 'cifar' && 'Advanced residual architecture featuring 3 processing stages with skip connections. Balances depth and efficiency to capture complex color patterns in 32x32 RGB space without vanishing gradients.'}
                {data.id === 'cifar100' && 'State-of-the-art bottleneck architecture enhanced with Squeeze-and-Excitation attention modules. Dynamically recalibrates channel-wise feature responses to distinguish between 100 fine-grained object classes.'}
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {data.id === 'fashion' && ['Conv2d', 'BatchNorm', 'Dropout', 'SGD'].map((tag, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-xs">{tag}</Badge>
                ))}
                {data.id === 'cifar' && ['ResBlock', 'Skip Connections', 'Cosine Annealing', 'AMP'].map((tag, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-xs">{tag}</Badge>
                ))}
                {data.id === 'cifar100' && ['SE-Attention', 'Bottleneck', 'CutMix', 'AutoAugment'].map((tag, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Config */}
        <Card className="bg-background/50 backdrop-blur-md border-border/50 flex flex-col h-[400px]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className={`w-5 h-5 ${c.primary}`} />
              <CardTitle className="font-mono text-lg">Training Protocol</CardTitle>
            </div>
            <CardDescription>Hyperparameters & optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-4">
                {data.training.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm group">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${data.color === 'emerald' ? 'bg-emerald-500/50 group-hover:bg-emerald-500' : data.color === 'purple' ? 'bg-purple-500/50 group-hover:bg-purple-500' : 'bg-blue-500/50 group-hover:bg-blue-500'} transition-colors shrink-0`} />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                  </div>
                ))}

                {data.id === 'cifar' && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <GitBranch className="w-3 h-3" /> Core Logic
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Utilizes identity mappings with projection shortcuts to maintain signal propagation across 13 convolutional layers.
                      </p>
                    </div>
                  </>
                )}

                {data.id === 'cifar100' && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Advanced Attention
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        incorporates SE blocks to explicitly model interdependencies between channels, adaptively recalibrating channel-wise feature responses.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Architecture() {
  return (
    <PageTransition>
      <div className="page-container relative overflow-hidden">
        <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-6 border border-primary/20">
              <Terminal className="w-3 h-3" />
              <span>SYSTEM ARCHITECTURE V3.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Neural Schematics
            </h1>
            <p className="text-muted-foreground text-lg">
              Detailed breakdown of all three LiteNeTX architectures powering the classification engine.
            </p>
          </motion.div>

          <Tabs defaultValue="fashion" className="w-full max-w-6xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-background/60 backdrop-blur border border-border/40 p-1 h-auto rounded-full">
                <TabsTrigger
                  value="fashion"
                  className="rounded-full px-6 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white font-mono text-sm transition-all"
                >
                  <Shirt className="w-4 h-4 mr-2" />
                  LiteNeTX-FMNIST
                </TabsTrigger>
                <TabsTrigger
                  value="cifar"
                  className="rounded-full px-6 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-mono text-sm transition-all"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  LiteNeTX-CIFAR10
                </TabsTrigger>
                <TabsTrigger
                  value="cifar100"
                  className="rounded-full px-6 py-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white font-mono text-sm transition-all"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  LiteNeTX-CIFAR100
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="fashion" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ArchitectureDisplay data={fashionArchitecture} />
            </TabsContent>

            <TabsContent value="cifar" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ArchitectureDisplay data={cifarArchitecture} />
            </TabsContent>

            <TabsContent value="cifar100" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ArchitectureDisplay data={cifar100Architecture} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
