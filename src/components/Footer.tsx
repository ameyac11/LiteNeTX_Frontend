import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="py-12 mt-12 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">

          {/* Left Column - Brand */}
          <div className="flex flex-col gap-4 max-w-sm text-center md:text-left">
            <Link to="/" className="flex items-center gap-0 justify-center md:justify-start">
              <img
                src={theme === 'dark' ? "/LiteNeTX_logo_bwhite.png" : "/LiteNeTX_logo_bblack.png"}
                alt="LiteNeTX Logo"
                className="w-10 h-10 object-contain -mr-1"
              />
              <span className="text-lg font-bold">
                LiteNet<span className="text-primary">TX</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Custom CNN models built from scratch
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4">
              © {new Date().getFullYear()} LiteNeTX. All rights reserved.
            </p>
          </div>

          {/* Center Column - Navigation - Properly Centered */}
          <div className="flex items-center gap-8 md:-ml-20">
            <Link to="/demos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Demos</Link>
            <Link to="/models" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Models</Link>
            <Link to="/architecture" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Architecture</Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* Right Column - Social & Info */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/AmeyC171"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ameyac11"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:ameyaccod171@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Crafted with PyTorch & React
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
