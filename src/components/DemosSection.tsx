import { motion } from 'framer-motion';
import DemoCard from './DemoCard';

const fashionLabels = [
  'T-shirt/top',
  'Trouser',
  'Pullover',
  'Dress',
  'Coat',
  'Sandal',
  'Shirt',
  'Sneaker',
  'Bag',
  'Ankle boot',
];

const cifarLabels = [
  'airplane',
  'automobile',
  'bird',
  'cat',
  'deer',
  'dog',
  'frog',
  'horse',
  'ship',
  'truck',
];

export default function DemosSection() {
  return (
    <section id="demos" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Demos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload an image and get real-time predictions from our trained CNN models
          </p>
        </motion.div>

        {/* Demo Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <DemoCard
            id="demo-fashion"
            title="LiteNet-Fashion Demo"
            description="Classify fashion items using our FashionMNIST model"
            endpoint="/predict/fashion"
            labels={fashionLabels}
            inputFormat="28×28 grayscale (any image accepted)"
            colorScheme="fashion"
          />
          <DemoCard
            id="demo-cifar"
            title="LiteNet-CIFAR Demo"
            description="Classify objects using our CIFAR-10 model"
            endpoint="/predict/cifar"
            labels={cifarLabels}
            inputFormat="32×32 RGB (any image accepted)"
            colorScheme="cifar"
          />
        </div>
      </div>
    </section>
  );
}
