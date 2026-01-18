import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-6 mt-12 border-t border-border bg-muted/30 backdrop-blur-sm">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2 order-1 md:order-1">
            <span className="text-lg font-bold">
              Lite<span className="gradient-text">NeT</span>
            </span>
          </Link>

          {/* Copyright - Center */}
          <div className="text-xs text-muted-foreground/60 order-3 md:order-2 text-center">
            <p>© {new Date().getFullYear()} LiteNeT • Built with PyTorch, FastAPI & React</p>
          </div>

          {/* Social - Right */}
          <div className="flex items-center gap-3 order-2 md:order-3">
            <a
              href="https://github.com/AmeyC171"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/ameya-chopade11"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:ameyaccod171@gmail.com"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
