import React from 'react';
import { Linkedin, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="gd-footer">
      <div className="gd-container">
        <div className="gd-footer-grid">
          {/* Brand column */}
          <div>
            <img
              src="/footer-logo.png"
              alt="GrayDot Logo"
              className="gd-footer-logo-img"
            />
            <p className="gd-footer-tagline">
              We build websites, apps, AI automation systems,
              and digital growth solutions for businesses that mean business.
            </p>
            <div className="gd-footer-socials">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="gd-social-btn"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="gd-social-btn"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="gd-social-btn"
                aria-label="Twitter / X"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Services column */}
          <div className="gd-footer-col">
            <h4>Services</h4>
            <ul>
              <li><button onClick={() => scrollTo('services')}>Web Development</button></li>
              <li><button onClick={() => scrollTo('services')}>Mobile Apps</button></li>
              <li><button onClick={() => scrollTo('services')}>AI Automation</button></li>
              <li><button onClick={() => scrollTo('services')}>E-Commerce</button></li>
              <li><button onClick={() => scrollTo('services')}>SEO & Marketing</button></li>
              <li><button onClick={() => scrollTo('services')}>UI/UX Design</button></li>
            </ul>
          </div>

          {/* Company column */}
          <div className="gd-footer-col">
            <h4>Company</h4>
            <ul>
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About Us</button></li>
              <li><button onClick={() => scrollTo('work')}>Our Work</button></li>
              <li><button onClick={() => scrollTo('process')}>Process</button></li>
              <li><button onClick={() => scrollTo('testimonials')}>Testimonials</button></li>
              <li><button onClick={() => scrollTo('faq')}>FAQ</button></li>
              <li><a href="mailto:graydotservices@gmail.com">Careers</a></li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="gd-footer-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:graydotservices@gmail.com">
                  <Mail size={14} /> graydotservices@gmail.com
                </a>
              </li>
              <li>
                <a href="https://api.whatsapp.com/send?phone=918667466390" target="_blank" rel="noreferrer">
                  <Phone size={14} /> WhatsApp Us
                </a>
              </li>
              <li>
                <span style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: 'var(--gd-muted)', fontSize: 14, lineHeight: '1.4' }}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} /> 
                  Priyanka Homes, B block Ground Floor B01,<br />
                  RR Nagar 4th Street, Iyyapanthangal,<br />
                  Chennai-600056.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gd-footer-bottom">
          <span>© {new Date().getFullYear()} GrayDot Digital Solutions. All rights reserved.</span>
          <div className="gd-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
