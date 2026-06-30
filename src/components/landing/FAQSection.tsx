import React, { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';

const FAQS = [
  {
    q: 'What types of businesses do you work with?',
    a: 'We work with startups, SMEs, and established enterprises across industries including retail, healthcare, edtech, fintech, real estate, and more. If you have a digital challenge, we\'re likely the right fit.',
  },
  {
    q: 'How long does a typical website project take?',
    a: 'A standard business website takes 3–5 weeks. Custom web applications typically take 6–12 weeks depending on complexity. We\'ll give you a precise timeline in our proposal.',
  },
  {
    q: 'Do you offer post-launch support and maintenance?',
    a: 'Yes. We offer flexible monthly retainer packages covering bug fixes, content updates, performance monitoring, and feature enhancements. Most clients stay with us long-term.',
  },
  {
    q: 'What is your pricing model?',
    a: 'We use fixed-price project contracts so there are no billing surprises. Pricing is based on scope, complexity, and timeline. Packages typically start at ₹40,000 for landing pages and scale from there.',
  },
  {
    q: 'Can you work with our existing brand guidelines?',
    a: 'Absolutely. We can work from your existing brand guidelines or help you develop a new visual identity from scratch. We adapt to what you already have and enhance it.',
  },
  {
    q: 'Do you build mobile apps or just websites?',
    a: 'We build both — native iOS/Android apps, cross-platform apps using React Native, progressive web apps (PWAs), and full-stack web applications. One team for all your digital products.',
  },
  {
    q: 'What makes GrayDot different from other agencies?',
    a: 'We\'re engineers first, designers second. We care deeply about performance, clean code, and business outcomes — not just visual polish. You\'ll also work directly with senior developers, not juniors.',
  },
  {
    q: 'How do we get started?',
    a: 'Simply click "Get a Free Quote" or email us at hi@graydot.in. We\'ll schedule a 30-minute discovery call to understand your project and send a detailed proposal within 48 hours.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  useScrollReveal('.gd-faq-item');

  return (
    <section id="faq" className="gd-section gd-section-alt">
      <div className="gd-container">
        <div className="gd-faq-layout">
          {/* Left column */}
          <div className="gd-faq-left">
            <div className="gd-eyebrow">FAQ</div>
            <h2>Got <span className="gd-gradient-text">questions?</span></h2>
            <p>
              Everything you need to know before starting your project.
              Can't find your answer here?
            </p>
            <button
              className="gd-btn gd-btn-primary"
              onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ask us directly <ArrowRight size={16} />
            </button>
          </div>

          {/* Right column — accordion */}
          <div className="gd-faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`gd-faq-item gd-reveal gd-reveal-delay-${(i % 3) + 1} ${openIndex === i ? 'gd-faq-open' : ''}`}
              >
                <button
                  className="gd-faq-question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  id={`faq-q-${i}`}
                >
                  <span>{faq.q}</span>
                  <div className="gd-faq-icon">
                    <Plus size={14} color="var(--gd-text-2)" />
                  </div>
                </button>
                <div
                  className="gd-faq-answer"
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                >
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
