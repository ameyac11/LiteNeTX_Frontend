import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { Brain, TrendingUp, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

const parameterData = [
    {
        name: 'LiteNeTX-FMNIST',
        Baseline: 6.5,
        Optimized: 0.426,
        reduction: '93%',
    },
    {
        name: 'LiteNeTX-CIFAR10',
        Baseline: 11.2,
        Optimized: 1.9,
        reduction: '83%',
    },
    {
        name: 'LiteNeTX-CIFAR100',
        Baseline: 29.67,
        Optimized: 14.6,
        reduction: '51%',
    },
];

const accuracyData = [
    {
        name: 'LiteNeTX-FMNIST',
        Baseline: 91.0,
        Optimized: 98.93,
    },
    {
        name: 'LiteNeTX-CIFAR10',
        Baseline: 92.5,
        Optimized: 96.71,
    },
    {
        name: 'LiteNeTX-CIFAR100',
        Baseline: 84.2,
        Optimized: 91.54,
    },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border p-3 rounded-lg shadow-xl">
                <p className="font-semibold mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-mono font-medium">
                            {entry.value}
                            {entry.name.includes('Accuracy') ? '%' : 'M'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function PerformanceInsights() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container-custom relative z-10">
                <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />


                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Performance Insights
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Parameter efficiency and architectural refinement across LiteNeTX models.
                    </p>
                </motion.div>

                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">

                    {/* Parameter Reduction Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-6 h-full bg-card/50 backdrop-blur border-border/50">
                            <div className="flex items-center gap-2 mb-6">
                                <Brain className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-semibold">Parameter Efficiency (Millions)</h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={parameterData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        barGap={8}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => value.replace('LiteNeTX-', '')}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}M`}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                        <Legend iconType="circle" />
                                        <Bar
                                            dataKey="Baseline"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            name="Baseline Parameters"
                                            fillOpacity={0.3}
                                            stroke="#3b82f6"
                                            strokeWidth={1}
                                        />
                                        <Bar
                                            dataKey="Optimized"
                                            fill="#10b981"
                                            radius={[4, 4, 0, 0]}
                                            name="Optimized Parameters"
                                            stroke="#10b981"
                                            strokeWidth={1}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Accuracy Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="p-6 h-full bg-card/50 backdrop-blur border-border/50">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-lg font-semibold">Accuracy Comparison (%)</h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={accuracyData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => value.replace('LiteNeTX-', '')}
                                        />
                                        <YAxis
                                            domain={[70, 100]}
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" />
                                        <Area
                                            type="monotone"
                                            dataKey="Optimized"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorOptimized)"
                                            name="Optimized Accuracy"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="Baseline"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#colorBaseline)"
                                            name="Baseline Accuracy"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Optimization Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {parameterData.map((model, index) => (
                        <motion.div
                            key={model.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                        >
                            <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{model.name}</h3>
                                        <div className="text-sm text-muted-foreground mt-1">Parameter Reduction</div>
                                    </div>
                                    <div className="text-2xl font-bold text-primary">{model.reduction}</div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {index === 0 && "Achieved massive compression by replacing standard convolutions with strided variations and removing redundant FC layers."}
                                    {index === 1 && "Optimized custom backbone with aggressive channel pruning in early stages while maintaining feature richness in deep layers."}
                                    {index === 2 && "Utilized Squeeze-and-Excitation blocks to boost representational power without the massive parameter cost of standard bottlenecks."}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>



            </div>
        </div>
    );
}
