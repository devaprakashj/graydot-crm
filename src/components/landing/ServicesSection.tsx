import React from 'react';
import { Globe, Smartphone, Bot, ShoppingCart, TrendingUp, Palette, Share2 } from 'lucide-react';
import { useReveal } from './useReveal';

const SERVICES = [
  {
    icon: <Globe size={22} />,
    color: '#6C47FF', bg: 'rgba(108,71,255,0.12)',
    title: 'Web Design & Development',
    desc: 'High-performance websites and web apps built for speed, SEO, and conversions.',
    chips: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    featured: true,
  },
  { icon: <Smartphone size={22} />, color: '#00D4FF', bg: 'rgba(0,212,255,0.10)',    title: 'Mobile Apps',      desc: 'Native and cross-platform apps for iOS and Android that users love.'          },
  { icon: <Bot size={22} />,        color: '#00E5A0', bg: 'rgba(0,229,160,0.10)',    title: 'AI Automation',    desc: 'Intelligent workflows, chatbots, and process automation powered by AI.'        },
  { icon: <ShoppingCart size={22} />,color: '#FF6B6B',bg: 'rgba(255,107,107,0.10)', title: 'E-Commerce',       desc: 'Full-featured stores with payment integration and inventory management.'       },
  { icon: <TrendingUp size={22} />, color: '#FFB800', bg: 'rgba(255,184,0,0.10)',    title: 'SEO & Marketing',  desc: 'Data-driven strategies to grow your presence and generate qualified leads.'    },
  { icon: <Palette size={22} />,    color: '#FF47D4', bg: 'rgba(255,71,212,0.10)',   title: 'UI/UX Design',     desc: 'Conversion-focused design systems, prototypes, and brand identities.'          },
  { icon: <Share2 size={22} />,     color: '#FF7B00', bg: 'rgba(255,123,0,0.10)',    title: 'Social & Content', desc: 'Poster design, video editing, and engaging content to build your brand online.',span: 2 },
];

const ServicesSection: React.FC = () => {
  const [ref, visible] = useReveal<HTMLElement>(0.1);

  const [featured, ...rest] = SERVICES;

  return (
    <section id="services" className="gd-section" ref={ref}>
      <div className="gd-container">
        <div
          className="gd-section-head"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="gd-eyebrow">What We Do</span>
          <h2>Services built for <span className="gd-gradient-text">real results</span></h2>
          <p>From pixel-perfect design to AI-powered automation — end-to-end digital solutions.</p>
        </div>

        <div className="gd-services-grid">
          {/* featured */}
          <div
            className="gd-service-card gd-service-featured"
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            <div className="gd-service-icon" style={{ background: featured.bg, color: featured.color }}>
              {featured.icon}
            </div>
            <h3>{featured.title}</h3>
            <p>{featured.desc}</p>
            {featured.chips && (
              <div className="gd-service-chips">
                {featured.chips.map(c => <span key={c} className="gd-service-chip">{c}</span>)}
              </div>
            )}

          </div>

          {/* rest */}
          {rest.map((svc: any, i) => (
            <div
              key={svc.title}
              className="gd-service-card"
              style={{
                gridColumn: svc.span ? `span ${svc.span}` : undefined,
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'none' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${(i + 1) * 80 + 100}ms, transform 0.6s ease ${(i + 1) * 80 + 100}ms`,
              }}
            >
              <div className="gd-service-icon" style={{ background: svc.bg, color: svc.color }}>
                {svc.icon}
              </div>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
