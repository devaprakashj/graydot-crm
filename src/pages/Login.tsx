import React, { useState } from 'react';
import { Mail, ArrowRight, Loader, Shield, Zap, Users } from 'lucide-react';
import { request } from '../services/api';
import './Login.css';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const response = await request('sendOTP', { email });
    if (response.success) {
      setStep('otp');
    } else {
      setError(response.message || 'Error sending OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await request('verifyOTP', { email, otp });
    if (response.success) {
      onLogin(response.userData);
    } else {
      setError(response.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* LEFT — Brand Panel */}
      <div className="login-brand-panel">
        <div className="brand-panel-content">
          <video 
            src="/logo.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="brand-logo-large"
          />
          <h2>Internal Team Portal</h2>
          <p>Manage your leads, projects, and team — all in one place.</p>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon"><Shield size={18} /></div>
              <span>OTP-secured access for all team members</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><Zap size={18} /></div>
              <span>Real-time lead tracking & assignment</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><Users size={18} /></div>
              <span>Role-based dashboards for every team</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="login-form-panel">
        <div className="login-box">
          <div className="login-header">
            <div className="logo-icon">
              <video 
                src="/logo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                style={{width: '180px', height: 'auto', borderRadius: '6px'}}
              />
            </div>
            <h1>{step === 'email' ? 'Welcome back' : 'Check your email'}</h1>
            <p>{step === 'email' ? 'Sign in to your team account' : `We sent a 6-digit code to ${email}`}</p>
          </div>

          <form onSubmit={step === 'email' ? handleSendOTP : handleVerifyOTP} className="login-form">
            {step === 'email' ? (
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="name@graydot.in" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label>Verification Code</label>
                <input 
                  type="text" 
                  className="input-field otp-input" 
                  placeholder="000000" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}

            {error && (
              <div className={`error-msg ${error.includes('ACCOUNT_DISABLED') ? 'disclaimer-box' : ''}`}>
                {error.includes('ACCOUNT_DISABLED') ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center', padding: '10px'}}>
                    <Shield size={32} style={{color: '#ef4444', marginBottom: '8px'}} />
                    <strong style={{fontSize: '1.1rem'}}>Security Disclaimer</strong>
                    <span>{error.replace('ACCOUNT_DISABLED: ', '')}</span>
                  </div>
                ) : error}
              </div>
            )}

            {!error.includes('ACCOUNT_DISABLED') && (
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <Loader className="spin" size={18} /> : (step === 'email' ? 'Continue' : 'Verify & Sign in')}
                {!loading && <ArrowRight size={18} />}
              </button>
            )}
            
            {step === 'otp' && (
              <button 
                type="button" 
                className="btn btn-ghost w-full" 
                onClick={() => { setStep('email'); setOtp(''); setError(''); }} 
                style={{marginTop: '10px'}}
              >
                ← Use different email
              </button>
            )}
          </form>
          
          <div className="login-footer">
            <p>GrayDot Internal System</p>
            <small>Authorized access only • Encrypted</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
