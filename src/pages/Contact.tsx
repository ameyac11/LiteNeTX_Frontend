import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Mail, Github, Linkedin, Sparkles } from 'lucide-react';
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

        // Security: Validate origin to prevent unauthorized form submissions
        const allowedOrigins = [
            'https://litenetx.in',
            'https://www.litenetx.in',
            'https://litenetx.vercel.app'
        ];

        const currentOrigin = window.location.origin;

        // In production, only allow official domains
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
                    subject: formData.subject || "New Message from LiteNeTX",
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
                toast({
                    title: 'Message sent!',
                    description: 'Thank you for reaching out. We\'ll get back to you soon.',
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
                // Reset success state after 3 seconds
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
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

    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-background relative overflow-hidden">
                {/* Background Effects */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Let's Connect</span>
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Get in <span className="text-primary">Touch</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Have questions about LiteNeTX? We'd love to hear from you.
                            </p>
                        </motion.div>

                        {/* Contact Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                        >
                            {[
                                { icon: Mail, label: 'Email', href: 'mailto:ameyaccod171@gmail.com' },
                                { icon: Github, label: 'GitHub', href: 'https://github.com/AmeyC171', external: true },
                                { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/ameyac11', external: true },
                            ].map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors shadow-sm"
                                >
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            ))}
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-card border border-border rounded-2xl p-8 shadow-sm relative overflow-hidden"
                        >
                            {/* Corner Decorations */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />

                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col items-center justify-center py-12"
                                    >
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground text-center">
                                            We'll get back to you shortly.
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-base">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={isSubmitting}
                                                    className="h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-base">Email</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={isSubmitting}
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-base">Subject</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="What's this about?"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="h-12"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-base">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Your message..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                rows={6}
                                                className="resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium"
                                            size="lg"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
