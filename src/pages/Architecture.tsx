import { motion } from 'framer-motion';
import {
  Shirt,
  ImageIcon,
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
  Settings
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import PageTransition from '@/components/PageTransition';

const fashionArchitecture = {
  name: 'LiteGrayCNN',
  id: 'fashion',
  icon: Shirt,
  color: 'blue',
  layers: [
    { name: 'Input', type: 'Input', shape: '1 × 28 × 28', description: 'Grayscale image', icon: Box },
    { name: 'conv1', type: 'Conv2d', shape: '32 × 28 × 28', description: '1→32, kernel=3, padding=1', icon: Layers },
    { name: 'ReLU', type: 'Activation', shape: '32 × 28 × 28', description: 'Non-linearity', icon: Zap },
    { name: 'conv2', type: 'Conv2d', shape: '64 × 28 × 28', description: '32→64, kernel=3, padding=1', icon: Layers },
    { name: 'ReLU', type: 'Activation', shape: '64 × 28 × 28', description: 'Non-linearity', icon: Zap },
    { name: 'MaxPool2d', type: 'Pooling', shape: '64 × 14 × 14', description: '2×2 pooling, stride=2', icon: ArrowRight },
    { name: 'Flatten', type: 'Reshape', shape: '12544', description: '64 × 14 × 14 = 12544', icon: Box },
    { name: 'fc1', type: 'Linear', shape: '512', description: '12544 → 512', icon: GitBranch },
    { name: 'fc2', type: 'Linear', shape: '128', description: '512 → 128', icon: GitBranch },
    { name: 'fc3', type: 'Linear', shape: '10', description: '128 → 10 (output)', icon: Activity },
  ],
  specs: [
    { label: 'Parameters', value: '6.5M' },
    { label: 'Model Size', value: '26 MB' },
    { label: 'Input Size', value: '28x28px' },
    { label: 'Depth', value: '6 Layers' },
  ],
  training: [
    'Data augmentation: Random horizontal flip, rotation',
    'Optimizer: Adam with weight decay',
    'Learning rate: Cosine annealing scheduler',
    'Checkpoint: best_model.pth saved on validation improvement',
    'Early stopping based on validation loss',
  ]
};

const cifarArchitecture = {
  name: 'LiteRGBCNN',
  id: 'cifar',
  icon: ImageIcon,
  color: 'emerald',
  layers: [
    { name: 'Input', type: 'Input', shape: '3 × 32 × 32', description: 'RGB image', icon: Box },
    { name: 'conv1', type: 'Conv2d', shape: '64 × 32 × 32', description: '3→64, kernel=3, padding=1', icon: Layers },
    { name: 'bn1', type: 'BatchNorm2d', shape: '64 × 32 × 32', description: 'Batch normalization', icon: Settings },
    { name: 'ReLU', type: 'Activation', shape: '64 × 32 × 32', description: 'Non-linearity', icon: Zap },
    { name: 'layer1', type: 'ResidualBlock ×2', shape: '64 × 32 × 32', description: '64→64, identity shortcut', icon: Box },
    { name: 'layer2', type: 'ResidualBlock ×2', shape: '128 × 16 × 16', description: '64→128, stride=2, conv shortcut', icon: Box },
    { name: 'layer3', type: 'ResidualBlock ×2', shape: '256 × 8 × 8', description: '128→256, stride=2, conv shortcut', icon: Box },
    { name: 'layer4', type: 'ResidualBlock ×2', shape: '512 × 4 × 4', description: '256→512, stride=2, conv shortcut', icon: Box },
    { name: 'AdaptiveAvgPool', type: 'Pooling', shape: '512 × 1 × 1', description: 'Global average pooling', icon: ArrowRight },
    { name: 'Dropout', type: 'Regularization', shape: '512', description: 'p=0.5', icon: Zap },
    { name: 'fc', type: 'Linear', shape: '10', description: '512 → 10 (output)', icon: Activity },
  ],
  specs: [
    { label: 'Parameters', value: '11.2M' },
    { label: 'Model Size', value: '42 MB' },
    { label: 'Input Size', value: '32x32px' },
    { label: 'Depth', value: '18 Layers' },
  ],
  training: [
    'Data augmentation: Random crop, horizontal flip, color jitter',
    'Optimizer: SGD with momentum + weight decay',
    'Learning rate: Step decay scheduler',
    'Checkpoint: best_model_cifar.pth saved on validation improvement',
    'Dropout for regularization',
  ]
};

const ArchitectureDisplay = ({ data }: { data: typeof fashionArchitecture }) => {
  const isCifar = data.id === 'cifar';
  const primaryColor = isCifar ? 'text-emerald-500' : 'text-blue-500';
  const bgSoft = isCifar ? 'bg-emerald-500/10' : 'bg-blue-500/10';
  const borderSoft = isCifar ? 'border-emerald-500/20' : 'border-blue-500/20';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.specs.map((spec, i) => (
          <Card key={i} className="bg-background/40 backdrop-blur border-border/50 overflow-hidden relative group">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isCifar ? 'bg-emerald-500/5' : 'bg-blue-500/5'}`} />
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</span>
              <span className={`text-xl md:text-2xl font-bold font-mono ${primaryColor}`}>{spec.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-background/50 backdrop-blur-md border-border/50 h-[600px] flex flex-col relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${isCifar ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`} />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className={`w-5 h-5 ${primaryColor}`} />
                <CardTitle className="font-mono text-lg">Layer Configuration</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs">Sequential</Badge>
            </div>
            <CardDescription>Forward pass processing pipeline</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 py-2 architecture-scrollbar">
              <div className="relative border-l border-border/30 ml-3 my-4 space-y-0">
                {data.layers.map((layer, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index}
                    className="relative pl-8 pb-8 last:pb-0 group"
                  >
                    {/* Connector Line Dot */}
                    <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 ${isCifar ? 'border-emerald-500 bg-background group-hover:bg-emerald-500' : 'border-blue-500 bg-background group-hover:bg-blue-500'} transition-colors z-10`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-transparent hover:border-border/50 hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md bg-secondary/50 ${primaryColor}`}>
                          <layer.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-sm">{layer.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase">{layer.type}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">{layer.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <code className="text-xs bg-black/20 px-2 py-1 rounded text-muted-foreground font-mono block sm:inline-block">
                          {layer.shape}
                        </code>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-md border-border/50 flex flex-col h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className={`w-5 h-5 ${primaryColor}`} />
              <CardTitle className="font-mono text-lg">Training Config</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.training.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm group">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${isCifar ? 'bg-emerald-500/50 group-hover:bg-emerald-500' : 'bg-blue-500/50 group-hover:bg-blue-500'} transition-colors shrink-0`} />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
              </div>
            ))}

            {isCifar && (
              <>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <GitBranch className="w-3 h-3" /> Residual Logic
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-2 font-mono bg-black/20 p-3 rounded-md border border-white/5">
                    <p>Main: Conv3x3 → BN → ReLU → Conv3x3 → BN</p>
                    <p>Skip: Identity (or Conv1x1 if stride&gt;1)</p>
                    <p>Out: ReLU(Main + Skip)</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className={`${bgSoft} border-t ${borderSoft} p-4`}>
            <div className="flex items-center gap-2 w-full">
              <Database className="w-4 h-4 opacity-50" />
              <span className="text-xs font-mono opacity-70">
                {isCifar ? 'Dataset: CIFAR-10' : 'Dataset: FashionMNIST'}
              </span>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default function Architecture() {
  return (
    <PageTransition>
      <div className="page-container relative overflow-hidden">
        {/* Modern grid background with fade mask */}
        <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono mb-6 border border-primary/20">
              <Terminal className="w-3 h-3" />
              <span>SYSTEM ARCHITECTURE V2.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Neural Schematics
            </h1>
            <p className="text-muted-foreground text-lg">
              Detailed breakdown of the convolutional neural networks powering the classification engine.
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
                  LiteGrayCNN
                </TabsTrigger>
                <TabsTrigger
                  value="cifar"
                  className="rounded-full px-6 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-mono text-sm transition-all"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  LiteRGBCNN
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="fashion" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ArchitectureDisplay data={fashionArchitecture} />
            </TabsContent>

            <TabsContent value="cifar" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ArchitectureDisplay data={cifarArchitecture} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
