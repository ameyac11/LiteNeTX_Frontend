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
                    from_name: "LiteNeT Contact Form",
                    subject: "New Message from LiteNeT",
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    botcheck: '',
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
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                            Get In Touch
                        </h1>
                        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                            Have a question or want to work together? Feel free to reach out.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus-visible:border-white/40 focus-visible:ring-1 focus-visible:ring-white/20 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
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
                                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus-visible:border-white/40 focus-visible:ring-1 focus-visible:ring-white/20 h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-medium text-gray-300">
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
                                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus-visible:border-white/40 focus-visible:ring-1 focus-visible:ring-white/20 resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-11 bg-white text-black hover:bg-gray-200 font-medium transition-all duration-200"
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
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                                        <a
                                            href="mailto:ameyaccod171@gmail.com"
                                            className="text-white hover:text-gray-300 transition-colors text-base font-medium break-all"
                                        >
                                            ameyaccod171@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                                <h3 className="text-sm font-medium text-gray-400 mb-4">Connect With Me</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="https://github.com/AmeyC171"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-lg transition-all"
                                    >
                                        <Github className="w-5 h-5 text-white" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/ameya-chopade11"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-lg transition-all"
                                    >
                                        <Linkedin className="w-5 h-5 text-white" />
                                    </a>
                                </div>
                            </div>

                            {/* Optional Info Box */}
                            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg p-6">
                                <p className="text-sm text-gray-400 leading-relaxed">
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
