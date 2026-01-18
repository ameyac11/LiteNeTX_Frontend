import { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Link2, Link2Off, Layers, Activity, Box, Settings2, Sparkles, MousePointer2 } from 'lucide-react';
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

// --- Improved Model Configurations ---
const MODEL_CONFIG = {
  fashion: {
    id: 'fashion',
    name: 'LiteNet-Fashion',
    type: 'LiteGrayCNN',
    description: 'Optimized for high-speed classification of 28x28 grayscale fashion items.',
    layers: [
      { id: 'input', name: 'Input Layer', type: 'Input', nodes: 9, shape: '1×28×28', params: '0', x: -8, color: '#3b82f6' },
      { id: 'conv1', name: 'Conv Block 1', type: 'Conv2d + ReLU', nodes: 16, shape: '32×28×28', params: '320', x: -5, color: '#60a5fa' },
      { id: 'conv2', name: 'Conv Block 2', type: 'Conv2d + ReLU', nodes: 25, shape: '64×28×28', params: '18,496', x: -2, color: '#818cf8' },
      { id: 'pool', name: 'Pooling', type: 'MaxPool2d', nodes: 16, shape: '64×14×14', params: '0', x: 1, color: '#a78bfa' },
      { id: 'fc1', name: 'Dense 1', type: 'Linear + Dropout', nodes: 36, shape: '128', params: '1,605,760', x: 4, color: '#c084fc' },
      { id: 'fc2', name: 'Output', type: 'Linear (Softmax)', nodes: 10, shape: '10', params: '1,290', x: 7, color: '#e879f9' },
    ],
    connections: [
      ['input', 'conv1'], ['conv1', 'conv2'], ['conv2', 'pool'],
      ['pool', 'fc1'], ['fc1', 'fc2'],
    ],
  },
  cifar: {
    id: 'cifar',
    name: 'LiteNet-CIFAR',
    type: 'ResNet-like',
    description: 'Deep Residual Network specialized for 32x32 RGB object recognition.',
    layers: [
      { id: 'input', name: 'Input Layer', type: 'Input', nodes: 9, shape: '3×32×32', params: '0', x: -9, color: '#10b981' },
      { id: 'conv1', name: 'Stem', type: 'Conv2d + BN', nodes: 16, shape: '64×32×32', params: '1,792', x: -6, color: '#34d399' },
      { id: 'res1', name: 'ResBlock 1', type: 'Residual Block', nodes: 16, shape: '64×32×32', params: '73,856', x: -3, color: '#4ade80', isResidual: true },
      { id: 'res2', name: 'ResBlock 2', type: 'Residual Block', nodes: 25, shape: '128×16×16', params: '295,424', x: 0, color: '#2dd4bf', isResidual: true },
      { id: 'res3', name: 'ResBlock 3', type: 'Residual Block', nodes: 36, shape: '256×8×8', params: '1,180,672', x: 3, color: '#22d3ee', isResidual: true },
      { id: 'pool', name: 'AvgPool', type: 'AdaptiveAvgPool', nodes: 9, shape: '256×1×1', params: '0', x: 6, color: '#38bdf8' },
      { id: 'fc', name: 'Classifier', type: 'Linear', nodes: 10, shape: '10', params: '2,570', x: 8, color: '#60a5fa' },
    ],
    connections: [
      ['input', 'conv1'], ['conv1', 'res1'], ['res1', 'res2'],
      ['res2', 'res3'], ['res3', 'pool'], ['pool', 'fc'],
    ],
    residualConnections: [
      ['res1', 'res1'], ['res2', 'res2'], ['res3', 'res3'],
    ],
  },
};

// --- Components ---

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

function Connections({ layers, connections, density, showResidual, residualConnections }: any) {
  const lines = useMemo(() => {
    const lineData: any[] = [];
    const layerMap = new Map(layers.map((l: any) => [l.id, l]));

    connections.forEach(([sourceId, targetId]: string[]) => {
      const source = layerMap.get(sourceId) as any;
      const target = layerMap.get(targetId) as any;
      if (!source || !target) return;

      const count = Math.max(2, Math.floor(Math.min(source.nodes, target.nodes) * density));

      for (let i = 0; i < count; i++) {
        // Random start/end within the layer blocks
        const sy = (Math.random() - 0.5) * 1.5; // roughly matches block height
        const sz = (Math.random() - 0.5) * 1.5;
        const ty = (Math.random() - 0.5) * 1.5;
        const tz = (Math.random() - 0.5) * 1.5;

        const points = [];
        // Simple bezier curve points
        points.push(new THREE.Vector3(source.x, sy, sz));
        points.push(new THREE.Vector3((source.x + target.x) / 2, sy * 1.5, sz * 1.5)); // Control point 1
        points.push(new THREE.Vector3((source.x + target.x) / 2, ty * 1.5, tz * 1.5)); // Control point 2
        points.push(new THREE.Vector3(target.x, ty, tz));

        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        lineData.push({ geometry: new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)), color: '#64748b' });
      }
    });

    if (showResidual && residualConnections) {
      residualConnections.forEach(([layerId]: string[]) => {
        const layer = layerMap.get(layerId) as any;
        if (!layer) return;

        // Skip connection loop
        const points = [
          new THREE.Vector3(layer.x - 0.5, 1.5, 0),
          new THREE.Vector3(layer.x, 2.5, 0),
          new THREE.Vector3(layer.x + 0.5, 1.5, 0),
        ]
        const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        lineData.push({ geometry: new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)), color: '#fbbf24', isRes: true });
      });
    }

    return lineData;
  }, [layers, connections, density, showResidual, residualConnections]);

  return (
    <group>
      {lines.map((l: any, i) => (
        <primitive
          key={i}
          object={new THREE.Line(
            l.geometry,
            new THREE.LineBasicMaterial({
              color: l.color,
              transparent: true,
              opacity: l.isRes ? 0.6 : 0.15,
              linewidth: 1
            })
          )}
        />
      ))}
    </group>
  );
}

function Scene({ model, autoRotate, showConnections, showResidual, density, onLayerSelect, controlsRef }: any) {
  const config = MODEL_CONFIG[model as keyof typeof MODEL_CONFIG];
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  return (
    <>
      <color attach="background" args={['#000000']} />

      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c084fc" />
      <spotLight position={[0, 15, 0]} angle={0.6} penumbra={1} intensity={1} castShadow />

      <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />

      <group position={[0, 0, 0]}>
        {config.layers.map((layer) => (
          <Layer
            key={layer.id}
            layer={layer}
            onNodeClick={onLayerSelect}
            hoveredLayer={hoveredLayer}
            setHoveredLayer={setHoveredLayer}
          />
        ))}

        {showConnections && (
          <Connections
            layers={config.layers}
            connections={config.connections}
            density={density}
            showResidual={model === 'cifar' && showResidual}
            residualConnections={'residualConnections' in config ? config.residualConnections : undefined}
          />
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
  const [model, setModel] = useState<'fashion' | 'cifar'>('fashion');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showResidual, setShowResidual] = useState(true);
  const [density, setDensity] = useState([0.4]);
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
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl z-20"
      >
        {/* Model Selector */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Model</span>
          <Select value={model} onValueChange={(v: any) => setModel(v)}>
            <SelectTrigger className="w-[140px] h-7 bg-white/5 border-white/10 text-xs rounded-full focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
              <SelectItem value="fashion">LiteNet-Fashion</SelectItem>
              <SelectItem value="cifar">LiteNet-CIFAR</SelectItem>
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
              // Reset Camera
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

          {model === 'cifar' && (
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
        <div className="flex items-center gap-2 w-28 border-l border-white/10 pl-4">
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

      {/* Layer Details Panel - Right Side Floating */}
      <AnimatePresence>
        {selectedLayer && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="absolute top-8 right-8 w-80 glass-card border border-white/10 rounded-2xl p-6 shadow-2xl z-30 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none" />

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs font-mono text-primary mb-1 flex items-center gap-1">
                    <Box className="w-3 h-3" /> LAYER INSPECTOR
                  </div>
                  <h3 className="text-xl font-bold">{selectedLayer.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-white/10"
                  onClick={() => setSelectedLayer(null)}
                >
                  <span className="text-lg leading-none">&times;</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Architecture Type</span>
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {selectedLayer.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Shape</span>
                    <span className="text-sm font-mono text-emerald-400">{selectedLayer.shape}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Parameters</span>
                    <span className="text-sm font-mono text-amber-400">{selectedLayer.params}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-muted-foreground leading-relaxed">
                  This layer transforms the input tensor volume through learnable filter weights, extracting feature maps used for classification.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Overlay (Fades out) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute top-8 left-8 text-xs font-mono text-white/30 pointer-events-none"
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
