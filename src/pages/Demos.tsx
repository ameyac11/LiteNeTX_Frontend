import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ModelPlayground from '@/components/ModelPlayground';

export default function Demos() {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="container-custom relative z-10">
          <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-header"
          >
            <h1 className="page-title">Model Laboratory</h1>
            <p className="page-description">
              Interactive playground for our custom CNN architectures.
              Select a model, upload an image, and watch the inference in real-time.
            </p>
          </motion.div>

          {/* Unified Playground */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <ModelPlayground />
          </motion.div>

          {/* Additional Info / Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              *Server Cold Start: First request may take up to 30s. Subsequent requests &lt; 50ms.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
