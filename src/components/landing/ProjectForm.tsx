import React, { useState } from 'react';
import { ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (formData: any) => void;
  globalError: string | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, globalError }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: '',
    budget: '',
    timeline: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\+?[\d\s-]{10,15}$/.test(value)) error = 'Invalid phone number';
        break;
      case 'serviceType':
        if (!value) error = 'Please select a service type';
        break;
      case 'budget':
        if (!value) error = 'Please select a budget range';
        break;
      case 'timeline':
        if (!value) error = 'Please select a timeline';
        break;
      case 'description':
        if (!value.trim()) error = 'Project description is required';
        else if (value.trim().length < 20) error = 'Please provide more details (min 20 characters)';
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Enforce max length on description
    if (name === 'description' && value.length > 500) return;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields and validate
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    if (Object.values(newErrors).every((err) => !err)) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {globalError && (
        <div className="gd-form-global-error">
          <AlertCircle size={20} />
          {globalError}
        </div>
      )}
      
      <div className="gd-form-grid">
        <div className="gd-form-group">
          <label className="gd-form-label" htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`gd-form-input ${errors.name && touched.name ? 'gd-error' : ''}`}
            placeholder="Rahul Kumar"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && <div className="gd-form-error-msg"><AlertCircle size={14} /> {errors.name}</div>}
        </div>

        <div className="gd-form-group">
          <label className="gd-form-label" htmlFor="company">
            Company <span className="gd-form-optional">Optional</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="gd-form-input"
            placeholder="Acme Corp"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="gd-form-group">
          <label className="gd-form-label" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`gd-form-input ${errors.email && touched.email ? 'gd-error' : ''}`}
            placeholder="rahul@example.in"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && <div className="gd-form-error-msg"><AlertCircle size={14} /> {errors.email}</div>}
        </div>

        <div className="gd-form-group">
          <label className="gd-form-label" htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`gd-form-input ${errors.phone && touched.phone ? 'gd-error' : ''}`}
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.phone && touched.phone && <div className="gd-form-error-msg"><AlertCircle size={14} /> {errors.phone}</div>}
        </div>

        <div className="gd-form-group gd-form-group-full">
          <label className="gd-form-label" htmlFor="serviceType">Service Required</label>
          <select
            id="serviceType"
            name="serviceType"
            className={`gd-form-select ${errors.serviceType && touched.serviceType ? 'gd-error' : ''}`}
            value={formData.serviceType}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="" disabled>Select a service</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App Development</option>
            <option value="AI Automation">AI Automation Systems</option>
            <option value="E-Commerce">E-Commerce Solutions</option>
            <option value="SEO & Marketing">SEO & Digital Marketing</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Other">Other</option>
          </select>
          {errors.serviceType && touched.serviceType && <div className="gd-form-error-msg"><AlertCircle size={14} /> {errors.serviceType}</div>}
        </div>

        <div className="gd-form-group">
          <label className="gd-form-label" htmlFor="budget">Estimated Budget</label>
          <select
            id="budget"
            name="budget"
            className={`gd-form-select ${errors.budget && touched.budget ? 'gd-error' : ''}`}
            value={formData.budget}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="" disabled>Select budget range</option>
            <option value="₹25K - ₹50K">₹25K - ₹50K</option>
            <option value="₹50K - ₹1L">₹50K - ₹1L</option>
            <option value="₹1L - ₹5L">₹1L - ₹5L</option>
            <option value="₹5L+">₹5L+</option>
          </select>
          {errors.budget && touched.budget && <div className="gd-form-error-msg"><AlertCircle size={14} /> {errors.budget}</div>}
        </div>

        <div className="gd-form-group">
          <label className="gd-form-label" htmlFor="timeline">Expected Timeline</label>
          <select
            id="timeline"
            name="timeline"
            className={`gd-form-select ${errors.timeline && touched.timeline ? 'gd-error' : ''}`}
            value={formData.timeline}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="" disabled>Select timeline</option>
            <option value="ASAP (< 1 month)">ASAP (&lt; 1 month)</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="Flexible">Flexible</option>
          </select>
          {errors.timeline && touched.timeline && <div className="gd-form-error-msg"><AlertCircle size={14} /> {errors.timeline}</div>}
        </div>

        <div className="gd-form-group gd-form-group-full">
          <label className="gd-form-label" htmlFor="description">Project Details</label>
          <textarea
            id="description"
            name="description"
            className={`gd-form-textarea ${errors.description && touched.description ? 'gd-error' : ''}`}
            placeholder="Tell us about your project goals, target audience, and any specific features you need..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="gd-form-label" style={{ marginTop: 4 }}>
            {errors.description && touched.description ? (
              <span className="gd-form-error-msg" style={{ marginTop: 0 }}><AlertCircle size={14} /> {errors.description}</span>
            ) : (
              <span></span> // Empty span to maintain flex space-between
            )}
            <span className={`gd-char-counter ${formData.description.length >= 500 ? 'gd-limit-reached' : ''}`}>
              {formData.description.length}/500
            </span>
          </div>
        </div>
      </div>
      
      <div className="gd-form-actions">
        <div className="gd-form-secure-badge">
          <ShieldCheck size={16} /> Your information is secure and encrypted
        </div>
        <button type="submit" className="gd-btn gd-btn-primary gd-btn-lg">
          Submit Enquiry <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
