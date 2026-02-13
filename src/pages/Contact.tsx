import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Mail, Github, Linkedin, ArrowRight, User, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';
import { cn } from '@/lib/utils';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const allowedOrigins = [
            'https://litenetx.in',
            'https://www.litenetx.in',
            'https://litenetx.vercel.app'
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

            if (!accessKey) {
                throw new Error('Contact form is not configured. Please set up Web3Forms.');
            }

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    from_name: "LiteNeTX Contact Form",
                    subject: "New Message from LiteNeTX",
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
                setTimeout(() => {
                    setFormData({ name: '', email: '', message: '' });
                    setIsSuccess(false);
                }, 3000);
                toast({
                    title: 'Message transmitted',
                    description: 'Connection established. We will respond shortly.',
                });
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            toast({
                title: 'Transmission Error',
                description: error instanceof Error ? error.message : 'Signal lost. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const charCount = formData.message.length;
    const maxChars = 500;

    return (
        <PageTransition>
            <div className="min-h-screen w-full bg-background relative flex items-center justify-center pt-24 pb-12 overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                    <motion.div
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[128px]"
                    />
                    <motion.div
                        animate={{
                            backgroundPosition: ["100% 100%", "0% 0%"],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[128px]"
                    />
                </div>

                <div className="w-full max-w-5xl px-4 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Let's Connect</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Get In Touch
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have a question or want to collaborate? We'd love to hear from you.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Left Panel - Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Quick Contact Card */}
                            <div className="glass-card p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    Quick Contact
                                </h3>

                                <div className="space-y-4">
                                    <a
                                        href="mailto:ameyaccod171@gmail.com"
                                        className="block p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/30 hover:border-primary/30 transition-all group/item"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                            <div className="flex-1">
                                                <div className="text-xs text-muted-foreground mb-1">Email</div>
                                                <div className="text-sm font-medium">ameyaccod171@gmail.com</div>
                                            </div>
                                        </div>
                                    </a>

                                    <div className="grid grid-cols-2 gap-3">
                                        <SocialCard href="https://github.com/AmeyC171" icon={Github} label="GitHub" />
                                        <SocialCard href="https://www.linkedin.com/in/ameyac11" icon={Linkedin} label="LinkedIn" />
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="glass-card p-6 rounded-2xl border border-border/50">
                                <h4 className="font-semibold mb-3">Response Time</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We typically respond within 24-48 hours. For urgent matters, please reach out via email directly.
                                </p>
                            </div>
                        </motion.div>

                        {/* Right Panel - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="lg:col-span-3"
                        >
                            <div className="glass-card p-8 rounded-2xl border border-border/50 relative overflow-hidden">
                                {/* Corner Decorations */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-xl" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />

                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-12"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6"
                                            >
                                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                            </motion.div>
                                            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                            <p className="text-muted-foreground text-center">
                                                Thank you for reaching out. We'll get back to you soon.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Name Field */}
                                                <div className="space-y-2 relative">
                                                    <Label
                                                        htmlFor="name"
                                                        className={cn(
                                                            "text-sm font-medium transition-colors",
                                                            focusedField === 'name' && "text-primary"
                                                        )}
                                                    >
                                                        Name
                                                    </Label>
                                                    <div className="relative">
                                                        <User className={cn(
                                                            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                                            focusedField === 'name' ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            onFocus={() => setFocusedField('name')}
                                                            onBlur={() => setFocusedField(null)}
                                                            required
                                                            placeholder="John Doe"
                                                            className="pl-10 h-12 bg-secondary/20 border-border/50 focus:border-primary/50 rounded-xl transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email Field */}
                                                <div className="space-y-2 relative">
                                                    <Label
                                                        htmlFor="email"
                                                        className={cn(
                                                            "text-sm font-medium transition-colors",
                                                            focusedField === 'email' && "text-primary"
                                                        )}
                                                    >
                                                        Email
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className={cn(
                                                            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                                            focusedField === 'email' ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            onFocus={() => setFocusedField('email')}
                                                            onBlur={() => setFocusedField(null)}
                                                            required
                                                            placeholder="john@example.com"
                                                            className="pl-10 h-12 bg-secondary/20 border-border/50 focus:border-primary/50 rounded-xl transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Message Field */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor="message"
                                                        className={cn(
                                                            "text-sm font-medium transition-colors",
                                                            focusedField === 'message' && "text-primary"
                                                        )}
                                                    >
                                                        Message
                                                    </Label>
                                                    <span className={cn(
                                                        "text-xs transition-colors",
                                                        charCount > maxChars ? "text-destructive" : "text-muted-foreground"
                                                    )}>
                                                        {charCount}/{maxChars}
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <MessageSquare className={cn(
                                                        "absolute left-3 top-3 w-4 h-4 transition-colors",
                                                        focusedField === 'message' ? "text-primary" : "text-muted-foreground"
                                                    )} />
                                                    <Textarea
                                                        id="message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('message')}
                                                        onBlur={() => setFocusedField(null)}
                                                        required
                                                        maxLength={maxChars}
                                                        rows={6}
                                                        placeholder="Tell us about your project or inquiry..."
                                                        className="pl-10 pt-3 bg-secondary/20 border-border/50 focus:border-primary/50 rounded-xl resize-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting || charCount > maxChars}
                                                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4 mr-2" />
                                                            Send Message
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

function SocialCard({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/30 hover:border-primary/30 transition-all group"
        >
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs font-medium">{label}</span>
        </a>
    );
}
