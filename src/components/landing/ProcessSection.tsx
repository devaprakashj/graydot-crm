import React, { useState } from 'react';
import { useReveal } from './useReveal';

const STEPS = [
  {
    num: '01',
    phase: 'Discover',
    sub: 'Research & Strategy',
    desc: 'Deep-dive into your goals, audience, and market to form a precise strategic foundation.',
    accent: '#6C47FF',
  },
  {
    num: '02',
    phase: 'Design',
    sub: 'UX & Visual Systems',
    desc: 'Craft intuitive interfaces and cohesive visual systems that convert and delight.',
    accent: '#00D4FF',
  },
  {
    num: '03',
    phase: 'Develop',
    sub: 'Build & Integrate',
    desc: 'Engineer scalable, performant code with clean architecture and seamless integrations.',
    accent: '#00E5A0',
  },
  {
    num: '04',
    phase: 'Launch',
    sub: 'Deploy & Test',
    desc: 'Rigorous QA, staging environments, and a smooth go-live with zero disruption.',
    accent: '#FFB800',
  },
  {
    num: '05',
    phase: 'Grow',
    sub: 'Optimize & Scale',
    desc: 'Data-driven iteration, performance tuning, and feature expansion to maximize ROI.',
    accent: '#FF6B9D',
  },
];

const ProcessSection: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [sectionRef, visible] = useReveal<HTMLElement>(0.15);

  return (
    <section
      id="process"
      className="gd-wf-section gd-section-alt"
      ref={sectionRef}
    >
      <div className="gd-container">

        {/* heading */}
        <div
          className="gd-wf-header"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="gd-eyebrow">How We Work</span>
          <h2 className="gd-wf-heading">Workflow</h2>
          <p className="gd-wf-sub">A clear path from idea to growth.</p>
        </div>

        {/* timeline */}
        <div className="gd-wf-timeline">

          {/* track */}
          <div className="gd-wf-track">
            <div
              className="gd-wf-track-fill"
              style={{ width: visible ? '100%' : '0%' }}
            />
          </div>

          {/* steps */}
          <div className="gd-wf-steps">
            {STEPS.map((step, i) => {
              const on = hovered === i;
              return (
                <div
                  key={step.num}
                  className={`gd-wf-step${on ? ' gd-wf-step--on' : ''}`}
                  style={{
                    opacity:   visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 0.55s ease ${i * 100 + 200}ms, transform 0.55s ease ${i * 100 + 200}ms`,
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* node */}
                  <div className="gd-wf-node-wrap">
                    <div
                      className="gd-wf-node"
                      style={on ? {
                        borderColor: step.accent,
                        boxShadow: `0 0 0 5px ${step.accent}1A, 0 0 18px ${step.accent}33`,
                      } : undefined}
                    >
                      <span
                        className="gd-wf-node-num"
                        style={{ color: on ? step.accent : undefined }}
                      >
                        {step.num}
                      </span>
                    </div>
                    {/* glow pulse */}
                    {on && (
                      <div
                        className="gd-wf-node-pulse"
                        style={{ background: step.accent }}
                      />
                    )}
                  </div>

                  {/* text */}
                  <div className="gd-wf-content">
                    <p
                      className="gd-wf-phase"
                      style={{ color: on ? step.accent : undefined }}
                    >
                      {step.phase}
                    </p>
                    <p className="gd-wf-sub-label">{step.sub}</p>

                    {/* desc: slides in on hover */}
                    <div
                      className="gd-wf-desc-wrap"
                      style={{
                        maxHeight: on ? '72px' : '0',
                        opacity:   on ? 1      : 0,
                      }}
                    >
                      <p className="gd-wf-desc">{step.desc}</p>
                    </div>

                    {/* accent line */}
                    <div
                      className="gd-wf-line"
                      style={{
                        background:    step.accent,
                        transform:     on ? 'scaleX(1)' : 'scaleX(0)',
                        opacity:       on ? 1 : 0,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="gd-wf-cta"
          style={{
            opacity:   visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.8s',
          }}
        >
          <span className="gd-wf-cta-text">Ready to start?</span>
          <button
            className="gd-btn gd-btn-primary gd-btn-sm"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Let's Talk →
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
