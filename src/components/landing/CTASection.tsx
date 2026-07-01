import React from 'react';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const BADGES = [
  'Trusted by 30+ Businesses',
  'Fast Delivery Guaranteed',
  '100% Satisfaction Policy',
];

const CTASection: React.FC = () => (
  <section id="cta" className="gd-cta-section">
    <div className="gd-container">
      <div className="gd-cta-card">
        <div className="gd-eyebrow" style={{ justifyContent: 'center' }}>Ready to grow?</div>

        <h2>
          Let's build something<br />
          <span className="gd-gradient-text">extraordinary together.</span>
        </h2>

        <p>
          Tell us about your project — we respond within 24 hours
          and kick off with a free discovery call.
        </p>

        <div className="gd-cta-actions">
          <Link
            to="/start-project"
            className="gd-btn gd-btn-primary gd-btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Start a Project <ArrowRight size={18} />
          </Link>

          <a href="mailto:graydotservices@gmail.com" className="gd-cta-email-link">
            <Mail size={16} />
            graydotservices@gmail.com
          </a>
        </div>

        <div className="gd-cta-badges">
          {BADGES.map(b => (
            <div key={b} className="gd-cta-badge">
              <CheckCircle size={15} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
