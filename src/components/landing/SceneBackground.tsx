import React, { useEffect, useRef } from 'react';

/* ── types ── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  alpha: number; baseAlpha: number;
  layer: number; // 0=fast/small  1=slow/large
}

interface Bubble {
  x: number; y: number;
  tx: number; ty: number;  // target (lerp destination)
  w: number; h: number;
  hue: number;             // 260 violet | 185 cyan | 300 deep
  alpha: number;
  speed: number;
}

const SceneBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    let particles: Particle[] = [];
    let bubbles:   Bubble[]   = [];

    /* ── resize ── */
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── mouse tracking with velocity ── */
    let lastMX = 0, lastMY = 0;
    const onMove = (e: MouseEvent) => {
      const mx = mouseRef.current;
      mx.vx = e.clientX - lastMX;
      mx.vy = e.clientY - lastMY;
      lastMX = e.clientX;
      lastMY = e.clientY;
      mx.x  = e.clientX;
      mx.y  = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    /* ── particles: 3 layers ── */
    const spawnParticles = () => {
      particles = [];
      // layer 0 — tiny fast dots
      for (let i = 0; i < 55; i++) {
        const a = Math.random() * 0.18 + 0.03;
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          size: Math.random() * 1.2 + 0.3,
          alpha: a, baseAlpha: a, layer: 0,
        });
      }
      // layer 1 — larger, slower, brighter
      for (let i = 0; i < 25; i++) {
        const a = Math.random() * 0.12 + 0.04;
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          size: Math.random() * 2.2 + 1.2,
          alpha: a, baseAlpha: a, layer: 1,
        });
      }
      // layer 2 — very slow, very faint, large "stars"
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * 0.07 + 0.02;
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03,
          size: Math.random() * 3.5 + 2,
          alpha: a, baseAlpha: a, layer: 2,
        });
      }
    };
    spawnParticles();

    /* ── gradient bubbles ── */
    const spawnBubbles = () => {
      bubbles = [];
      const configs = [
        { x: 0.15, y: 0.20, w: 700, h: 600, hue: 262, alpha: 0.038, speed: 0.0006 },
        { x: 0.82, y: 0.15, w: 600, h: 500, hue: 185, alpha: 0.030, speed: 0.0008 },
        { x: 0.50, y: 0.60, w: 800, h: 700, hue: 262, alpha: 0.022, speed: 0.0005 },
        { x: 0.88, y: 0.75, w: 500, h: 500, hue: 300, alpha: 0.025, speed: 0.0007 },
        { x: 0.10, y: 0.80, w: 450, h: 400, hue: 185, alpha: 0.020, speed: 0.0009 },
      ];
      configs.forEach(c => {
        bubbles.push({
          x: c.x * W, y: c.y * H,
          tx: c.x * W, ty: c.y * H,
          w: c.w, h: c.h,
          hue: c.hue, alpha: c.alpha, speed: c.speed,
        });
      });
    };
    spawnBubbles();

    let t = 0;

    /* ── draw loop ── */
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.004;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mvx = mouseRef.current.vx * 0.12;
      const mvy = mouseRef.current.vy * 0.12;

      /* ── animated gradient bubbles ── */
      bubbles.forEach((b, bi) => {
        // organic drift — lissajous-ish
        const ox = Math.sin(t * b.speed * 800 + bi * 1.3) * W * 0.06;
        const oy = Math.cos(t * b.speed * 600 + bi * 0.9) * H * 0.05;

        // cursor repulsion on bubbles (very subtle)
        const dx = b.x - mx;
        const dy = b.y - my;
        const d  = Math.sqrt(dx * dx + dy * dy);
        const pull = d < 400 ? ((400 - d) / 400) * 30 : 0;
        const bx = b.x + ox + (d < 400 ? (dx / d) * pull : 0);
        const by = b.y + oy + (d < 400 ? (dy / d) * pull : 0);

        const grd = ctx.createRadialGradient(bx, by, 0, bx, by, b.w * 0.6);
        grd.addColorStop(0,   `hsla(${b.hue}, 80%, 60%, ${b.alpha})`);
        grd.addColorStop(0.5, `hsla(${b.hue}, 70%, 50%, ${b.alpha * 0.4})`);
        grd.addColorStop(1,   `hsla(${b.hue}, 60%, 40%, 0)`);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(bx, by, b.w * 0.5, b.h * 0.5, bi * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      });

      /* ── cursor-reactive light field ── */
      if (mx > -9000) {
        const lf = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        lf.addColorStop(0,   'rgba(108, 71, 255, 0.055)');
        lf.addColorStop(0.5, 'rgba(0, 212, 255, 0.020)');
        lf.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mx, my, 280, 0, Math.PI * 2);
        ctx.fillStyle = lf;
        ctx.fill();
      }

      /* ── particles ── */
      const CURSOR_R = 180;

      for (const p of particles) {
        const pdx  = p.x - mx;
        const pdy  = p.y - my;
        const dist = Math.sqrt(pdx * pdx + pdy * pdy);

        if (dist < CURSOR_R) {
          const force = ((CURSOR_R - dist) / CURSOR_R) * 0.5;
          p.vx += (pdx / (dist || 1)) * force;
          p.vy += (pdy / (dist || 1)) * force;
          // brighten near cursor
          p.alpha = Math.min(p.baseAlpha * 3.5, p.layer === 0 ? 0.55 : 0.35);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // mouse velocity drag
        p.vx += mvx * (p.layer === 0 ? 0.012 : 0.005);
        p.vy += mvy * (p.layer === 0 ? 0.012 : 0.005);

        // parallax: deeper layers move less
        const parallaxFactor = p.layer === 0 ? 1 : p.layer === 1 ? 0.55 : 0.25;
        p.vx *= 0.994 - p.layer * 0.002;
        p.vy *= 0.994 - p.layer * 0.002;
        p.x  += p.vx * parallaxFactor;
        p.y  += p.vy * parallaxFactor;

        // wrap edges
        if (p.x < -10)    p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10)    p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // colour: layer 0 cool violet, layer 1 warm white, layer 2 cyan tint
        const col = p.layer === 0
          ? `rgba(190,175,255,${p.alpha})`
          : p.layer === 1
          ? `rgba(220,215,255,${p.alpha})`
          : `rgba(160,225,255,${p.alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />
      {/* static deep ambient — no JS, pure CSS */}
      <div className="gd-scene-mesh" aria-hidden="true">
        <div className="gd-mesh gd-mesh-violet" />
        <div className="gd-mesh gd-mesh-cyan"   />
        <div className="gd-mesh gd-mesh-deep"   />
        <div className="gd-mesh gd-mesh-mid"    />
      </div>
    </>
  );
};

export default SceneBackground;
