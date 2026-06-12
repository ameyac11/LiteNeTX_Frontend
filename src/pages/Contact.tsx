import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Mail, Github, Linkedin, MapPin, Twitter, MessageSquare, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate request origin
        const allowedOrigins = [
            'https://litenetx.in',
            'https://www.litenetx.in',
            'https://litenetx.vercel.app',
            'http://localhost:5173' // Local dev only
        ];
        const currentOrigin = window.location.origin;

        if (import.meta.env.PROD && !allowedOrigins.includes(currentOrigin)) {
            toast({
                title: 'Access Denied',
                description: 'This form can only be used from the official LiteNeTX website.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

            // Dev fallback enabled
            if (!accessKey && import.meta.env.DEV) {
                console.log("Dev mode: Simulating submission", formData);
                await new Promise(resolve => setTimeout(resolve, 1500));
                setIsSuccess(true);
                toast({ title: 'Message sent (Dev)!', description: "We'll be in touch." });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setIsSuccess(false), 5000);
                setIsSubmitting(false);
                return;
            }

            if (!accessKey) throw new Error('Contact form is not configured.');

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: accessKey,
                    from_name: "LiteNeTX Contact",
                    subject: formData.subject || "New Message",
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    botcheck: '',
                    _origin: currentOrigin,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setIsSuccess(true);
                toast({ title: 'Message sent!', description: "We'll be in touch." });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                throw new Error(result.message || 'Failed to send');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to send message. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-12 bg-white dark:bg-[#09090b] text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center text-center mb-16 space-y-5"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Let's connect
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Get In Touch
                        </h1>

                        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                            Ready to start your next project? Let's collaborate and create something amazing together!
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* Left Column: Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-8"
                        >
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Let's Start a Conversation
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    I'm always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Whether you have a question or just want to say hello, I'd love to hear from you!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email Card */}
                                <div className="group bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 p-5 rounded-xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                                        <Mail className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 text-sm">Email</h3>
                                    <a href="mailto:ameyaccod171@gmail.com" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        ameyaccod171@gmail.com
                                    </a>
                                </div>

                                {/* Location Card */}
                                <div className="group bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 p-5 rounded-xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                                        <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 text-sm">Location</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Based in India</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-4">Connect With Me</h4>
                                <div className="flex gap-3">
                                    {[
                                        { icon: Github, href: 'https://github.com/AmeyC171' },
                                        { icon: Linkedin, href: 'https://www.linkedin.com/in/ameyac11' },
                                        { icon: Mail, href: 'mailto:ameyaccod171@gmail.com' },
                                    ].map((item, i) => (
                                        <a
                                            key={i}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                                        >
                                            <item.icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 lg:p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send Message</h2>
                            </div>

                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Message Sent</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Thank you for reaching out! I'll get back to you soon.</p>
                                        <Button
                                            onClick={() => setIsSuccess(false)}
                                            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 rounded-full px-6 h-10 text-sm"
                                        >
                                            Send Another
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 pl-1">Full Name</Label>
                                                <Input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-white dark:bg-[#121214] border-slate-200 dark:border-white/10 h-11 text-slate-900 dark:text-white focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700 rounded-lg px-3 text-sm"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 pl-1">Email</Label>
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-white dark:bg-[#121214] border-slate-200 dark:border-white/10 h-11 text-slate-900 dark:text-white focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700 rounded-lg px-3 text-sm"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 pl-1">Subject</Label>
                                            <Input
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="bg-white dark:bg-[#121214] border-slate-200 dark:border-white/10 h-11 text-slate-900 dark:text-white focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700 rounded-lg px-3 text-sm"
                                                placeholder="Project Collaboration"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 pl-1">Message</Label>
                                            <Textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                className="bg-white dark:bg-[#121214] border-slate-200 dark:border-white/10 min-h-[140px] text-slate-900 dark:text-white focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 transition-all resize-none p-3 placeholder:text-slate-400 dark:placeholder:text-slate-700 rounded-lg px-3 text-sm"
                                                placeholder="Tell me about your project..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-11 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-black rounded-lg mt-2 transition-all shadow-sm"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> :
                                                <span className="flex items-center gap-2">
                                                    <Send className="w-4 h-4" /> Send Message
                                                </span>
                                            }
                                        </Button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
