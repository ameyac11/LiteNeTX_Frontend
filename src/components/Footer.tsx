import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const footerLinks = [
  { href: '/demos', label: 'Demos' },
  { href: '/models', label: 'Models' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/performance', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  {
    href: 'https://github.com/AmeyC171',
    icon: Github,
    label: 'GitHub',
    hoverColor: 'hover:text-slate-900 dark:hover:text-white',
  },
  {
    href: 'https://www.linkedin.com/in/ameyac11',
    icon: Linkedin,
    label: 'LinkedIn',
    hoverColor: 'hover:text-slate-900 dark:hover:text-white',
  },
  {
    href: 'mailto:ameyaccod171@gmail.com',
    icon: Mail,
    label: 'Email',
    hoverColor: 'hover:text-slate-900 dark:hover:text-white',
  },
];

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="mt-12 relative">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />

      <div className="bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-sm py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 px-4">

            {/* Left Column - Brand */}
            <div className="flex flex-col gap-3 max-w-xs text-center md:text-left">
              <Link to="/" className="flex items-center gap-0 justify-center md:justify-start group">
                <img
                  src={theme === 'dark' ? '/LiteNeTX_logo_bwhite.png' : '/LiteNeTX_logo_bblack.png'}
                  alt="LiteNeTX Logo"
                  className="w-9 h-9 object-contain -mr-1"
                />
                <span className="text-base font-bold">
                  LiteNet<span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">TX</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Custom CNN models built from scratch — efficient, accurate, and CPU-ready.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-600">
                © {new Date().getFullYear()} LiteNeTX. All rights reserved.
              </p>
            </div>

            {/* Center Column - Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Column - Social */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400 dark:text-slate-500 ${social.hoverColor} hover:border-slate-300 dark:hover:border-white/20 hover:scale-110 transition-all duration-200`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-600 flex items-center gap-1">
                Crafted with PyTorch & React
                <ArrowUpRight className="w-3 h-3" />
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
