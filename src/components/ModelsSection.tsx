import { motion } from 'framer-motion';
import { Shirt, ImageIcon, CheckCircle2 } from 'lucide-react';

const models = [
  {
    name: 'LiteNet-Fashion',
    icon: Shirt,
    dataset: 'FashionMNIST',
    inputSize: '28×28',
    channels: 1,
    classes: 10,
    endpoint: '/predict/fashion',
    modelFile: 'best_model.pth',
    useCase: 'Fashion item classification',
    color: 'primary',
  },
  {
    name: 'LiteNet-CIFAR',
    icon: ImageIcon,
    dataset: 'CIFAR-10',
    inputSize: '32×32',
    channels: 3,
    classes: 10,
    endpoint: '/predict/cifar',
    modelFile: 'best_model_cifar.pth',
    useCase: 'Object classification',
    color: 'emerald',
  },
];

const comparisonData = [
  { property: 'Dataset', fashion: 'FashionMNIST', cifar: 'CIFAR-10' },
  { property: 'Input Size', fashion: '28×28', cifar: '32×32' },
  { property: 'Channels', fashion: '1 (Grayscale)', cifar: '3 (RGB)' },
  { property: 'Number of Classes', fashion: '10', cifar: '10' },
  { property: 'Model Size', fashion: '26 MB', cifar: '42 MB' },
  { property: 'Inference Endpoint', fashion: '/predict/fashion', cifar: '/predict/cifar' },
  { property: 'Model File', fashion: 'best_model.pth', cifar: 'best_model_cifar.pth' },
];

export default function ModelsSection() {
  return (
    <section id="models" className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Models</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Two lightweight CNNs optimized for fast inference on different image domains
          </p>
        </motion.div>

        {/* Model Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {models.map((model, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${model.color === 'primary' ? 'gradient-bg' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  }`}>
                  <model.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.useCase}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Dataset', value: model.dataset },
                  { label: 'Input', value: `${model.inputSize} × ${model.channels} channel${model.channels > 1 ? 's' : ''}` },
                  { label: 'Classes', value: model.classes },
                  { label: 'Endpoint', value: model.endpoint },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium font-mono text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Ready for inference</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold">Model Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-4 font-medium">Property</th>
                  <th className="text-left p-4 font-medium">LiteNet-Fashion</th>
                  <th className="text-left p-4 font-medium">LiteNet-CIFAR</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-border/50 last:border-0">
                    <td className="p-4 text-muted-foreground">{row.property}</td>
                    <td className="p-4 font-mono text-sm">{row.fashion}</td>
                    <td className="p-4 font-mono text-sm">{row.cifar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
