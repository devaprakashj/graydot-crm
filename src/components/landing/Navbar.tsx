import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Services',     href: 'services' },
  { label: 'Work',         href: 'work' },
  { label: 'Industries',   href: 'industries' },
  { label: 'Workflow',     href: 'process' },
  { label: 'Testimonials', href: 'testimonials' },
  { label: 'FAQ',          href: 'faq' },
];

const Navbar: React.FC = () => {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]        = useState(false);
  const [active,         setActive]          = useState('');
  const [indicatorStyle, setIndicatorStyle]  = useState({ left: 0, width: 0, opacity: 0 });

  const navLinksRef = useRef<HTMLDivElement>(null);
  const buttonRefs  = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate    = useNavigate();
  const location    = useLocation();

  /* ── scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    if (location.pathname !== '/') return;
    const targets = NAV_LINKS
      .map(l => document.getElementById(l.href))
      .filter(Boolean) as HTMLElement[];
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActive((e.target as HTMLElement).id);
      }),
      { rootMargin: '-38% 0px -57% 0px' }
    );
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, [location.pathname]);

  /* ── sliding indicator ── */
  const moveIndicator = (idx: number | null) => {
    if (idx === null) {
      const ai = NAV_LINKS.findIndex(l => l.href === active);
      if (ai < 0) { setIndicatorStyle(s => ({ ...s, opacity: 0 })); return; }
      moveIndicator(ai);
      return;
    }
    const btn  = buttonRefs.current[idx];
    const rail = navLinksRef.current;
    if (!btn || !rail) return;
    const b = btn.getBoundingClientRect();
    const r = rail.getBoundingClientRect();
    setIndicatorStyle({ left: b.left - r.left, width: b.width, opacity: 1 });
  };

  useEffect(() => {
    const idx = NAV_LINKS.findIndex(l => l.href === active);
    moveIndicator(idx >= 0 ? idx : null);
  }, [active]);

  /* ── hash nav ── */
  useEffect(() => {
    if (location.hash && location.pathname === '/') {
      const id = location.hash.replace('#', '');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== '/') { navigate(`/#${id}`); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ──────────────── Header row ──────────────── */}
      <header className={`gd-header${scrolled ? ' gd-header--scrolled' : ''}`}>

        {/* Mobile Logo (Visible only on mobile) */}
        <div className="gd-header-logo" onClick={() => { setMenuOpen(false); navigate('/'); }} style={{ cursor: 'pointer' }}>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff', letterSpacing: '-0.02em' }}>GrayDot</span>
          <span style={{ color: 'var(--gd-accent)', fontWeight: 800, fontSize: '18px' }}>.</span>
        </div>

        {/* Glass pill — links only, centered */}
        <nav className="gd-float-nav" aria-label="Primary navigation">
          <div
            className="gd-float-links"
            ref={navLinksRef}
            onMouseLeave={() => moveIndicator(null)}
          >
            {/* sliding highlight */}
            <span
              className="gd-float-indicator"
              aria-hidden="true"
              style={{
                left:    indicatorStyle.left,
                width:   indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />

            {NAV_LINKS.map((l, i) => (
              <button
                key={l.href}
                ref={el => { buttonRefs.current[i] = el; }}
                className={`gd-float-link${active === l.href ? ' gd-float-link--active' : ''}`}
                onClick={() => scrollTo(l.href)}
                onMouseEnter={() => moveIndicator(i)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Hamburger — mobile only (right side) */}
        <button
          className="gd-float-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

      </header>

      {/* ──────────────── Mobile drawer ──────────────── */}
      <div
        className={`gd-mobile-drawer${menuOpen ? ' gd-mobile-drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="gd-mobile-drawer-inner">
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              className={`gd-mobile-link${active === l.href ? ' gd-mobile-link--active' : ''}`}
              onClick={() => scrollTo(l.href)}
            >
              {l.label}
              {active === l.href && <span className="gd-mobile-dot" />}
            </button>
          ))}
          <div className="gd-mobile-divider" />
          <button
            className="gd-mobile-cta"
            onClick={() => { setMenuOpen(false); navigate('/start-project'); }}
          >
            Start Project
          </button>
        </div>
      </div>

      {/* backdrop */}
      {menuOpen && (
        <div
          className="gd-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
