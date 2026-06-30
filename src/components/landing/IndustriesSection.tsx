import React from 'react';
import {
  Building2, HeartPulse, ShoppingBag, GraduationCap,
  Banknote, UtensilsCrossed, Factory, Plane
} from 'lucide-react';
import { useScrollReveal } from './useScrollReveal';

const INDUSTRIES = [
  { icon: <Building2 size={26} />, color: '#6C47FF', bg: 'rgba(108,71,255,0.15)', title: 'Real Estate', desc: 'Property listings, virtual tours & CRM portals' },
  { icon: <HeartPulse size={26} />, color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', title: 'Healthcare', desc: 'Clinic apps, patient portals & telemedicine' },
  { icon: <ShoppingBag size={26} />, color: '#00D4FF', bg: 'rgba(0,212,255,0.12)', title: 'Retail & E-Commerce', desc: 'Online stores, inventory & loyalty systems' },
  { icon: <GraduationCap size={26} />, color: '#FFB800', bg: 'rgba(255,184,0,0.12)', title: 'EdTech', desc: 'LMS platforms, course builders & quizzes' },
  { icon: <Banknote size={26} />, color: '#00E5A0', bg: 'rgba(0,229,160,0.12)', title: 'Fintech', desc: 'Dashboards, payment flows & analytics tools' },
  { icon: <UtensilsCrossed size={26} />, color: '#FF8C47', bg: 'rgba(255,140,71,0.12)', title: 'Food & Beverage', desc: 'Ordering apps, POS integration & delivery' },
  { icon: <Factory size={26} />, color: '#8080FF', bg: 'rgba(128,128,255,0.12)', title: 'Manufacturing', desc: 'ERP portals, supply chain & reporting tools' },
  { icon: <Plane size={26} />, color: '#FF47D4', bg: 'rgba(255,71,212,0.12)', title: 'Travel & Hospitality', desc: 'Booking engines, hotel portals & itineraries' },
];

const IndustriesSection: React.FC = () => {
  useScrollReveal('.gd-industry-card');

  return (
    <section id="industries" className="gd-section">
      <div className="gd-container">
        <div className="gd-section-head">
          <div className="gd-eyebrow">Industries</div>
          <h2>Built for <span className="gd-gradient-text">every industry</span></h2>
          <p>We've helped businesses across verticals launch and scale their digital presence.</p>
        </div>

        <div className="gd-industries-grid">
          {INDUSTRIES.map((ind, i) => (
            <div key={ind.title} className={`gd-industry-card gd-reveal gd-reveal-delay-${(i % 4) + 1}`}>
              <div className="gd-industry-icon" style={{ background: ind.bg, color: ind.color }}>
                {ind.icon}
              </div>
              <h3>{ind.title}</h3>
              <p>{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
