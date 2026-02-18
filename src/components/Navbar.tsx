import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/demos', label: 'Demos' },
  { href: '/models', label: 'Models' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/performance', label: 'Insights' },
  { href: '/3d-nn', label: '3D View' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const is3DPage = location.pathname === '/3d-nn';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${is3DPage
        ? 'bg-transparent py-2'
        : isScrolled
          ? 'bg-transparent py-2'
          : 'bg-transparent py-2.5'
        }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative flex items-center bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/30 transition-all shadow-sm group z-50"
        >
          <img
            src={theme === 'dark' ? '/LiteNeTX_logo_bwhite.png' : '/LiteNeTX_logo_bblack.png'}
            alt="LiteNeTX Logo"
            className="w-6 h-6 object-contain mr-2"
          />
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            LiteNet<span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">TX</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center gap-1 p-1 rounded-full backdrop-blur-sm shadow-sm ${is3DPage ? 'bg-white/90 dark:bg-white/10 border border-white/20' : 'bg-white/20 dark:bg-white/10 border border-slate-200 dark:border-white/10'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 z-10 ${isActive(link.href)
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {isActive(link.href) && (
                <motion.div
                  className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className={`hidden md:flex items-center gap-1 p-1 rounded-full backdrop-blur-sm shadow-sm ${is3DPage ? 'bg-white/90 dark:bg-white/10 border border-white/20' : 'bg-white/20 dark:bg-white/10 border border-slate-200 dark:border-white/10'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-8 h-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button
            asChild
            size="sm"
            className="rounded-full px-4 h-8 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 border-0 shadow-sm transition-all"
          >
            <Link to="/demos">
              <Zap className="w-3 h-3 mr-1.5 fill-current" />
              Try Demo
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg w-9 h-9"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${is3DPage ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl mt-2 mx-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] shadow-xl"
          >
            <div className="p-3 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${isActive(link.href)
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                  )}
                </Link>
              ))}
              <div className="pt-2 pb-1 px-1">
                <Button
                  asChild
                  className="w-full rounded-xl text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 border-0 transition-colors"
                >
                  <Link to="/demos" onClick={() => setIsMobileMenuOpen(false)}>
                    <Zap className="w-3.5 h-3.5 mr-2 fill-current" />
                    Try Demo
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
