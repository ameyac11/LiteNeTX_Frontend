import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PredictionResult {
  label: string;
  probability: number;
}

interface DemoCardProps {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  labels: string[];
  inputFormat: string;
  colorScheme: 'fashion' | 'cifar';
}

export default function DemoCard({
  id,
  title,
  description,
  endpoint,
  labels,
  inputFormat,
  colorScheme,
}: DemoCardProps) {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}${endpoint}`, {
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
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        input.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className={`p-6 ${colorScheme === 'fashion' ? 'gradient-bg' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
        <div className="text-xs text-muted-foreground/80 mt-2">Expected input: {inputFormat}</div>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${image ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {image ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={image}
                alt="Uploaded preview"
                className="max-h-48 rounded-lg object-contain"
              />
              <span className="text-sm text-muted-foreground">Click to change image</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Drop an image or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PNG, JPG, WEBP
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Predict Button */}
        <Button
          onClick={handlePredict}
          disabled={!file || isLoading}
          className="w-full mt-6 gradient-bg hover:opacity-90"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5 mr-2" />
              Predict
            </>
          )}
        </Button>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 space-y-4"
            >
              <h4 className="font-semibold">Top 3 Predictions</h4>
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{result.label}</span>
                    <span className="text-muted-foreground">
                      {(result.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probability * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${colorScheme === 'fashion' ? 'gradient-bg' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
