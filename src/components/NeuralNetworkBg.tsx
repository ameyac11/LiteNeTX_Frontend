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
    colorIdx: number; // 0=blue, 1=cyan, 2=indigo
    trail: { x: number; y: number; a: number }[];
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

        const angleDiff = (a: number, b: number) => {
            let d = a - b;
            while (d > Math.PI) d -= Math.PI * 2;
            while (d < -Math.PI) d += Math.PI * 2;
            return d;
        };

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
            const maxR = Math.min(w, h) * 0.42;
            const rings = [0, maxR * 0.16, maxR * 0.34, maxR * 0.55, maxR * 0.76, maxR];
            const countsPerRing = [1, 6, 10, 14, 16, 18];
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
                        radius: r === 0 ? 3 : 1.4 + (1 - r / rings.length) * 1.6,
                        phase: Math.random() * Math.PI * 2,
                        orbitSpeed: (0.00025 + Math.random() * 0.00015) * (r % 2 === 0 ? 1 : -1),
                        pulsePhase: Math.random() * Math.PI * 2,
                    });
                }
            }

            // Link adjacent rings
            const edges: Edge[] = [];
            for (let r = 0; r < rings.length - 1; r++) {
                const current = nodes.filter(n => n.ring === r);
                const next = nodes.filter(n => n.ring === r + 1);
                for (const cn of current) {
                    const sorted = [...next].sort((a, b) =>
                        Math.abs(angleDiff(a.angle, cn.angle)) - Math.abs(angleDiff(b.angle, cn.angle))
                    );
                    const take = r === 0 ? Math.min(6, sorted.length) : Math.min(2 + Math.floor(Math.random() * 2), sorted.length);
                    for (let k = 0; k < take; k++) {
                        edges.push({
                            from: nodes.indexOf(cn),
                            to: nodes.indexOf(sorted[k]),
                            opacity: 0.10 + Math.random() * 0.10,
                        });
                    }
                }
            }

            // Add depth links
            for (let r = 0; r < rings.length - 2; r++) {
                const current = nodes.filter(n => n.ring === r);
                const skip = nodes.filter(n => n.ring === r + 2);
                const num = Math.min(3, current.length);
                for (let k = 0; k < num; k++) {
                    const from = current[Math.floor(Math.random() * current.length)];
                    const to = skip[Math.floor(Math.random() * skip.length)];
                    edges.push({
                        from: nodes.indexOf(from),
                        to: nodes.indexOf(to),
                        opacity: 0.05 + Math.random() * 0.05,
                    });
                }
            }

            stateRef.current = { nodes, edges, pulses: [] };
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
            const maxR = Math.min(w, h) * 0.42;
            const rings = [0, maxR * 0.16, maxR * 0.34, maxR * 0.55, maxR * 0.76, maxR];
            const time = tick * 0.016;

            // Animate node motion
            for (const node of nodes) {
                const ringR = rings[node.ring];
                const currentAngle = node.angle + time * node.orbitSpeed * 60;
                const breathe = Math.sin(time * 0.4 + node.pulsePhase) * 2.5;
                node.x = cx + Math.cos(currentAngle) * (ringR + breathe);
                node.y = cy + Math.sin(currentAngle) * (ringR + breathe);
            }

            // Choose color set
            const lineRgb = isDark ? '148,163,184' : '100,116,139';
            const accentColors = isDark
                ? ['96,165,250', '34,211,238', '129,140,248']   // blue, cyan, indigo
                : ['59,130,246', '6,182,212', '99,102,241'];
            const nodeRgb = isDark ? '148,163,184' : '71,85,105';
            const centerRgb = accentColors[0];

            // Center glow bloom
            const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.55);
            const glowAlpha = isDark ? 0.07 : 0.04;
            centerGlow.addColorStop(0, `rgba(${centerRgb},${glowAlpha})`);
            centerGlow.addColorStop(0.5, `rgba(${accentColors[1]},${glowAlpha * 0.4})`);
            centerGlow.addColorStop(1, `rgba(${centerRgb},0)`);
            ctx.beginPath();
            ctx.arc(cx, cy, maxR * 0.55, 0, Math.PI * 2);
            ctx.fillStyle = centerGlow;
            ctx.fill();

            // Outer glow ring
            const outerGlow = ctx.createRadialGradient(cx, cy, maxR * 0.5, cx, cy, maxR * 0.9);
            outerGlow.addColorStop(0, `rgba(${accentColors[2]},0)`);
            outerGlow.addColorStop(0.5, `rgba(${accentColors[2]},${isDark ? 0.025 : 0.015})`);
            outerGlow.addColorStop(1, `rgba(${accentColors[2]},0)`);
            ctx.beginPath();
            ctx.arc(cx, cy, maxR * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = outerGlow;
            ctx.fill();

            // Faint ring guides
            for (let r = 1; r < rings.length; r++) {
                const ringAlpha = isDark ? 0.04 : 0.025;
                ctx.beginPath();
                ctx.arc(cx, cy, rings[r], 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${lineRgb},${ringAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Draw curved edges
            for (const edge of edges) {
                const from = nodes[edge.from];
                const to = nodes[edge.to];
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const pull = 0.12;
                const cpx = mx - (dx / dist) * dist * pull;
                const cpy = my - (dy / dist) * dist * pull;

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
                ctx.strokeStyle = `rgba(${lineRgb},${edge.opacity})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }

            // Spawn pulses often
            if (tick % 18 === 0 && pulses.length < 20) {
                const idx = Math.floor(Math.random() * edges.length);
                pulses.push({
                    edgeIdx: idx,
                    progress: 0,
                    speed: 0.005 + Math.random() * 0.007,
                    alpha: 0.7 + Math.random() * 0.3,
                    colorIdx: Math.floor(Math.random() * 3),
                    trail: [],
                });
            }

            // Draw pulse trails
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                const edge = edges[p.edgeIdx];
                const from = nodes[edge.from];
                const to = nodes[edge.to];
                const t = p.progress;

                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const pull = 0.12;
                const cpx = mx - (dx / dist) * dist * pull;
                const cpy = my - (dy / dist) * dist * pull;

                const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cpx + t * t * to.x;
                const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cpy + t * t * to.y;

                const fade = t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1;
                const a = fade * p.alpha;
                const rgb = accentColors[p.colorIdx];

                // Extend pulse trail
                p.trail.push({ x: px, y: py, a });
                if (p.trail.length > 10) p.trail.shift();

                // Render trail dots
                for (let j = 0; j < p.trail.length; j++) {
                    const tp = p.trail[j];
                    const trailFade = (j / p.trail.length) * tp.a * 0.4;
                    const trailR = 1.2 * (j / p.trail.length);
                    if (trailFade > 0.01) {
                        ctx.beginPath();
                        ctx.arc(tp.x, tp.y, trailR, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${rgb},${trailFade})`;
                        ctx.fill();
                    }
                }

                // Outer glow bloom
                const glow = ctx.createRadialGradient(px, py, 0, px, py, 12);
                glow.addColorStop(0, `rgba(${rgb},${a * 0.5})`);
                glow.addColorStop(1, `rgba(${rgb},0)`);
                ctx.beginPath();
                ctx.arc(px, py, 12, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                // Inner glow bloom
                const innerGlow = ctx.createRadialGradient(px, py, 0, px, py, 4);
                innerGlow.addColorStop(0, `rgba(${rgb},${a * 0.9})`);
                innerGlow.addColorStop(1, `rgba(${rgb},0)`);
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fillStyle = innerGlow;
                ctx.fill();

                // Core pulse dot
                ctx.beginPath();
                ctx.arc(px, py, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${a * 0.95})`;
                ctx.fill();

                p.progress += p.speed;
                if (p.progress >= 1) pulses.splice(i, 1);
            }

            // Render network nodes
            for (const node of nodes) {
                const pulseFactor = 0.18 * Math.sin(time * 1.2 + node.pulsePhase) + 1;
                const isCenter = node.ring === 0;
                const rgb = isCenter ? accentColors[0] : nodeRgb;

                // Node halo bloom
                const haloR = node.radius * 6 * pulseFactor;
                const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloR);
                const haloAlpha = isCenter ? 0.25 : 0.10 + (1 - node.ring / 5) * 0.05;
                halo.addColorStop(0, `rgba(${rgb},${haloAlpha})`);
                halo.addColorStop(1, `rgba(${rgb},0)`);
                ctx.beginPath();
                ctx.arc(node.x, node.y, haloR, 0, Math.PI * 2);
                ctx.fillStyle = halo;
                ctx.fill();

                // Core pulse dot
                const coreAlpha = isCenter ? 0.85 : 0.35 + (1 - node.ring / 5) * 0.2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * pulseFactor, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb},${coreAlpha})`;
                ctx.fill();

                // Center highlight dot
                if (isCenter) {
                    ctx.beginPath();
                    ctx.arc(node.x - 0.5, node.y - 0.5, node.radius * 0.4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,0.6)`;
                    ctx.fill();
                }
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
                maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%)',
            }}
        />
    );
}
