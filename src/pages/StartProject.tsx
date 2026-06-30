import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import ProjectForm from '../components/landing/ProjectForm';
import LoadingState from '../components/landing/LoadingState';
import SuccessState from '../components/landing/SuccessState';
import { request } from '../services/api';
import './StartProject.css';

const StartProject: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [leadId, setLeadId] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (formData: any) => {
    setStatus('loading');
    setGlobalError(null);

    // Format requirement to include Company, Email, and Service
    const formattedRequirement = `[Service: ${formData.serviceType}]
[Company: ${formData.company || 'N/A'}]
[Email: ${formData.email}]

${formData.description}`;

    const payload = {
      action: 'addLead',
      clientName: formData.name,
      phone: formData.phone,
      source: 'Website',
      requirement: formattedRequirement,
      budget: formData.budget,
      timeline: formData.timeline,
      notes: `Email: ${formData.email}${formData.company ? ` | Company: ${formData.company}` : ''}`,
      leadOwner: 'website@graydot.in', // System identifier
    };

    try {
      const response = await request('addLead', payload);
      
      if (response.success && response.leadId) {
        setLeadId(response.leadId);
        setStatus('success');
      } else {
        setStatus('idle');
        setGlobalError(response.message || 'Something went wrong. Please try again or email hi@graydot.in.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('idle');
      setGlobalError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="gd-page gd-form-page">
      {/* We pass a no-op to onGetQuote so the navbar button doesn't do anything or just scrolls to top */}
      <Navbar onGetQuote={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      
      <main className="gd-form-container">
        <div className="gd-form-header">
          <div className="gd-eyebrow">Start a Project</div>
          <h1>Let's build something <span className="gd-gradient-text">great</span></h1>
          <p>Fill out the form below and our team will get back to you within 24 hours.</p>
        </div>

        <div className="gd-form-card">
          {status === 'idle' && <ProjectForm onSubmit={handleSubmit} globalError={globalError} />}
          {status === 'loading' && <LoadingState />}
          {status === 'success' && leadId && <SuccessState leadId={leadId} />}
        </div>
      </main>

      <div style={{ marginTop: '120px' }}>
        <Footer />
      </div>
    </div>
  );
};

export default StartProject;
