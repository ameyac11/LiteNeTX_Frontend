import { useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface Node {
    x: number;
    y: number;
    ring: number;
    angle: number;
    radius: number;
    phase: number;
    orbitSpeed: number;
    pulsePhase: number;
}

interface Edge {
    from: number;
    to: number;
    opacity: number;
}

interface Pulse {
    edgeIdx: number;
    progress: number;
    speed: number;
    alpha: number;
}

export default function NeuralNetworkBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const stateRef = useRef<{
        nodes: Node[];
        edges: Edge[];
        pulses: Pulse[];
    }>({ nodes: [], edges: [], pulses: [] });
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let w = 0, h = 0;

        const init = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement!.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cx = w / 2;
            const cy = h / 2;
            const maxR = Math.min(w, h) * 0.38;
            const rings = [0, maxR * 0.18, maxR * 0.38, maxR * 0.6, maxR * 0.82, maxR];
            const countsPerRing = [1, 5, 8, 12, 14, 16];
            const nodes: Node[] = [];

            for (let r = 0; r < rings.length; r++) {
                const count = countsPerRing[r];
                const ringR = rings[r];
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i + (r % 2 === 0 ? 0 : Math.PI / count);
                    nodes.push({
                        x: cx + Math.cos(angle) * ringR,
                        y: cy + Math.sin(angle) * ringR,
                        ring: r,
                        angle,
                        radius: r === 0 ? 2.5 : 1.2 + (1 - r / rings.length) * 1.3,
                        phase: Math.random() * Math.PI * 2,
                        orbitSpeed: (0.0003 + Math.random() * 0.0002) * (r % 2 === 0 ? 1 : -1),
                        pulsePhase: Math.random() * Math.PI * 2,
                    });
                }
            }

            // Build edges: connect to adjacent rings + some within rings
            const edges: Edge[] = [];
            for (let r = 0; r < rings.length - 1; r++) {
                const current = nodes.filter(n => n.ring === r);
                const next = nodes.filter(n => n.ring === r + 1);
                for (const cn of current) {
                    // Sort next ring nodes by angular proximity
                    const sorted = [...next].sort((a, b) =>
                        Math.abs(angleDiff(a.angle, cn.angle)) - Math.abs(angleDiff(b.angle, cn.angle))
                    );
                    const take = r === 0 ? Math.min(5, sorted.length) : Math.min(2 + Math.floor(Math.random() * 2), sorted.length);
                    for (let k = 0; k < take; k++) {
                        edges.push({
                            from: nodes.indexOf(cn),
                            to: nodes.indexOf(sorted[k]),
                            opacity: 0.06 + Math.random() * 0.06,
                        });
                    }
                }
            }

            // A few cross-ring connections for depth
            for (let r = 0; r < rings.length - 2; r++) {
                const current = nodes.filter(n => n.ring === r);
                const skip = nodes.filter(n => n.ring === r + 2);
                const num = Math.min(2, current.length);
                for (let k = 0; k < num; k++) {
                    const from = current[Math.floor(Math.random() * current.length)];
                    const to = skip[Math.floor(Math.random() * skip.length)];
                    edges.push({
                        from: nodes.indexOf(from),
                        to: nodes.indexOf(to),
                        opacity: 0.03 + Math.random() * 0.03,
                    });
                }
            }

            stateRef.current = { nodes, edges, pulses: [] };
        };

        const angleDiff = (a: number, b: number) => {
            let d = a - b;
            while (d > Math.PI) d -= Math.PI * 2;
            while (d < -Math.PI) d += Math.PI * 2;
            return d;
        };

        init();
        window.addEventListener('resize', init);

        let tick = 0;
        const animate = () => {
            tick++;
            ctx.clearRect(0, 0, w, h);

            const { nodes, edges, pulses } = stateRef.current;
            const cx = w / 2;
            const cy = h / 2;
            const maxR = Math.min(w, h) * 0.38;
            const rings = [0, maxR * 0.18, maxR * 0.38, maxR * 0.6, maxR * 0.82, maxR];
            const time = tick * 0.016; // ~60fps time

            // Animate node positions - gentle orbit
            for (const node of nodes) {
                const ringR = rings[node.ring];
                const currentAngle = node.angle + time * node.orbitSpeed;
                const breathe = Math.sin(time * 0.5 + node.pulsePhase) * 3;
                node.x = cx + Math.cos(currentAngle) * (ringR + breathe);
                node.y = cy + Math.sin(currentAngle) * (ringR + breathe);
            }

            // Colors
            const lineRgb = isDark ? '148,163,184' : '100,116,139';
            const accentRgb = isDark ? '96,165,250' : '59,130,246';
            const nodeRgb = isDark ? '148,163,184' : '71,85,105';

            // Draw center glow
            const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.35);
            const glowAlpha = isDark ? 0.04 : 0.025;
            centerGlow.addColorStop(0, `rgba(${accentRgb},${glowAlpha})`);
            centerGlow.addColorStop(1, `rgba(${accentRgb},0)`);
            ctx.beginPath();
            ctx.arc(cx, cy, maxR * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = centerGlow;
            ctx.fill();

            // Draw ring guides (very faint concentric circles)
            for (let r = 1; r < rings.length; r++) {
                const ringAlpha = isDark ? 0.025 : 0.018;
                ctx.beginPath();
                ctx.arc(cx, cy, rings[r], 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${lineRgb},${ringAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Draw edges with bezier curves
            for (const edge of edges) {
                const from = nodes[edge.from];
                const to = nodes[edge.to];

                // Curve the connection through a control point offset toward center
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const pull = 0.15;
                const cpx = mx - (dx / dist) * dist * pull;
                const cpy = my - (dy / dist) * dist * pull;

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
                ctx.strokeStyle = `rgba(${lineRgb},${edge.opacity})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }

            // Spawn pulses
            if (tick % 25 === 0 && pulses.length < 12) {
                const idx = Math.floor(Math.random() * edges.length);
                pulses.push({
                    edgeIdx: idx,
                    progress: 0,
                    speed: 0.006 + Math.random() * 0.008,
                    alpha: 0.6 + Math.random() * 0.3,
                });
            }

            // Draw pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                const edge = edges[p.edgeIdx];
                const from = nodes[edge.from];
                const to = nodes[edge.to];
                const t = p.progress;

                // Quadratic bezier position
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const pull = 0.15;
                const cpx = mx - (dx / dist) * dist * pull;
                const cpy = my - (dy / dist) * dist * pull;

                const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cpx + t * t * to.x;
                const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cpy + t * t * to.y;

                // Fade envelope
                const fade = t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1;
                const a = fade * p.alpha;

                // Glow
                const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
                glow.addColorStop(0, `rgba(${accentRgb},${a * 0.35})`);
                glow.addColorStop(1, `rgba(${accentRgb},0)`);
                ctx.beginPath();
                ctx.arc(px, py, 8, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(px, py, 1.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${accentRgb},${a * 0.9})`;
                ctx.fill();

                p.progress += p.speed;
                if (p.progress >= 1) pulses.splice(i, 1);
            }

            // Draw nodes
            for (const node of nodes) {
                const pulseFactor = 0.15 * Math.sin(time * 1.5 + node.pulsePhase) + 1;

                // Halo
                const haloR = node.radius * 5 * pulseFactor;
                const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloR);
                const haloAlpha = node.ring === 0 ? 0.18 : 0.08;
                halo.addColorStop(0, `rgba(${node.ring === 0 ? accentRgb : nodeRgb},${haloAlpha})`);
                halo.addColorStop(1, `rgba(${node.ring === 0 ? accentRgb : nodeRgb},0)`);
                ctx.beginPath();
                ctx.arc(node.x, node.y, haloR, 0, Math.PI * 2);
                ctx.fillStyle = halo;
                ctx.fill();

                // Core dot
                const coreAlpha = node.ring === 0 ? 0.7 : 0.3 + (1 - node.ring / 5) * 0.15;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${node.ring === 0 ? accentRgb : nodeRgb},${coreAlpha})`;
                ctx.fill();
            }

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(frameRef.current);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                zIndex: 0,
                maskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 25%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 25%, transparent 100%)',
            }}
        />
    );
}
