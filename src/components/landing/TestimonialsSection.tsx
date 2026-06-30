import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS_ROW1 = [
  {
    quote: "GrayDot delivered our e-commerce platform in 6 weeks — ahead of schedule and beyond expectations. Revenue doubled in the first month.",
    name: 'Priya Sharma',
    role: 'Founder, StyleVault',
    initials: 'PS',
    color: '#6C47FF',
  },
  {
    quote: "The AI automation system they built saves our team 40 hours every month. Incredible ROI. We've already commissioned two more projects.",
    name: 'Rahul Mehta',
    role: 'CTO, LogiSync Technologies',
    initials: 'RM',
    color: '#00D4FF',
  },
  {
    quote: "Professional, fast, and communicative throughout. Our clinic app went live in 5 weeks and patients love the simplicity.",
    name: 'Dr. Anitha Nair',
    role: 'Director, CareFirst Clinics',
    initials: 'AN',
    color: '#FF6B6B',
  },
  {
    quote: "I've worked with 3 agencies before GrayDot. None came close to the quality and responsiveness. This team is a true partner.",
    name: 'Vikram Patel',
    role: 'CEO, BuildRight Infra',
    initials: 'VP',
    color: '#00E5A0',
  },
  {
    quote: "Our website conversion rate jumped from 1.2% to 4.8% after the redesign. The ROI on this project was unbelievable.",
    name: 'Meera Krishnan',
    role: 'Marketing Head, EduReach',
    initials: 'MK',
    color: '#FFB800',
  },
];

const TESTIMONIALS_ROW2 = [
  {
    quote: "They understood our brand instantly and translated it into a stunning digital experience. Zero revisions needed after the first design.",
    name: 'Arjun Kapoor',
    role: 'Brand Director, Aura Foods',
    initials: 'AK',
    color: '#FF8C47',
  },
  {
    quote: "GrayDot built us a full real estate portal in 8 weeks with property search, maps, and a CRM backend. Exceptional work.",
    name: 'Sunita Reddy',
    role: 'Operations Manager, NestFinder',
    initials: 'SR',
    color: '#8080FF',
  },
  {
    quote: "The team is genuinely invested in your success. They proactively suggested improvements we hadn't even thought of.",
    name: 'Kiran Joshi',
    role: 'Founder, FitTrack App',
    initials: 'KJ',
    color: '#FF47D4',
  },
  {
    quote: "On-time delivery, transparent communication, clean code handoff. Everything you want from a development partner.",
    name: 'Harish Nambiar',
    role: 'Product Manager, TechNova',
    initials: 'HN',
    color: '#6C47FF',
  },
  {
    quote: "Our food ordering app launched with zero critical bugs. GrayDot's QA process is thorough and their attention to detail shows.",
    name: 'Divya Menon',
    role: 'Co-Founder, QuickBite',
    initials: 'DM',
    color: '#00D4FF',
  },
];

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, initials, color }) => (
  <div className="gd-testimonial-card">
    <div className="gd-testimonial-stars">
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
    </div>
    <p className="gd-testimonial-quote">"{quote}"</p>
    <div className="gd-testimonial-author">
      <div className="gd-testimonial-avatar" style={{ background: color }}>
        {initials}
      </div>
      <div className="gd-testimonial-info">
        <div className="gd-name">{name}</div>
        <div className="gd-role">{role}</div>
      </div>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  /* Duplicate cards so marquee loops seamlessly */
  const row1 = [...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1];
  const row2 = [...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2];

  return (
    <section id="testimonials" className="gd-section">
      <div className="gd-container">
        <div className="gd-section-head">
          <div className="gd-eyebrow">Testimonials</div>
          <h2>What our <span className="gd-gradient-text">clients say</span></h2>
          <p>Don't take our word for it — hear from the businesses we've helped grow.</p>
        </div>
      </div>

      {/* Full-width marquee — no container constraint */}
      <div className="gd-testimonials-wrapper" style={{ padding: '0 0 20px' }}>
        {/* Row 1 — scrolls left */}
        <div className="gd-testimonials-track gd-track-1">
          {row1.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div className="gd-testimonials-track gd-track-2">
          {row2.map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
