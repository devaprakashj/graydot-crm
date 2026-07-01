import React from 'react';
import { Check, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessStateProps {
  leadId: string;
}

const SuccessState: React.FC<SuccessStateProps> = ({ leadId }) => {
  const navigate = useNavigate();

  return (
    <div className="gd-success-state">
      <div className="gd-success-icon">
        <Check size={40} strokeWidth={3} />
      </div>
      
      <h2>You're all set!</h2>
      <p>Your project enquiry has been received. Our team will review your requirements and get back to you shortly.</p>
      
      <div className="gd-lead-id">
        Your enquiry ID: <strong>{leadId}</strong>
      </div>
      
      <div className="gd-success-steps">
        <div className="gd-success-step">
          <div className="gd-success-step-icon">1</div>
          <div className="gd-success-step-content">
            <h4>We review your details</h4>
            <p>Our experts analyze your requirements to find the best approach.</p>
          </div>
        </div>
        <div className="gd-success-step">
          <div className="gd-success-step-icon">2</div>
          <div className="gd-success-step-content">
            <h4>We reach out</h4>
            <p>Expect an email or call within 24 hours to schedule a discovery call.</p>
          </div>
        </div>
        <div className="gd-success-step">
          <div className="gd-success-step-icon">3</div>
          <div className="gd-success-step-content">
            <h4>Project kickoff</h4>
            <p>We present a tailored proposal, timeline, and get to work!</p>
          </div>
        </div>
      </div>
      
      <div className="gd-success-actions">
        <button className="gd-btn gd-btn-primary" onClick={() => window.open(`https://wa.me/918667466390?text=Hi, I just submitted a project enquiry (ID: ${leadId}). I'd like to discuss it!`, '_blank')}>
          <Calendar size={18} /> Book a Call Now
        </button>
        <button className="gd-btn gd-btn-secondary" onClick={() => navigate('/')}>
          <Home size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessState;
