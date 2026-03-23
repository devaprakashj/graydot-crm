import React, { useState, useEffect } from 'react';
import { PlusCircle, Briefcase, User as UserIcon, Zap, FileText, Phone, Clock, Notebook, Target } from 'lucide-react';
import { request, getRequest } from '../../services/api';

const LeadGenerationView: React.FC<{ user: any }> = ({ user }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ 
    clientName: '', 
    phone: '', 
    source: 'Manual',
    requirement: '',
    timeline: '',
    notes: ''
  });
  const [tracker, setTracker] = useState<any>(null);

  useEffect(() => { 
    fetchLeads(); 
    fetchTracker();
  }, []);

  const fetchTracker = async () => {
    const res = await getRequest('getDailyTracker', { email: user.email });
    if (res.success) setTracker(res.data);
  };

  const fetchLeads = async () => {
    const res = await getRequest('getLeads', { role: user.role, email: user.email });
    if (res.success) setLeads(res.data);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await request('addLead', { ...formData, budget: '0', leadOwner: user.email });
    if (res.success) {
      setShowAddModal(false);
      setFormData({ clientName: '', phone: '', source: 'Manual', requirement: '', timeline: '', notes: '' });
      fetchLeads();
      fetchTracker();
    }
  };

  return (
    <div className="lead-view animate-fade-in">
      <div className="section-header">
        <div>
          <h3>Lead Generation Team</h3>
          <p className="text-muted">Create leads and track automatic sales assignment</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <PlusCircle size={17} />
          New Lead
        </button>
      </div>

      <div className="glass-card p-24 mb-24 animate-fade-in" style={{borderLeft: '4px solid var(--brand-500)'}}>
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px'}}>
            <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '0.9rem'}}>
               <Target size={18} style={{color: 'var(--brand-600)'}} /> Today's Performance Target
            </h4>
            <span style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-600)'}}>
              {tracker ? `${tracker.count} / ${tracker.target} Leads` : 'Loading...'}
            </span>
         </div>
         <div style={{height: '10px', background: 'var(--gray-100)', borderRadius: '10px', overflow: 'hidden'}}>
            <div style={{
              height: '100%', 
              width: `${tracker?.progress || 0}%`, 
              background: 'linear-gradient(90deg, var(--brand-400), var(--brand-600))',
              borderRadius: '10px',
              transition: 'width 1s ease-out'
            }}></div>
         </div>
         <p className="text-muted" style={{fontSize: '0.75rem', marginTop: '10px'}}>
            {tracker 
              ? `You have completed ${Math.round(tracker.progress)}% of your daily goal. ${tracker.count < tracker.target ? `Just ${tracker.target - tracker.count} more to go!` : 'Daily target achieved! Great job! 🌟'}`
              : 'Syncing your today\'s performance...'}
         </p>
      </div>

      <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px'}}>
        <div className="stats-card glass-card">
          <div>
            <h3>Leads Created</h3>
            <p>{leads.length}</p>
          </div>
          <div className="icon-box" style={{background: 'var(--brand-50)', color: 'var(--brand-600)'}}>
            <FileText size={20} />
          </div>
        </div>
        <div className="stats-card glass-card">
          <div>
            <h3>Sales Assigned</h3>
            <p>{leads.filter(l => l[9] !== 'Unassigned').length}</p>
          </div>
          <div className="icon-box" style={{background: 'var(--emerald-bg)', color: 'var(--emerald)'}}>
            <UserIcon size={20} />
          </div>
        </div>
        <div className="stats-card glass-card">
          <div>
            <h3>Current Pipeline</h3>
            <p>{leads.filter(l => l[14] !== 'Delivered').length}</p>
          </div>
          <div className="icon-box" style={{background: 'var(--amber-bg)', color: 'var(--amber)'}}>
            <Briefcase size={20} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{overflow: 'hidden'}}>
        <div style={{padding: '18px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)'}}>Created Leads</span>
          <span style={{fontSize: '0.75rem', color: 'var(--gray-500)'}}>{leads.length} total</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Lead ID</th><th>Client</th><th>Requirement</th><th>Timeline</th><th>Sales Owner</th><th>Status</th></tr>
            </thead>
            <tbody>
              {leads.map((l, idx) => (
                <tr key={idx}>
                  <td><span className="lead-id">{l[0]}</span></td>
                  <td style={{fontWeight: 600}}>{l[1]}</td>
                  <td style={{color: 'var(--gray-500)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{l[4]}</td>
                  <td style={{fontSize: '0.82rem'}}>{l[6]}</td>
                  <td style={{color: 'var(--gray-500)', fontSize: '0.82rem'}}>{l[9]}</td>
                  <td><span className={`status-badge status-${l[10]?.toLowerCase().replace(' ', '-')}`}>{l[10]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div className="empty-state">
              <h3>No leads created yet</h3>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{marginTop: '12px'}}>Create First Lead</button>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-content glass-card animate-fade-in" style={{maxWidth: '640px', padding: '32px'}}>
            <div style={{marginBottom: '24px'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '8px'}}>Create New Lead</h3>
              <p className="text-muted">Enter client information to initiate sales assignment</p>
            </div>
            
            <form onSubmit={handleAddLead} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div className="input-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-700)'}}>
                  <UserIcon size={14} className="text-brand" /> Client Name
                </label>
                <input className="input-field" placeholder="Full name" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} required />
              </div>

              <div className="input-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-700)'}}>
                  <Phone size={14} className="text-brand" /> Phone Number
                </label>
                <input className="input-field" placeholder="+91 ..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>

              <div className="input-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-700)'}}>
                  <Zap size={14} className="text-brand" /> Lead Source
                </label>
                <select className="input-field" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                  <option value="Manual">Manual Entry</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Website">Website</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-700)'}}>
                  <Clock size={14} className="text-brand" /> Target Timeline
                </label>
                <input className="input-field" placeholder="e.g. 1 Month" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} required />
              </div>

              <div className="input-group" style={{gridColumn: 'span 2'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-700)'}}>
                  <Notebook size={14} className="text-brand" /> Detailed Requirement
                </label>
                <textarea className="input-field" style={{minHeight: '100px', padding: '12px', lineHeight: '1.5'}} value={formData.requirement} onChange={e => setFormData({...formData, requirement: e.target.value})} required placeholder="Explain what the client specifically needs..." />
              </div>

              <div className="input-group" style={{gridColumn: 'span 2'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--gray-700)'}}>
                  <FileText size={14} className="text-brand" /> Additional Notes (Optional)
                </label>
                <input className="input-field" placeholder="Any extra information for Sales team" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>

              <div className="modal-actions" style={{gridColumn: 'span 2', marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{padding: '12px 24px'}}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{padding: '12px 32px'}}>Create & Assign Sales</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGenerationView;
