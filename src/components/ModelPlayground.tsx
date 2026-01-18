import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, AlertCircle, ImageIcon, Scan, Cpu, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Configuration ---
const fashionLabels = [
    'T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
    'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot',
];

const cifarLabels = [
    'airplane', 'automobile', 'bird', 'cat', 'deer',
    'dog', 'frog', 'horse', 'ship', 'truck',
];

type ModelType = 'fashion' | 'cifar';

const MODELS = {
    fashion: {
        id: 'fashion',
        name: 'LiteNet-Fashion',
        shortName: 'Fashion',
        description: 'Classify grayscale clothing items',
        endpoint: '/predict/fashion',
        labels: fashionLabels,
        inputFormat: '28×28 grayscale',
        icon: Layers,
        color: 'from-blue-500 to-cyan-500',
        accent: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        examples: [] // Will be loaded from backend
    },
    cifar: {
        id: 'cifar',
        name: 'LiteNet-CIFAR',
        shortName: 'CIFAR-10',
        description: 'Classify common objects in RGB',
        endpoint: '/predict/cifar',
        labels: cifarLabels,
        inputFormat: '32×32 RGB',
        icon: ImageIcon,
        color: 'from-emerald-500 to-teal-500',
        accent: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        examples: [] // Will be loaded from backend
    },
};

interface PredictionResult {
    label: string;
    probability: number;
}

export default function ModelPlayground() {
    const [activeModel, setActiveModel] = useState<ModelType>('fashion');
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState<PredictionResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [examples, setExamples] = useState<{ url: string; label: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentModel = MODELS[activeModel];

    // Fetch example images from backend
    useEffect(() => {
        const fetchExamples = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${baseUrl}/api/examples/list/${activeModel}`);

                if (!response.ok) {
                    console.warn('Failed to fetch examples from backend');
                    return;
                }

                const data = await response.json();

                if (data.examples && data.examples.length > 0) {
                    // Prepend base URL to example URLs
                    const examplesWithFullUrls = data.examples.map((ex: any) => ({
                        url: `${baseUrl}${ex.url}`,
                        label: ex.label
                    }));
                    setExamples(examplesWithFullUrls);
                } else {
                    setExamples([]);
                }
            } catch (error) {
                console.error('Error fetching examples:', error);
                setExamples([]);
            }
        };

        fetchExamples();
    }, [activeModel]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        processFile(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleExampleSelect = async (url: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split('/').pop() || 'example.png';
            const file = new File([blob], filename, { type: blob.type });
            processFile(file);
        } catch (error) {
            toast({
                title: 'Error loading example',
                description: 'Could not fetch the example image.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const processFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith('image/')) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload an image file (PNG, JPG, etc.)',
                variant: 'destructive',
            });
            return;
        }

        setFile(selectedFile);
        setResults([]);
        setError(null);
        setIsScanning(false);

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handlePredict = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setResults([]);

        // Simulate scanning effect
        setIsScanning(true);
        await new Promise(r => setTimeout(r, 1500)); // Aesthetic delay for "scanning"

        const formData = new FormData();
        formData.append('file', file);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseUrl}${currentModel.endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Backend unavailable. Please try again later.');
            }

            const data = await response.json();

            // Backend returns {model, top1, top3} format
            const predictions: PredictionResult[] = data.top3?.map((pred: any) => ({
                label: pred.label,
                probability: pred.confidence,
            })) || [];

            setResults(predictions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            setIsScanning(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">

            {/* Sidebar / Model Selector */}
            <div className="lg:w-64 bg-secondary/30 border-r border-white/10 p-4 flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 pl-2">Select Model</h3>
                {(Object.keys(MODELS) as ModelType[]).map((key) => {
                    const model = MODELS[key];
                    const isActive = activeModel === key;
                    const Icon = model.icon;

                    return (
                        <button
                            key={key}
                            onClick={() => {
                                setActiveModel(key);
                                setResults([]);
                                setError(null);
                                // Keep image if user wants to test same image on different model
                            }}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left relative overflow-hidden group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : model.accent)} />
                            <div className="flex-1 z-10">
                                <div className="font-medium text-sm">{model.shortName}</div>
                                <div className={cn("text-xs opacity-70", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                    {model.inputFormat}
                                </div>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="active-glow"
                                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </button>
                    );
                })}

                <div className="mt-auto p-4 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                    <Cpu className="w-4 h-4 mb-2 text-primary/50" />
                    <p>Running on server.</p>
                    <p className="mt-1">Latencies &lt; 50ms.</p>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {currentModel.name}
                            <span className={cn("text-xs px-2 py-0.5 rounded-full border bg-opacity-20", currentModel.bg, currentModel.border, currentModel.accent)}>
                                Ready
                            </span>
                        </h2>
                        <p className="text-muted-foreground mt-1">{currentModel.description}</p>
                    </div>
                    <Button
                        onClick={handlePredict}
                        disabled={!file || isLoading}
                        size="lg"
                        className={cn("bg-gradient-to-r shadow-lg hover:shadow-xl hover:scale-105 transition-all", currentModel.color)}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Scan className="w-5 h-5 mr-2" />
                                Analyze Image
                            </>
                        )}
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 flex-1">

                    {/* Input Zone */}
                    <div className="flex flex-col gap-4">
                        <div
                            className={cn(
                                "relative group flex-1 min-h-[300px] border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5",
                                image ? "border-primary/50" : "border-muted-foreground/20 hover:border-primary/30",
                                isScanning && "border-primary/80"
                            )}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                            <AnimatePresence mode="wait">
                                {image ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full flex items-center justify-center p-4"
                                    >
                                        <img src={image} alt="Preview" className="max-h-[300px] object-contain rounded-lg shadow-2xl relative z-10" />

                                        {/* Premium Scanning Animation Overlay */}
                                        {isScanning && (
                                            <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden">
                                                {/* 1. Cyberpunk Grid Background */}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                                                {/* 2. Scanning Laser Line */}
                                                <motion.div
                                                    className="absolute w-full h-24 bg-gradient-to-b from-primary/50 to-transparent blur-sm"
                                                    initial={{ top: "-20%" }}
                                                    animate={{ top: "120%" }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                />
                                                <motion.div
                                                    className="absolute w-full h-0.5 bg-primary shadow-[0_0_15px_rgba(59,130,246,1)]"
                                                    initial={{ top: "-20%" }}
                                                    animate={{ top: "120%" }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                />

                                                {/* 3. Corner Brackets HUD */}
                                                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/60 rounded-tl-lg" />
                                                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/60 rounded-tr-lg" />
                                                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/60 rounded-bl-lg" />
                                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/60 rounded-br-lg" />

                                                {/* 4. Processing Text */}
                                                <motion.div
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-primary/30 flex items-center gap-3"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                >
                                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                                    <span className="text-xs font-mono text-primary uppercase tracking-widest">Analyzing Features...</span>
                                                </motion.div>

                                                {/* 5. Random glitch artifacts (simulated with pulsing overlays) */}
                                                <motion.div
                                                    className="absolute top-1/4 left-1/4 w-12 h-[1px] bg-white/40"
                                                    animate={{ opacity: [0, 1, 0], width: [0, 50, 0] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="absolute bottom-1/3 right-1/4 w-16 h-[1px] bg-white/40"
                                                    animate={{ opacity: [0, 1, 0], width: [0, 60, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                                                />
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                                            Click or drop to change
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center p-8 z-10"
                                    >
                                        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors", currentModel.bg)}>
                                            <Upload className={cn("w-8 h-8", currentModel.accent)} />
                                        </div>
                                        <h4 className="text-lg font-medium mb-2">Drag & Drop Image</h4>
                                        <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                                            Support for PNG, JPG, WEBP.
                                            <br />
                                            Ideal size: {currentModel.inputFormat}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Grid Background Effect */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }}
                            />
                        </div>

                        {/* Example Images Section */}
                        <div className="space-y-2">
                            <h4 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Try an Example</h4>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                                {examples.length > 0 ? (
                                    examples.map((ex, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExampleSelect(ex.url);
                                            }}
                                            className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all flex-shrink-0"
                                        >
                                            <img src={ex.url} alt={ex.label} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-[10px] text-white font-medium text-center leading-tight p-1">{ex.label}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">
                                        Loading examples...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Zone */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Analysis Results</h3>
                            {results.length > 0 && (
                                <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">
                                    Confidence Score
                                </span>
                            )}
                        </div>

                        <div className="flex-1 bg-secondary/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {error ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 text-destructive"
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                        <span>{error}</span>
                                    </motion.div>
                                ) : results.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        {results.map((result, index) => (
                                            <motion.div
                                                key={result.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-medium capitalize">{result.label}</span>
                                                    <span className="font-mono text-muted-foreground">{(result.probability * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-3 bg-secondary rounded-full overflow-hidden relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.probability * 100}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                        className={cn(
                                                            "h-full rounded-full relative overflow-hidden",
                                                            "bg-gradient-to-r", currentModel.color
                                                        )}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50 text-sm italic">
                                        <Scan className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No analysis performed yet.</p>
                                        <p>Upload an image and click "Analyze" to see results.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
