import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { Brain, TrendingUp, Zap, ArrowDown } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const parameterData = [
    { name: 'LiteNeTX-FMNIST', Baseline: 6.5, Optimized: 0.426, reduction: '93%' },
    { name: 'LiteNeTX-CIFAR10', Baseline: 11.2, Optimized: 1.9, reduction: '83%' },
    { name: 'LiteNeTX-CIFAR100', Baseline: 29.67, Optimized: 18.9, reduction: '36%' },
];

const accuracyData = [
    { name: 'LiteNeTX-FMNIST', Baseline: 91.0, Optimized: 98.93 },
    { name: 'LiteNeTX-CIFAR10', Baseline: 92.5, Optimized: 96.71 },
    { name: 'LiteNeTX-CIFAR100', Baseline: 84.2, Optimized: 91.54 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-[#1a1a1e] border border-slate-200 dark:border-white/10 p-4 rounded-xl shadow-xl">
                <p className="font-semibold text-sm mb-2 text-slate-900 dark:text-white">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            {entry.value}{entry.name.includes('Accuracy') ? '%' : 'M'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const summaryStats = [
    {
        label: 'Best Accuracy',
        value: '98.93%',
        sub: 'LiteNeTX-FMNIST',
        icon: TrendingUp,
        gradient: 'icon-gradient-blue',
        color: 'text-blue-500',
        glow: 'group-hover:shadow-slate-500/10',
        bgGlow: 'from-slate-500/[0.04] to-transparent',
    },
    {
        label: 'Max Reduction',
        value: '93%',
        sub: 'Parameter compression',
        icon: ArrowDown,
        gradient: 'icon-gradient-emerald',
        color: 'text-emerald-500',
        glow: 'group-hover:shadow-slate-500/10',
        bgGlow: 'from-slate-500/[0.04] to-transparent',
    },
    {
        label: 'Min Parameters',
        value: '0.43M',
        sub: 'LiteNeTX-FMNIST',
        icon: Zap,
        gradient: 'icon-gradient-blue',
        color: 'text-blue-500',
        glow: 'group-hover:shadow-slate-500/10',
        bgGlow: 'from-slate-500/[0.04] to-transparent',
    },
];

const modelDescriptions = [
    'Achieved massive compression by replacing standard convolutions with strided variations and removing redundant FC layers.',
    'Optimized custom backbone with aggressive channel pruning in early stages while maintaining feature richness in deep layers.',
    'Utilized Squeeze-and-Excitation blocks to boost representational power without the massive parameter cost of standard bottlenecks.',
];

export default function PerformanceInsights() {
    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-12 bg-white dark:bg-[#09090b] relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="container-custom relative z-10">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400 mb-4 backdrop-blur-md shadow-sm">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                            Benchmarks & Analysis
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            Performance Insights
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Deep-dive analysis of <span className="text-slate-900 dark:text-white font-semibold">parameter efficiency</span> and <span className="text-slate-900 dark:text-white font-semibold">architectural refinements</span> across the LiteNeTX ecosystem.
                        </p>
                    </motion.div>

                    {/* Summary Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid md:grid-cols-3 gap-4 mb-8"
                    >
                        {summaryStats.map((stat, i) => (
                            <div
                                key={i}
                                className={`group relative p-5 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden`}
                            >
                                {/* Gradient Top Border */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${stat.gradient} p-0.5 shadow-md group-hover:scale-105 transition-transform duration-500`}>
                                        <div className="w-full h-full bg-white dark:bg-black/40 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 uppercase tracking-wider`}>
                                        {i === 0 ? 'KPI' : i === 1 ? 'Efficiency' : 'Optimization'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{stat.label}</div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</span>
                                    </div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2 mt-1">
                                        {stat.sub}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Charts Grid */}
                    <div className="grid lg:grid-cols-2 gap-4 mb-8">

                        {/* Parameter Reduction Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="p-5 h-full bg-white/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.08] backdrop-blur-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <Brain className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Parameter Efficiency</h3>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Baseline vs Optimized (Millions)</p>

                                    </div>
                                </div>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={parameterData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} barGap={6}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#888888"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(v) => v.replace('LiteNeTX-', '')}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(v) => `${v}M`}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.05)' }} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                                            <Bar dataKey="Baseline" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Baseline" fillOpacity={0.25} stroke="#3b82f6" strokeWidth={1.5} />
                                            <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} name="Optimized" stroke="#10b981" strokeWidth={1.5} />
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
                            <Card className="p-5 h-full bg-white/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.08] backdrop-blur-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Accuracy Comparison</h3>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Baseline vs Optimized (%)</p>
                                    </div>
                                </div>
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={accuracyData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#888888"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(v) => v.replace('LiteNeTX-', '')}
                                            />
                                            <YAxis
                                                domain={[70, 100]}
                                                stroke="#888888"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(v) => `${v}%`}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                                            <Area type="monotone" dataKey="Optimized" stroke="#10b981" fillOpacity={1} fill="url(#colorOptimized)" name="Optimized Accuracy" strokeWidth={2.5} />
                                            <Area type="monotone" dataKey="Baseline" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBaseline)" name="Baseline Accuracy" strokeWidth={2} strokeDasharray="5 5" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Optimization Summary Cards */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {parameterData.map((model, index) => {
                            // Define model-specific colors
                            const gradients = [
                                'from-blue-500 to-cyan-500',       // FMNIST
                                'from-emerald-500 to-teal-500',    // CIFAR-10
                                'from-purple-500 to-fuchsia-500'   // CIFAR-100
                            ];
                            const shadowColors = [
                                'shadow-blue-500/20',
                                'shadow-emerald-500/20',
                                'shadow-purple-500/20'
                            ];
                            const currentGradient = gradients[index];
                            const currentShadow = shadowColors[index];

                            return (
                                <motion.div
                                    key={model.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                >
                                    <Card className="h-full p-5 bg-white/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.08] backdrop-blur-xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group flex flex-col">

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                                                Spec Sheet
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 group-hover:bg-green-500 transition-colors duration-300" />
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{model.name}</h3>
                                            <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">
                                                Analysis Report
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between items-end mb-1.5">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">Parameter Reduction</span>
                                                        <span className={`text-xl font-black bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}>
                                                            {model.reduction}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${currentGradient} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                                                            style={{ width: model.reduction }}
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                                                    {modelDescriptions[index]}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 flex gap-2">
                                            {['Efficient', 'Optimized', 'v1.0'].map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100/50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </PageTransition>
    );
}
