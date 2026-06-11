import React, { useEffect, useState } from 'react';
import {
  Shield,
  Users,
  BarChart3,
  GitBranch,
  FileText,
  CheckCircle2,
  Target,
  Briefcase,
  Code2,
  TestTube2,
  Crown,
  Lock,
  Menu,
  X
} from 'lucide-react';
import './Landing.css';

const Landing: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="ld-page">
      {/* ===== NAVBAR ===== */}
      <nav className={`ld-nav ${scrolled ? 'ld-nav-scrolled' : ''}`}>
        <div className="ld-nav-inner">
          <div className="ld-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <video src="/logo.mp4" autoPlay loop muted playsInline className="ld-nav-logo" />
          </div>

          <div className={`ld-nav-links ${menuOpen ? 'ld-nav-links-open' : ''}`}>
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('workflow')}>How It Works</button>
            <button onClick={() => scrollTo('teams')}>Teams</button>
            <button onClick={() => scrollTo('security')}>Security</button>
          </div>

          <div className="ld-nav-actions">
            <button className="ld-nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="ld-hero">
        <p className="ld-hero-eyebrow">GrayDot — Internal Team Portal</p>
        <h1 className="ld-hero-title">
          Manage every lead, project and delivery in one place
        </h1>
        <p className="ld-hero-sub">
          GrayDot CRM brings lead generation, sales, project management and quality
          assurance together — so your team moves faster with complete clarity.
        </p>
        <div className="ld-hero-actions">
          <button className="ld-btn-primary ld-btn-lg" onClick={() => scrollTo('workflow')}>
            Learn More
          </button>
        </div>

        <div className="ld-hero-trust">
          <span><CheckCircle2 size={15} /> Role-based dashboards</span>
          <span><CheckCircle2 size={15} /> Complete audit trail</span>
          <span><CheckCircle2 size={15} /> OTP-secured access</span>
        </div>
      </header>

      {/* ===== FEATURES ===== */}
      <section id="features" className="ld-section">
        <div className="ld-section-head">
          <h2>Everything your team needs</h2>
          <p>Purpose-built modules covering the complete client journey.</p>
        </div>

        <div className="ld-features">
          <div className="ld-feature">
            <div className="ld-feature-icon"><Target size={20} /></div>
            <h3>Lead Management</h3>
            <p>Capture leads with full client context and auto-assign them to sales with daily target tracking.</p>
          </div>
          <div className="ld-feature">
            <div className="ld-feature-icon"><GitBranch size={20} /></div>
            <h3>Guided Workflow</h3>
            <p>Every lead moves through a clear pipeline — from first contact to final delivery.</p>
          </div>
          <div className="ld-feature">
            <div className="ld-feature-icon"><Users size={20} /></div>
            <h3>Role-Based Access</h3>
            <p>Six tailored workspaces. Each team member sees exactly what they need to act on.</p>
          </div>
          <div className="ld-feature">
            <div className="ld-feature-icon"><BarChart3 size={20} /></div>
            <h3>Finance & Reporting</h3>
            <p>Real-time revenue tracking, payment visibility and team performance metrics.</p>
          </div>
          <div className="ld-feature">
            <div className="ld-feature-icon"><FileText size={20} /></div>
            <h3>Invoices & Documents</h3>
            <p>Generate branded PDF invoices and pipeline reports in a single click.</p>
          </div>
          <div className="ld-feature">
            <div className="ld-feature-icon"><Shield size={20} /></div>
            <h3>Audit & Compliance</h3>
            <p>Every action is logged with who, what and when — full accountability built in.</p>
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW ===== */}
      <section id="workflow" className="ld-section ld-section-gray">
        <div className="ld-section-head">
          <h2>How it works</h2>
          <p>One pipeline, five stages. Each handoff notifies the right person automatically.</p>
        </div>

        <div className="ld-steps">
          <div className="ld-step">
            <span className="ld-step-num">01</span>
            <h4>Lead Capture</h4>
            <p>Lead gen logs client details and requirements. Auto-assigned to sales.</p>
          </div>
          <div className="ld-step">
            <span className="ld-step-num">02</span>
            <h4>Sales Qualification</h4>
            <p>Sales contacts the client, confirms interest and sets the price.</p>
          </div>
          <div className="ld-step">
            <span className="ld-step-num">03</span>
            <h4>Manager Approval</h4>
            <p>Manager approves and assigns a developer with a deadline.</p>
          </div>
          <div className="ld-step">
            <span className="ld-step-num">04</span>
            <h4>Build & QA</h4>
            <p>Developer ships the work. QA tests and signs off.</p>
          </div>
          <div className="ld-step">
            <span className="ld-step-num">05</span>
            <h4>Delivery</h4>
            <p>Final approval, invoice generated, project delivered.</p>
          </div>
        </div>
      </section>

      {/* ===== TEAMS ===== */}
      <section id="teams" className="ld-section">
        <div className="ld-section-head">
          <h2>A workspace for every role</h2>
          <p>Sign in once — your dashboard knows who you are and what you need to do.</p>
        </div>

        <div className="ld-roles">
          <div className="ld-role">
            <Target size={18} />
            <div>
              <h4>Lead Generation</h4>
              <p>Create leads, hit daily targets, track conversion.</p>
            </div>
          </div>
          <div className="ld-role">
            <Briefcase size={18} />
            <div>
              <h4>Sales</h4>
              <p>Qualify leads, set pricing, deliver and invoice.</p>
            </div>
          </div>
          <div className="ld-role">
            <Crown size={18} />
            <div>
              <h4>Manager</h4>
              <p>Approve deals, assign developers, oversee the pipeline.</p>
            </div>
          </div>
          <div className="ld-role">
            <Code2 size={18} />
            <div>
              <h4>Developer</h4>
              <p>Build projects, submit work, handle revisions.</p>
            </div>
          </div>
          <div className="ld-role">
            <TestTube2 size={18} />
            <div>
              <h4>QA / Tester</h4>
              <p>Review submissions, pass or fail with feedback.</p>
            </div>
          </div>
          <div className="ld-role">
            <Shield size={18} />
            <div>
              <h4>Admin</h4>
              <p>Manage users, finances, settings and audit logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section id="security" className="ld-section ld-section-gray">
        <div className="ld-security">
          <div className="ld-security-text">
            <h2>Security comes standard</h2>
            <p>
              No passwords to leak. Every sign-in uses a one-time code sent to a
              verified team email, and every action is recorded in a permanent audit log.
            </p>
            <ul>
              <li><Lock size={15} /> OTP authentication — codes expire in 5 minutes</li>
              <li><Shield size={15} /> Instant account disabling for offboarded members</li>
              <li><FileText size={15} /> Full activity audit trail</li>
              <li><Users size={15} /> Server-side role verification on every request</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-footer-brand">
            <video src="/logo.mp4" autoPlay loop muted playsInline className="ld-footer-logo" />
            <p>Internal Lead Management & Project Delivery System</p>
          </div>
          <div className="ld-footer-links">
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('workflow')}>How It Works</button>
            <button onClick={() => scrollTo('teams')}>Teams</button>
          </div>
        </div>
        <div className="ld-footer-bottom">
          <span>© {new Date().getFullYear()} GrayDot. Authorized access only.</span>
          <span className="ld-footer-secure"><Lock size={12} /> Encrypted & Secured</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
