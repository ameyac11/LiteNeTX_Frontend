import { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Link2, Link2Off, Layers, Activity, Box, Settings2, Sparkles, MousePointer2, Shirt, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

// Model config blocks
const MODEL_CONFIG = {
  fashion: {
    id: 'fashion',
    name: 'LiteNeTX-FMNIST',
    type: 'LiteGrayCNN',
    description: 'Optimized for high-speed classification of 28x28 grayscale fashion items.',
    layers: [
      { id: 'input', name: 'Input Layer', type: 'Input', nodes: 9, shape: '1×28×28', params: '0', x: -9, color: '#3b82f6', details: 'Raw 28x28 grayscale pixel values. Entry point for fashion item images.' },
      { id: 'conv1', name: 'Conv1 + BN', type: 'Conv2d + BN', nodes: 16, shape: '32×28×28', params: '320', x: -7, color: '#60a5fa', details: 'First convolutional block: 1→32 channels with batch normalization and ReLU activation.' },
      { id: 'conv2', name: 'Conv2 + BN', type: 'Conv2d + BN', nodes: 20, shape: '64×28×28', params: '18,496', x: -5, color: '#818cf8', details: 'Second convolutional block: 32→64 channels with batch normalization and ReLU.' },
      { id: 'down1', name: 'Strided Conv1', type: 'StridedConv + BN', nodes: 16, shape: '64×14×14', params: '36,928', x: -3, color: '#a78bfa', details: 'Strided convolution for downsampling (stride=2), halving spatial dimensions.' },
      { id: 'conv3', name: 'Conv3 + BN', type: 'Conv2d + BN', nodes: 25, shape: '128×14×14', params: '73,856', x: -1, color: '#c084fc', details: 'Third convolutional block: 64→128 channels for deeper feature extraction.' },
      { id: 'down2', name: 'Strided Conv2', type: 'StridedConv + BN', nodes: 16, shape: '128×7×7', params: '147,584', x: 1, color: '#d8b4fe', details: 'Second strided convolution, further reducing spatial size to 7×7.' },
      { id: 'pool', name: 'Global Pool', type: 'AdaptiveAvgPool', nodes: 9, shape: '128×1×1', params: '0', x: 3, color: '#e879f9', details: 'Global average pooling condenses spatial features into a single 128-dim vector.' },
      { id: 'fc', name: 'Classifier', type: 'Linear', nodes: 10, shape: '10', params: '1,290', x: 5, color: '#f0abfc', details: 'Final fully connected layer: 128→10 classes (T-shirt, Trouser, Dress, etc.)' },
    ],
    connections: [
      ['input', 'conv1'], ['conv1', 'conv2'], ['conv2', 'down1'],
      ['down1', 'conv3'], ['conv3', 'down2'], ['down2', 'pool'], ['pool', 'fc'],
    ],
  },
  cifar: {
    id: 'cifar',
    name: 'LiteNeTX-CIFAR10',
    type: 'Custom Residual',
    description: 'Deep Residual Network specialized for 32x32 RGB object recognition.',
    layers: [
      { id: 'input', name: 'Input Layer', type: 'Input', nodes: 9, shape: '3×32×32', params: '0', x: -9, color: '#10b981', details: 'Processes 32x32 color (RGB) images. Each channel represents Red, Green, and Blue intensity values.' },
      { id: 'conv1', name: 'Stem', type: 'Conv2d + BN', nodes: 16, shape: '32×32×32', params: '896', x: -6, color: '#34d399', details: 'Initial convolutional layer: 3→32 channels with batch normalization and ReLU.' },
      { id: 'stage1', name: 'Stage 1', type: 'ResBlock ×2', nodes: 16, shape: '64×32×32', params: '73k', x: -3, color: '#4ade80', isResidual: true, details: 'First residual stage with 2 blocks: 32→64 channels, identity shortcuts for gradient flow.' },
      { id: 'stage2', name: 'Stage 2', type: 'ResBlock ×2', nodes: 25, shape: '128×16×16', params: '295k', x: 0, color: '#2dd4bf', isResidual: true, details: 'Second stage with spatial downsampling: 64→128 channels, stride=2, projection shortcuts.' },
      { id: 'stage3', name: 'Stage 3', type: 'ResBlock ×2', nodes: 36, shape: '192×8×8', params: '885k', x: 3, color: '#22d3ee', isResidual: true, details: 'Final residual stage: 128→192 channels, focusing on high-level semantic features.' },
      { id: 'pool', name: 'Global Pool', type: 'AdaptiveAvgPool', nodes: 9, shape: '192×1×1', params: '0', x: 6, color: '#38bdf8', details: 'Global average pooling produces a 192-dimensional feature vector.' },
      { id: 'fc', name: 'Classifier', type: 'Linear', nodes: 10, shape: '10', params: '1,930', x: 8, color: '#60a5fa', details: 'Final classifier: 192→10 classes (airplane, car, bird, cat, deer, dog, frog, horse, ship, truck).' },
    ],
    connections: [
      ['input', 'conv1'], ['conv1', 'stage1'], ['stage1', 'stage2'],
      ['stage2', 'stage3'], ['stage3', 'pool'], ['pool', 'fc'],
    ],
    residualConnections: [
      ['stage1', 'stage1'], ['stage2', 'stage2'], ['stage3', 'stage3'],
    ],
  },
  cifar100: {
    id: 'cifar100',
    name: 'LiteNeTX-CIFAR100',
    type: 'PreAct Wide SE-ResNet',
    description: 'PreAct Wide SE-ResNet with wider basic blocks and Squeeze-and-Excitation attention for 100-class fine-grained classification.',
    layers: [
      { id: 'input', name: 'Input Layer', type: 'Input', nodes: 9, shape: '3×32×32', params: '0', x: -9, color: '#a855f7', details: 'Raw RGB input. The entry point for 32x32 pixel images.' },
      { id: 'stem', name: 'Stem', type: 'Conv2d + BN', nodes: 16, shape: '64×32×32', params: '1,792', x: -6, color: '#d8b4fe', details: 'Initial processing layer that expands channel depth to 64.' },
      { id: 'stage1', name: 'Stage 1', type: 'PreActBasicSE x4', nodes: 16, shape: '128×32×32', params: '369k', x: -3, color: '#c084fc', isResidual: true, details: 'First block of 4 basic layers with Squeeze-and-Excitation attention and stochastic depth.' },
      { id: 'stage2', name: 'Stage 2', type: 'PreActBasicSE x4', nodes: 25, shape: '256×16×16', params: '1.7M', x: 0, color: '#a855f7', isResidual: true, details: 'Wider processing block with 4 layers, handling spatial downsampling with SE attention.' },
      { id: 'stage3', name: 'Stage 3', type: 'PreActBasicSE x3', nodes: 36, shape: '512×8×8', params: '5.3M', x: 3, color: '#9333ea', isResidual: true, details: 'Final feature extraction stage producing high-level 512-channel features with SE attention.' },
      { id: 'pool', name: 'Global Pool', type: 'AdaptiveAvgPool', nodes: 9, shape: '512×1×1', params: '0', x: 6, color: '#7e22ce', details: 'Condenses spatial information into a single feature vector.' },
      { id: 'fc', name: 'Classifier', type: 'Linear', nodes: 10, shape: '100', params: '51,300', x: 8, color: '#f0abfc', details: 'Final dense layer mapping features to 100 specific object classes.' },
    ],
    connections: [
      ['input', 'stem'], ['stem', 'stage1'], ['stage1', 'stage2'],
      ['stage2', 'stage3'], ['stage3', 'pool'], ['pool', 'fc'],
    ],
    residualConnections: [
      ['stage1', 'stage1'], ['stage2', 'stage2'], ['stage3', 'stage3'],
    ],
  },
};

// Scene component set

function Node({ position, color, hovered, onClick, onHover }: any) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const targetScale = hovered ? 1.3 : 1;
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(false); }}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1 : 0.3}
        roughness={0.3}
        metalness={0.7}
      />
      {hovered && <pointLight color={color} intensity={1.5} distance={2} />}
    </mesh>
  );
}

function Layer({ layer, onNodeClick, hoveredLayer, setHoveredLayer }: any) {
  const nodes = useMemo(() => {
    const positions = [];
    const cols = Math.ceil(Math.sqrt(layer.nodes));
    const rows = Math.ceil(layer.nodes / cols);
    const spacing = 0.4;

    for (let i = 0; i < layer.nodes; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const y = (row - (rows - 1) / 2) * spacing;
      const z = (col - (cols - 1) / 2) * spacing;
      positions.push([layer.x, y, z]);
    }
    return positions;
  }, [layer]);

  const isHovered = hoveredLayer === layer.id;

  return (
    <group>
      {nodes.map((pos, i) => (
        <Node
          key={i}
          position={pos}
          color={layer.color}
          hovered={isHovered}
          onClick={() => onNodeClick(layer)}
          onHover={(hover: boolean) => setHoveredLayer(hover ? layer.id : null)}
        />
      ))}
      <Text
        position={[layer.x, -3, 0]}
        fontSize={0.25}
        color={isHovered ? '#ffffff' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
      >
        {layer.name}
      </Text>
      <group position={[layer.x, -3.4, 0]}>
        <Text fontSize={0.15} color="#475569" anchorX="center">{layer.type.split(' ')[0]}</Text>
      </group>

      {/* Floor reflection/glow for layer */}
      <mesh position={[layer.x, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.5, 32]} />
        <meshBasicMaterial color={layer.color} transparent opacity={0.1 * (isHovered ? 2 : 1)} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Render parent lines
function Connections({ lines }: any) {
  return (
    <group>
      {lines.map((l: any, i: number) => (
        <primitive
          key={i}
          object={new THREE.Line(
            l.geometry,
            new THREE.LineBasicMaterial({
              color: l.color,
              transparent: true,
              opacity: l.isRes ? 0.8 : 0.15, // Low opacity to keep it clean, data flow adds brightness
              linewidth: 1
            })
          )}
        />
      ))}
    </group>
  );
}

// Data flow animation
function DataFlow({ lines, color = '#38bdf8', speed = 1, count = 30 }: any) {
  // Spawn flow particles
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      currentLineIndex: Math.floor(Math.random() * lines.length),
      progress: Math.random(),
      speed: (Math.random() * 0.5 + 0.5) * speed * 1.5, // Faster, energetic flow
    }));
  }, [lines, count, speed]);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current || lines.length === 0) return;

    particles.forEach((p, i) => {
      p.progress += delta * p.speed * 0.5;
      if (p.progress >= 1) {
        p.progress = 0;
        p.currentLineIndex = Math.floor(Math.random() * lines.length);
      }

      const line = lines[p.currentLineIndex];
      // Sample curve point
      // Use curve sampling
      // Rebuild curves from geometry
      // Lerp would also work
      // Parent could pass curves
      // Fall back to geometry

      const positions = line.geometry.attributes.position.array;
      const totalPoints = positions.length / 3;
      const pointIndex = Math.floor(p.progress * (totalPoints - 1));

      const x = positions[pointIndex * 3];
      const y = positions[pointIndex * 3 + 1];
      const z = positions[pointIndex * 3 + 2];

      // Smooth the motion
      const nextIndex = Math.min(pointIndex + 1, totalPoints - 1);
      const x2 = positions[nextIndex * 3];
      const y2 = positions[nextIndex * 3 + 1];
      const z2 = positions[nextIndex * 3 + 2];

      const subProgress = (p.progress * (totalPoints - 1)) % 1;

      dummy.position.set(
        x + (x2 - x) * subProgress,
        y + (y2 - y) * subProgress,
        z + (z2 - z) * subProgress
      );

      // Keep particles sharp
      const scale = (Math.sin(p.progress * Math.PI) * 0.5 + 0.5) * 0.04;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}



function Scene({ model, autoRotate, showConnections, showResidual, density, onLayerSelect, controlsRef }: any) {
  const config = MODEL_CONFIG[model as keyof typeof MODEL_CONFIG];
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  // Share lines with flow
  const lines = useMemo(() => {
    const lineData: any[] = [];
    // Type entries explicitly
    const layerMap = new Map(config.layers.map((l: any) => [l.id, l] as [string, any]));

    config.connections.forEach(([sourceId, targetId]: string[]) => {
      const source = layerMap.get(sourceId) as any;
      const target = layerMap.get(targetId) as any;
      if (!source || !target) return;

      const count = Math.max(3, Math.floor(Math.min(source.nodes, target.nodes) * density * 3)); // Increased density multiplier

      for (let i = 0; i < count; i++) {
        // Balanced network spread
        const sy = (Math.random() - 0.5) * 1.2;
        const sz = (Math.random() - 0.5) * 1.2;
        const ty = (Math.random() - 0.5) * 1.2;
        const tz = (Math.random() - 0.5) * 1.2;

        const points = [];
        // Moderate curve spread
        points.push(new THREE.Vector3(source.x, sy, sz));
        points.push(new THREE.Vector3((source.x + target.x) / 2, sy * 0.5, sz * 0.5)); // Balanced center spread
        points.push(new THREE.Vector3((source.x + target.x) / 2, ty * 0.5, tz * 0.5));
        points.push(new THREE.Vector3(target.x, ty, tz));

        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        lineData.push({ geometry: new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)), color: '#38bdf8' }); // Sky-400 for premium tech feel
      }
    });

    if ((model === 'cifar' || model === 'cifar100') && showResidual && 'residualConnections' in config) {
      config.residualConnections.forEach(([layerId]: string[]) => {
        const layer = layerMap.get(layerId) as any;
        if (!layer) return;

        // Residual shortcut arc
        const points = [
          new THREE.Vector3(layer.x - 0.3, 1.2, 0),
          new THREE.Vector3(layer.x, 2.0, 0),
          new THREE.Vector3(layer.x + 0.3, 1.2, 0),
        ]
        const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        lineData.push({ geometry: new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)), color: '#f59e0b', isRes: true }); // Amber-500
      });
    }

    return lineData;
  }, [config, density, showResidual, model]);

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 20, 60]} />

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c084fc" />

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />

      <group position={[0, 0, 0]}>



        {config.layers.map((layer: any) => (
          <Layer
            key={layer.id}
            layer={layer}
            onNodeClick={onLayerSelect}
            hoveredLayer={hoveredLayer}
            setHoveredLayer={setHoveredLayer}
          />
        ))}

        {showConnections && (
          <>
            <Connections lines={lines} />
            <DataFlow lines={lines} color="#bae6fd" speed={2} count={60} />
          </>
        )}



      </group>

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        enablePan={false}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 1.5}
      />

      <gridHelper args={[60, 60, '#1e293b', '#000000']} position={[0, -4, 0]} />
    </>
  );
}

export default function NeuralNetwork3D() {
  const [model, setModel] = useState<'fashion' | 'cifar' | 'cifar100'>('fashion');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showResidual, setShowResidual] = useState(true);
  const [density, setDensity] = useState([0.6]); // Higher default density
  const [selectedLayer, setSelectedLayer] = useState<any>(null);
  const controlsRef = useRef<any>(null);

  const currentModel = MODEL_CONFIG[model];

  return (
    <div className="w-full h-full relative group">

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 16], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <Scene
              model={model}
              autoRotate={autoRotate}
              showConnections={showConnections}
              showResidual={showResidual}
              density={density[0]}
              onLayerSelect={setSelectedLayer}
              controlsRef={controlsRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Control Dock - Bottom Center */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 w-auto bg-card/95 backdrop-blur-xl border border-border rounded-full px-4 py-2 items-center justify-center gap-4 shadow-2xl z-50 pointer-events-auto"
      >
        {/* Model Selector */}
        <div className="flex items-center gap-2 border-r border-border pr-4">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Model</span>
          <Select value={model} onValueChange={(v: any) => setModel(v)}>
            <SelectTrigger className="w-[180px] h-7 bg-secondary border-border text-foreground text-xs rounded-full focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card backdrop-blur-xl border-border">
              <SelectItem value="fashion">LiteNeTX-FMNIST</SelectItem>
              <SelectItem value="cifar">LiteNeTX-CIFAR10</SelectItem>
              <SelectItem value="cifar100">LiteNeTX-CIFAR100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full w-7 h-7", autoRotate && "bg-primary/20 text-primary")}
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause Rotation" : "Auto Rotate"}
          >
            {autoRotate ? <span className="text-[10px] font-bold">||</span> : <span className="text-[10px] font-bold">▶</span>}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-7 h-7 hover:bg-white/10"
            onClick={() => {
              // Reset camera view
              controlsRef.current?.reset();
            }}
            title="Reset Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full w-7 h-7", showConnections && "bg-primary/20 text-primary")}
            onClick={() => setShowConnections(!showConnections)}
            title="Show Connections"
          >
            <Activity className="w-3.5 h-3.5" />
          </Button>

          {(model === 'cifar' || model === 'cifar100') && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full w-7 h-7", showResidual && "bg-amber-500/20 text-amber-500")}
              onClick={() => setShowResidual(!showResidual)}
              title="Residual Connections"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Density Slider */}
        <div className="flex items-center gap-2 w-28 border-l border-border pl-4">
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          <Slider
            value={density}
            onValueChange={setDensity}
            max={1}
            step={0.1}
            className="flex-1"
          />
        </div>
      </motion.div>

      {/* MOBILE Compact Control Bar - Bottom Center (Icon Only) */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex sm:hidden absolute bottom-6 left-0 right-0 mx-auto w-fit bg-card/95 backdrop-blur-xl border border-border rounded-full px-5 py-3 items-center justify-center gap-5 shadow-2xl z-50 pointer-events-auto"
      >
        {/* Mobile Model Toggle - Cycle 3 models */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full w-9 h-9",
            model === 'fashion' ? "bg-blue-500/20 text-blue-500" :
              model === 'cifar' ? "bg-emerald-500/20 text-emerald-500" :
                "bg-purple-500/20 text-purple-500"
          )}
          onClick={() => {
            if (model === 'fashion') setModel('cifar');
            else if (model === 'cifar') setModel('cifar100');
            else setModel('fashion');
          }}
        >
          {model === 'fashion' ? <Shirt className="w-4 h-4" /> : model === 'cifar' ? <ImageIcon className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
        </Button>

        <div className="w-px h-4 bg-border" />

        {/* Rotate Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full w-9 h-9", autoRotate && "bg-primary/20 text-primary")}
          onClick={() => setAutoRotate(!autoRotate)}
        >
          {autoRotate ? <span className="text-[10px] font-bold">||</span> : <span className="text-[10px] font-bold">▶</span>}
        </Button>

        {/* Reset Camera */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 hover:bg-white/10"
          onClick={() => controlsRef.current?.reset()}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* Connections Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full w-9 h-9", showConnections && "bg-primary/20 text-primary")}
          onClick={() => setShowConnections(!showConnections)}
        >
          <Activity className="w-4 h-4" />
        </Button>

        <div className="w-px h-4 bg-border" />

        {/* Density Control - Cycles through levels */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 hover:bg-white/10 relative"
          onClick={() => {
            // Cycle density levels
            const currentDensity = density[0];
            if (currentDensity < 0.5) {
              setDensity([0.6]);
            } else if (currentDensity < 0.8) {
              setDensity([1.0]);
            } else {
              setDensity([0.3]);
            }
          }}
        >
          <Settings2 className="w-4 h-4" />
          {/* Density indicator dots */}
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className={cn("w-1 h-1 rounded-full", density[0] >= 0.3 ? "bg-primary" : "bg-white/20")} />
            <div className={cn("w-1 h-1 rounded-full", density[0] >= 0.6 ? "bg-primary" : "bg-white/20")} />
            <div className={cn("w-1 h-1 rounded-full", density[0] >= 1.0 ? "bg-primary" : "bg-white/20")} />
          </div>
        </Button>
      </motion.div>

      {/* Layer Details Panel - Right Side Floating */}
      <AnimatePresence>
        {selectedLayer && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="absolute top-8 right-4 left-4 md:left-auto md:right-8 md:w-80 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-6 shadow-2xl z-30 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none" />

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs font-mono text-primary mb-1 flex items-center gap-1 font-bold">
                    <Box className="w-3 h-3" /> LAYER INSPECTOR
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{selectedLayer.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-secondary text-muted-foreground"
                  onClick={() => setSelectedLayer(null)}
                >
                  <span className="text-lg leading-none">&times;</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1 font-semibold">Architecture Type</span>
                  <span className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Layers className="w-4 h-4 text-purple-500" />
                    {selectedLayer.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1 font-semibold">Shape</span>
                    <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold">{selectedLayer.shape}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1 font-semibold">Parameters</span>
                    <span className="text-sm font-mono text-amber-600 dark:text-amber-400 font-bold">{selectedLayer.params}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed font-medium">
                  {selectedLayer.details}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Overlay (Fades out) — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hidden md:block absolute top-8 left-8 text-xs font-mono text-white/30 pointer-events-none"
      >
        <div className="flex items-center gap-2 mb-1">
          <MousePointer2 className="w-3 h-3" />
          <span>INTERACT</span>
        </div>
        <div>L-CLICK: INSPECT LAYER</div>
        <div>R-CLICK: ROTATE VIEW</div>
        <div>SCROLL: ZOOM</div>
      </motion.div>

    </div>
  );
}
