import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';

type FilterKey = 'All' | 'Web App' | 'Mobile App' | 'AI / Automation' | 'E-Commerce';

const PROJECTS = [
  {
    id: 'retailpro',
    image: '/project_retailpro.png',
    category: 'E-Commerce' as FilterKey,
    title: 'RetailPro',
    outcome: 'Increased conversion rate by 2.8× and reduced cart abandonment by 42%.',
    stack: ['Next.js', 'Stripe', 'Tailwind CSS', 'Prisma'],
    featured: true,
  },
  {
    id: 'autosync',
    image: '/project_autosync.png',
    category: 'AI / Automation' as FilterKey,
    title: 'AutoSync AI',
    outcome: 'Automated 78% of manual data entry saving 40+ hours/month.',
    stack: ['Python', 'LangChain', 'React', 'FastAPI'],
    featured: false,
  },
  {
    id: 'medibook',
    image: '/project_medibook.png',
    category: 'Mobile App' as FilterKey,
    title: 'MediBook',
    outcome: 'Clinic bookings grew 3× in first 90 days post-launch.',
    stack: ['React Native', 'Firebase', 'Node.js'],
    featured: false,
  },
  {
    id: 'urbaneats',
    image: '/project_urbaneats.png',
    category: 'Mobile App' as FilterKey,
    title: 'UrbanEats',
    outcome: 'Onboarded 12 restaurants and 2,000+ users within the first month.',
    stack: ['React Native', 'Firebase', 'Razorpay'],
    featured: false,
  },
  {
    id: 'financeflow',
    image: '/project_financeflow.png',
    category: 'Web App' as FilterKey,
    title: 'FinanceFlow',
    outcome: 'Real-time financial visibility reduced reporting time from 3 days to 15 minutes.',
    stack: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL'],
    featured: false,
  },
];

const FILTERS: FilterKey[] = ['All', 'Web App', 'Mobile App', 'AI / Automation', 'E-Commerce'];

const FeaturedWork: React.FC = () => {
  const [active, setActive] = useState<FilterKey>('All');
  useScrollReveal('.gd-work-card');

  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === active);
  const [featured, ...rest] = filtered;

  return (
    <section id="work" className="gd-section gd-section-alt">
      <div className="gd-container">
        <div className="gd-section-head">
          <div className="gd-eyebrow">Our Work</div>
          <h2>Projects we're <span className="gd-gradient-text">proud of</span></h2>
          <p>Real outcomes for real businesses — from startups to established brands.</p>
        </div>

        {/* Filter pills */}
        <div className="gd-work-filter">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`gd-work-filter-btn ${active === f ? 'gd-work-filter-active' : ''}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="gd-work-grid">
            {/* Featured card */}
            {featured && (
              <div className="gd-work-card gd-work-featured gd-reveal">
                <div className="gd-work-preview">
                  <img src={featured.image} alt={featured.title} loading="lazy" />
                  <div className="gd-work-preview-gradient" />
                </div>
                <div className="gd-work-body">
                  <div className="gd-work-meta">
                    <span className="gd-work-category">{featured.category}</span>
                    <ArrowUpRight size={16} style={{ color: 'var(--gd-muted)' }} />
                  </div>
                  <h3>{featured.title}</h3>
                  <p className="gd-work-outcome">{featured.outcome}</p>
                  <div className="gd-work-stack">
                    {featured.stack.map(t => <span key={t} className="gd-work-tech">{t}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* Remaining cards */}
            {rest.map((p, i) => (
              <div key={p.id} className={`gd-work-card gd-reveal gd-reveal-delay-${i + 1}`}>
                <div className="gd-work-preview">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <div className="gd-work-preview-gradient" />
                </div>
                <div className="gd-work-body">
                  <div className="gd-work-meta">
                    <span className="gd-work-category">{p.category}</span>
                    <ArrowUpRight size={16} style={{ color: 'var(--gd-muted)' }} />
                  </div>
                  <h3>{p.title}</h3>
                  <p className="gd-work-outcome">{p.outcome}</p>
                  <div className="gd-work-stack">
                    {p.stack.map(t => <span key={t} className="gd-work-tech">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gd-muted)', fontSize: 16 }}>
            No projects in this category yet. More coming soon!
          </div>
        )}

        <div className="gd-work-cta">
          <button
            className="gd-btn gd-btn-secondary"
            style={{ marginTop: 8 }}
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Project →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
