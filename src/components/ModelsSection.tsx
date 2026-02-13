import { motion } from 'framer-motion';
import { Shirt, ImageIcon, Grid3X3, CheckCircle2 } from 'lucide-react';

const models = [
  {
    name: 'LiteNeTX-FMNIST',
    icon: Shirt,
    dataset: 'FashionMNIST',
    inputSize: '28×28',
    channels: 1,
    classes: 10,
    params: '426K',
    modelSize: '1.63 MB',
    endpoint: '/predict/fashion',
    useCase: 'Grayscale fashion classification',
    color: 'primary',
  },
  {
    name: 'LiteNeTX-CIFAR10',
    icon: ImageIcon,
    dataset: 'CIFAR-10',
    inputSize: '32×32',
    channels: 3,
    classes: 10,
    params: '1.9M',
    modelSize: '7.26 MB',
    endpoint: '/predict/cifar',
    useCase: 'RGB object classification',
    color: 'emerald',
  },
  {
    name: 'LiteNeTX-CIFAR100',
    icon: Grid3X3,
    dataset: 'CIFAR-100',
    inputSize: '32×32',
    channels: 3,
    classes: 100,
    params: '14.6M',
    modelSize: '55.62 MB',
    endpoint: '/predict/cifar100',
    useCase: 'Fine-grained 100-class classification',
    color: 'purple',
  },
];

const comparisonData = [
  { property: 'Dataset', values: ['FashionMNIST', 'CIFAR-10', 'CIFAR-100'] },
  { property: 'Input Size', values: ['1×28×28', '3×32×32', '3×32×32'] },
  { property: 'Classes', values: ['10', '10', '100'] },
  { property: 'Parameters', values: ['426,602', '1,903,146', '14,579,492'] },
  { property: 'Model Size', values: ['1.63 MB', '7.26 MB', '55.62 MB'] },
  { property: 'Endpoint', values: ['/predict/fashion', '/predict/cifar', '/predict/cifar100'] },
];

const headerColors = ['text-blue-400', 'text-emerald-400', 'text-purple-400'];

export default function ModelsSection() {
  return (
    <section id="models" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Models</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three lightweight CNNs optimized for fast inference across different image domains
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${model.color === 'primary' ? 'gradient-bg' :
                  model.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                    'bg-gradient-to-br from-purple-500 to-fuchsia-500'
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
                  { label: 'Input', value: `${model.inputSize} × ${model.channels}ch` },
                  { label: 'Classes', value: model.classes },
                  { label: 'Parameters', value: model.params },
                  { label: 'Model Size', value: model.modelSize },
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
                  <th className={`text-left p-4 font-bold ${headerColors[0]}`}>LiteNeTX-FMNIST</th>
                  <th className={`text-left p-4 font-bold ${headerColors[1]}`}>LiteNeTX-CIFAR10</th>
                  <th className={`text-left p-4 font-bold ${headerColors[2]}`}>LiteNeTX-CIFAR100</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-border/50 last:border-0">
                    <td className="p-4 text-muted-foreground">{row.property}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className={`p-4 font-mono text-sm ${headerColors[i]}`}>{val}</td>
                    ))}
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
