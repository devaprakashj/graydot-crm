import React, { useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const STATS = [
  { num: '50+',  label: 'Projects Delivered' },
  { num: '30+',  label: 'Happy Clients'      },
  { num: '4.9★', label: 'Average Rating'     },
  { num: '100%', label: 'On-Time Delivery'   },
];

/* ─── Interactive headline ─────────────────────────────────────────── */
const HEADLINE_WORDS = [
  { text: 'We',       plain: true  },
  { text: 'Build',    plain: true  },
  { text: 'Digital',  plain: true  },
  { text: 'Products', plain: false },
  { text: 'That',     plain: false },
  { text: 'Drive',    plain: true  },
  { text: 'Growth',   plain: true  },
];

const InteractiveHeadline: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const mouse       = useRef({ x: -9999, y: -9999 });
  const rafRef      = useRef<number>(0);
  const spanRefs    = useRef<(HTMLSpanElement | null)[]>([]);

  const RADIUS = 260; // px influence radius

  const tick = useCallback(() => {
    const spans = spanRefs.current;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    spans.forEach(span => {
      if (!span) return;
      const r   = span.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = mx - cx;
      const dy  = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const t = 1 - dist / RADIUS;            // 0→1 as cursor approaches
        const ease = t * t * (3 - 2 * t);       // smoothstep

        // gradient position follows cursor angle
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        span.style.setProperty('--gd-hl-opacity',  String(ease));
        span.style.setProperty('--gd-hl-angle',    `${angle}deg`);
        span.style.setProperty('--gd-hl-scale',    String(1 + ease * 0.03));
        span.style.setProperty('--gd-hl-bright',   String(1 + ease * 0.4));
      } else {
        span.style.setProperty('--gd-hl-opacity', '0');
        span.style.setProperty('--gd-hl-scale',   '1');
        span.style.setProperty('--gd-hl-bright',  '1');
      }
    });

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  return (
    <h1 ref={headlineRef} className="gd-hero-h1">
      {HEADLINE_WORDS.map((w, i) => (
        <React.Fragment key={i}>
          <span
            ref={el => { spanRefs.current[i] = el; }}
            className={`gd-hw${w.plain ? '' : ' gd-hw--accent'}`}
          >
            {/* the glow overlay layer */}
            <span className="gd-hw-glow" aria-hidden="true">{w.text}</span>
            {/* base text */}
            <span className="gd-hw-base">{w.text}</span>
          </span>
          {i < HEADLINE_WORDS.length - 1 && ' '}
        </React.Fragment>
      ))}
    </h1>
  );
};

/* ─── Hero ─────────────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = statsRef.current?.querySelectorAll<HTMLElement>('.gd-stat-num');
    if (!els) return;
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      STATS.forEach((stat, i) => {
        const el = els[i];
        if (!el) return;
        const raw = parseInt(stat.num, 10);
        if (isNaN(raw)) return;
        const suffix = stat.num.replace(/[\d]/g, '');
        const dur = 1400;
        const step = (ts: number, t0: number) => {
          const p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * raw) + suffix;
          if (p < 1) requestAnimationFrame(t => step(t, t0));
        };
        requestAnimationFrame(t => step(t, t));
      });
    }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <header id="hero" className="gd-hero">
      <div className="gd-hero-content">

        {/* eyebrow */}
        <div className="gd-hero-animate gd-ha-1">
          <span className="gd-hero-badge">
            <span className="gd-hero-badge-shimmer" aria-hidden="true" />
            <span className="gd-hero-badge-star">✦</span>
            Design. Develop. Dominate.
          </span>
        </div>

        {/* interactive headline */}
        <div className="gd-hero-animate gd-ha-2">
          <InteractiveHeadline />
        </div>

        {/* sub */}
        <p className="gd-hero-sub gd-hero-animate gd-ha-3">
          Websites, apps, AI automation &amp; digital growth solutions —
          engineered for results and built to scale.
        </p>

        {/* primary CTA — centered, standalone */}
        <div className="gd-hero-cta-wrap gd-hero-animate gd-ha-4">
          <button
            className="gd-hero-primary-cta"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="gd-hero-cta-label">Start Project</span>
            <span className="gd-hero-cta-icon"><ArrowRight size={17} /></span>
          </button>

          <button
            className="gd-hero-ghost-cta"
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Our Work <ChevronDown size={16} />
          </button>
        </div>

        {/* trust stats */}
        <div className="gd-hero-trust gd-hero-animate gd-ha-5" ref={statsRef}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="gd-hero-divider" />}
              <div className="gd-hero-stat">
                <span className="gd-stat-num">{s.num}</span>
                <span className="gd-stat-label">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <button
        className="gd-scroll-indicator"
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to services"
      >
        <div className="gd-scroll-line" />
        <span>scroll</span>
      </button>
    </header>
  );
};

export default Hero;
