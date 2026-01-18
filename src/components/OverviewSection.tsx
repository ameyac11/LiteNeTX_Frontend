import { motion } from 'framer-motion';
import { Flame, Server, Database, Zap, Upload, Cog, Brain, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Flame,
    title: 'PyTorch',
    description: 'Built with PyTorch for flexible and efficient training',
  },
  {
    icon: Server,
    title: 'FastAPI Backend',
    description: 'Deployed on Render for reliable API inference',
  },
  {
    icon: Database,
    title: 'Two Datasets',
    description: 'FashionMNIST (28x28) & CIFAR-10 (32x32)',
  },
  {
    icon: Zap,
    title: 'Real-time Inference',
    description: 'Get predictions in milliseconds',
  },
];

const pipelineSteps = [
  { icon: Upload, label: 'Upload Image' },
  { icon: Cog, label: 'Preprocess' },
  { icon: Brain, label: 'CNN Inference' },
  { icon: BarChart3, label: 'Top-3 Results' },
];

export default function OverviewSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Project Overview</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete machine learning pipeline from training to deployment
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-xl p-8"
        >
          <h3 className="text-xl font-semibold mb-8 text-center">Inference Pipeline</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {pipelineSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
