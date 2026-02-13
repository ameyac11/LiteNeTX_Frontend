import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, AlertCircle, ImageIcon, Scan, Cpu, Layers, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Configuration ---
const fashionLabels = [
    'T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
    'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot',
];

const cifar10Labels = [
    'airplane', 'automobile', 'bird', 'cat', 'deer',
    'dog', 'frog', 'horse', 'ship', 'truck',
];

const cifar100Labels = [
    'apple', 'aquarium_fish', 'baby', 'bear', 'beaver', 'bed', 'bee', 'beetle', 'bicycle', 'bottle',
    'bowl', 'boy', 'bridge', 'bus', 'butterfly', 'camel', 'can', 'castle', 'caterpillar', 'cattle',
    'chair', 'chimpanzee', 'clock', 'cloud', 'cockroach', 'couch', 'crab', 'crocodile', 'cup', 'dinosaur',
    'dolphin', 'elephant', 'flatfish', 'forest', 'fox', 'girl', 'hamster', 'house', 'kangaroo', 'keyboard',
    'lamp', 'lawn_mower', 'leopard', 'lion', 'lizard', 'lobster', 'man', 'maple_tree', 'motorcycle', 'mountain',
    'mouse', 'mushroom', 'oak_tree', 'orange', 'orchid', 'otter', 'palm_tree', 'pear', 'pickup_truck', 'pine_tree',
    'plain', 'plate', 'poppy', 'porcupine', 'possum', 'rabbit', 'raccoon', 'ray', 'road', 'rocket',
    'rose', 'sea', 'seal', 'shark', 'shrew', 'skunk', 'skyscraper', 'snail', 'snake', 'spider',
    'squirrel', 'streetcar', 'sunflower', 'sweet_pepper', 'table', 'tank', 'telephone', 'television', 'tiger', 'tractor',
    'train', 'trout', 'tulip', 'turtle', 'wardrobe', 'whale', 'willow_tree', 'wolf', 'woman', 'worm',
];

type ModelType = 'fashion' | 'cifar' | 'cifar100';

const MODELS = {
    fashion: {
        id: 'fashion',
        name: 'LiteNeTX-FMNIST',
        shortName: 'LiteNeTX-FMNIST',
        description: 'Classify grayscale clothing items',
        endpoint: '/predict/fashion',
        labels: fashionLabels,
        inputFormat: '28×28 grayscale',
        icon: Layers,
        color: 'from-blue-500 to-cyan-500',
        accent: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        examples: [],
    },
    cifar: {
        id: 'cifar',
        name: 'LiteNeTX-CIFAR10',
        shortName: 'LiteNeTX-CIFAR10',
        description: 'Classify common objects in RGB',
        endpoint: '/predict/cifar',
        labels: cifar10Labels,
        inputFormat: '32×32 RGB',
        icon: ImageIcon,
        color: 'from-emerald-500 to-teal-500',
        accent: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        examples: [],
    },
    cifar100: {
        id: 'cifar100',
        name: 'LiteNeTX-CIFAR100',
        shortName: 'LiteNeTX-CIFAR100',
        description: 'Fine-grained 100-class classification',
        endpoint: '/predict/cifar100',
        labels: cifar100Labels,
        inputFormat: '32×32 RGB',
        icon: ImageIcon,
        color: 'from-purple-500 to-fuchsia-500',
        accent: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        examples: [],
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
    const [isLoadingExamples, setIsLoadingExamples] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentModel = MODELS[activeModel];

    // Fetch example images from backend
    useEffect(() => {
        const fetchExamples = async () => {
            setIsLoadingExamples(true);
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${baseUrl}/api/examples/list/${activeModel}`);

                if (!response.ok) {
                    setExamples([]);
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
                setExamples([]);
            } finally {
                setIsLoadingExamples(false);
            }
        };

        fetchExamples();
    }, [activeModel]);

    // Clear input and results when model changes
    useEffect(() => {
        setImage(null);
        setFile(null);
        setResults([]);
        setError(null);
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
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

    const handleClear = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setImage(null);
        setFile(null);
        setResults([]);
        setError(null);
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] glass-card rounded-2xl md:overflow-hidden overflow-visible border border-white/10 shadow-2xl">

            {/* Sidebar / Model Selector */}
            <div className="w-full lg:w-64 bg-secondary/30 border-b lg:border-b-0 lg:border-r border-white/10 p-4 flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 pl-2">Select Model</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-2">
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
                                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left relative overflow-hidden group cursor-pointer",
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
                </div>

                <div className="mt-auto p-4 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
                    <Cpu className="w-4 h-4 mb-2 text-primary/50" />
                    <p>Running on server.</p>
                    <p className="mt-1">Latencies &lt; 50ms.</p>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 p-4 lg:p-8 flex flex-col">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
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
                        className={cn("w-full sm:w-auto bg-gradient-to-r shadow-lg hover:shadow-xl hover:scale-105 transition-all", currentModel.color)}
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
                                "relative group flex-1 min-h-[250px] lg:min-h-[300px] border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5 cursor-pointer",
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

                                        {/* Remove Button */}
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleClear}
                                            className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-destructive hover:border-destructive transition-all shadow-xl"
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.button>

                                        {/* Advanced AI Interface Scanning Loop */}
                                        {isScanning && (
                                            <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden select-none">
                                                {/* Contrast/Dimming Backdrop */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-[2px]"
                                                />

                                                {/* Tech Overlay Background */}
                                                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

                                                {/* 1. Dynamic Corner Brackets (Animated) */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                                                    className="absolute top-6 left-6 w-16 h-16 border-t-[1px] border-l-[1px] border-primary/40 rounded-tl-2xl shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, x: 10, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                                                    className="absolute top-6 right-6 w-16 h-16 border-t-[1px] border-r-[1px] border-primary/40 rounded-tr-2xl shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                                                    className="absolute bottom-6 left-6 w-16 h-16 border-b-[1px] border-l-[1px] border-primary/40 rounded-bl-2xl shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, x: 10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                                                    className="absolute bottom-6 right-6 w-16 h-16 border-b-[1px] border-r-[1px] border-primary/40 rounded-br-2xl shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                                                />

                                                {/* 2. Active Scanning Beam (High Precision) */}
                                                <motion.div
                                                    className="absolute w-full h-[60px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent z-30 backdrop-blur-[1px]"
                                                    initial={{ top: "-20%" }}
                                                    animate={{ top: "120%" }}
                                                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <div className="absolute w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.5)] top-0" />
                                                </motion.div>

                                                {/* 3. Central Analysis Node */}
                                                <div className="absolute inset-0 flex items-center justify-center z-40">
                                                    <motion.div
                                                        className="relative w-48 h-48 flex items-center justify-center"
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        {/* Rotating outer ring */}
                                                        <motion.div
                                                            className="absolute inset-0 border border-t-primary/30 border-r-transparent border-b-primary/30 border-l-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        {/* Counter-rotating inner ring */}
                                                        <motion.div
                                                            className="absolute inset-8 border border-black/10 dark:border-white/10 rounded-full"
                                                            animate={{ rotate: -360 }}
                                                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                                        />

                                                        {/* Center Core */}
                                                        <div className="absolute bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col items-center gap-2 min-w-[160px]">
                                                            <div className="flex items-center gap-2">
                                                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                                                <span className="font-mono text-xs font-bold text-foreground tracking-[0.2em] relative top-px">ANALYZING</span>
                                                            </div>
                                                            <div className="h-[1px] w-full bg-border my-1" />
                                                            <div className="flex flex-col gap-1.5 w-full">
                                                                <div className="flex justify-between items-center text-[9px] text-muted-foreground font-mono">
                                                                    <span>CONFIDENCE</span>
                                                                    <span className="text-primary animate-pulse">CALCULATING...</span>
                                                                </div>
                                                                {/* Animated Bar */}
                                                                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        className="h-full bg-primary"
                                                                        animate={{ width: ["10%", "60%", "30%", "90%"] }}
                                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {/* 4. Side Data Stream (Decorative) */}
                                                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 opacity-60">
                                                    {[...Array(5)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="flex items-center justify-end gap-2"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                                        >
                                                            <div className="h-[1px] w-8 bg-white/20" />
                                                            <div className="w-1 h-1 bg-primary rounded-full" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}


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
                            <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent min-h-[64px] w-full max-w-[calc(100vw-64px)] lg:max-w-none hover:scrollbar-thumb-white/40 transition-colors">
                                {isLoadingExamples ? (
                                    // Skeleton loaders - exact dimensions match loaded state
                                    [...Array(6)].map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="w-16 h-16 rounded-lg flex-shrink-0 skeleton-shimmer"
                                        />
                                    ))
                                ) : examples.length > 0 ? (
                                    examples.map((ex, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExampleSelect(ex.url);
                                            }}
                                            className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-all flex-shrink-0 cursor-pointer"
                                        >
                                            <img src={ex.url} alt={ex.label} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-[10px] text-white font-medium text-center leading-tight p-1">{ex.label}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-xs text-muted-foreground italic h-16 flex items-center">
                                        No examples available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Zone */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Scan className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold tracking-tight">Analysis Results</h3>
                            </div>
                            {results.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                                >
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                        Live Feed Active
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex-1 bg-black/[0.03] dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-black/10 dark:border-white/10 relative md:overflow-hidden overflow-visible group/results shadow-inner min-h-[400px]">
                            {/* Decorative Corner Brackets */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40 dark:border-primary/30 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40 dark:border-primary/30 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/40 dark:border-primary/30 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40 dark:border-primary/30 rounded-br-lg" />

                            {/* Background Mesh Gradient (Subtle) */}
                            <div className={cn(
                                "absolute inset-0 opacity-10 transition-colors duration-1000",
                                currentModel.bg
                            )} style={{ filter: 'blur(100px)' }} />

                            <AnimatePresence mode="wait">
                                {error ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center gap-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-destructive" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-destructive">Analysis Failed</h4>
                                            <p className="text-sm text-muted-foreground max-w-[200px]">{error}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setError(null)}>
                                            Try Again
                                        </Button>
                                    </motion.div>
                                ) : results.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-8 relative z-10"
                                    >
                                        {results.map((result, index) => {
                                            const isTop = index === 0;
                                            const confidence = result.probability * 100;

                                            let confidenceLabel = "Low Confidence";
                                            let labelColor = "text-muted-foreground";
                                            if (confidence > 80) {
                                                confidenceLabel = "Strong Match";
                                                labelColor = currentModel.accent;
                                            } else if (confidence > 50) {
                                                confidenceLabel = "Likely Match";
                                                labelColor = "text-yellow-500";
                                            }

                                            return (
                                                <motion.div
                                                    key={result.label}
                                                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                                    className="relative"
                                                >
                                                    <div className="flex justify-between items-end mb-2.5">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                {isTop && <div className={cn("w-1.5 h-1.5 rounded-full animate-ping", currentModel.color.split(' ')[0])} />}
                                                                <span className={cn(
                                                                    "font-bold tracking-tight capitalize transition-colors",
                                                                    isTop ? "text-lg text-foreground" : "text-sm text-foreground/60 dark:text-muted-foreground"
                                                                )}>
                                                                    {result.label}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] uppercase tracking-widest font-extrabold opacity-60 dark:opacity-50">
                                                                {isTop ? confidenceLabel : "Secondary Detection"}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className={cn(
                                                                "font-mono font-bold leading-none transition-all",
                                                                isTop ? "text-2xl text-foreground" : "text-sm text-foreground/70 dark:text-muted-foreground"
                                                            )}>
                                                                {confidence.toFixed(1)}<span className="text-[0.6em] opacity-60 ml-0.5">%</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="h-4 bg-black/[0.05] dark:bg-black/40 rounded-full overflow-hidden relative border border-black/10 dark:border-white/10 p-[1px]">
                                                        {/* Progress Bar background track pattern */}
                                                        <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:4px_4px]" />

                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${confidence}%` }}
                                                            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                                                            className={cn(
                                                                "h-full rounded-full relative overflow-hidden flex items-center",
                                                                "bg-gradient-to-r shadow-[0_0_20px_rgba(var(--primary),0.3)]",
                                                                currentModel.color
                                                            )}
                                                        >
                                                            {/* Inner glass highlight */}
                                                            <div className="absolute inset-0 bg-white/20 dark:bg-white/10" />

                                                            {/* Animated Sweep Effect */}
                                                            <motion.div
                                                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/30 to-transparent skew-x-12"
                                                                animate={{ x: ['-100%', '250%'] }}
                                                                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                                            />

                                                            {/* Terminal indicator at the end of progress */}
                                                            <div className="absolute right-0 h-full w-1 bg-white/40 shadow-[0_0_8px_white]" />
                                                        </motion.div>
                                                    </div>

                                                    {/* HUD Decoration below bar */}
                                                    <div className="flex justify-between items-center mt-1 px-1">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <div key={i} className={cn(
                                                                    "w-1 h-0.5 rounded-full",
                                                                    confidence > (i * 20) ? "bg-primary/70 dark:bg-primary/60" : "bg-black/10 dark:bg-primary/10"
                                                                )} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[8px] font-mono text-foreground/40 dark:text-muted-foreground/50">HEX_SIGNAL_STRENGTH</span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                                        <div className="relative mb-6">
                                            <Scan className="w-16 h-16 opacity-30 dark:opacity-50 animate-[pulse_3s_infinite]" />
                                            <motion.div
                                                className="absolute inset-0 border-2 border-primary/30 rounded-xl"
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            />
                                        </div>
                                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-1 text-foreground/80">System Idle</h4>
                                        <p className="text-xs max-w-[180px] opacity-70">Initialize neural network by providing visual input data</p>

                                        {/* Status Indicators */}
                                        <div className="mt-8 grid grid-cols-2 gap-4 w-full px-4">
                                            <div className="flex flex-col items-center gap-1 border border-primary/10 rounded-lg p-2 bg-primary/5 backdrop-blur-sm">
                                                <span className="text-[9px] uppercase tracking-tighter font-bold text-muted-foreground/80">Link State</span>
                                                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">STABLE</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 border border-primary/10 rounded-lg p-2 bg-primary/5 backdrop-blur-sm">
                                                <span className="text-[9px] uppercase tracking-tighter font-bold text-muted-foreground/80">Kernel</span>
                                                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">LITENETX_V2</span>
                                            </div>
                                        </div>
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
