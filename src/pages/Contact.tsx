import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Mail, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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

        // In production, only allow litenetx.in and litenetx.vercel.app
        if (import.meta.env.PROD && !allowedOrigins.includes(currentOrigin)) {
            toast({
                title: 'Access Denied',
                description: 'This form can only be used from the official LiteNeTX website (litenetx.in, www.litenetx.in, or litenetx.vercel.app).',
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
                    // Add origin information for additional security tracking
                    _origin: currentOrigin,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast({
                    title: 'Message transmitted',
                    description: 'Connection established. We will respond shortly.',
                });
                setFormData({ name: '', email: '', message: '' });
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

    return (
        <PageTransition>
            <div className="min-h-screen w-full bg-background pt-20 px-4 md:px-8 flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
                            Get In Touch
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question or want to work together? Feel free to reach out.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 md:p-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                        className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                        className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-medium text-foreground">
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell me about your project or inquiry..."
                                        className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-200"
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
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Email Section */}
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-border transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Email</h3>
                                        <a
                                            href="mailto:ameyaccod171@gmail.com"
                                            className="text-foreground hover:text-primary transition-colors text-base font-medium break-all"
                                        >
                                            ameyaccod171@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links Section */}
                            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Connect With Me</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="https://github.com/AmeyC171"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 bg-background/50 hover:bg-accent border border-border hover:border-border/80 rounded-lg transition-all"
                                    >
                                        <Github className="w-5 h-5 text-foreground" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/ameyac11"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 bg-background/50 hover:bg-accent border border-border hover:border-border/80 rounded-lg transition-all"
                                    >
                                        <Linkedin className="w-5 h-5 text-foreground" />
                                    </a>
                                </div>
                            </div>

                            {/* Optional Info Box */}
                            <div className="bg-gradient-to-br from-card/50 to-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    I typically respond within 24-48 hours. For urgent inquiries, feel free to reach out via LinkedIn.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-muted-foreground hover:text-white hover:border-white/30 transition-all">
            <Icon className="w-4 h-4" />
        </a>
    );
}
