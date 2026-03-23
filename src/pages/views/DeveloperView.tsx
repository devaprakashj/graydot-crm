import React, { useState, useEffect } from 'react';
import { request, getRequest } from '../../services/api';
import { Package, Clock, CheckCircle, Calendar, Code, HelpCircle } from 'lucide-react';

const DeveloperView: React.FC<{ user: any }> = ({ user }) => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await getRequest('getProjects', { role: 'Developer', email: user.email });
    if (res.success) setProjects(res.data);
  };

  const handleComplete = async (projectId: string, leadId: string) => {
    const repoLink = window.prompt("Enter GitHub Repository Link:");
    if (!repoLink) return;
    const liveLink = window.prompt("Enter Live/Preview Link (Optional):");

    if (window.confirm("Complete this project? Links will be sent to QA.")) {
      const res = await request('completeProject', { projectId, leadId, repoLink, liveLink, userEmail: user.email });
      if (res.success) fetchProjects();
    }
  };

  const handleMoreInfo = async (projectId: string) => {
    const note = window.prompt("What extra info is needed from the Sales Team?");
    if (note !== null) {
      const res = await request('requestMoreInfo', { projectId, note, userEmail: user.email });
      if (res.success) fetchProjects();
    }
  };

  return (
    <div className="developer-view animate-fade-in">
      <div className="section-header">
        <div>
          <h3>My Assigned Projects</h3>
          <p className="text-muted">Development and delivery queue</p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
          {projects.map((p, idx) => (
            <div key={idx} className="glass-card p-24 animate-fade-in" style={{
              animationDelay: `${idx * 0.05}s`,
              borderLeft: `4px solid ${p[3] === 'Completed' ? 'var(--emerald)' : (p[3] === 'Pending More Info' ? 'var(--amber)' : 'var(--brand-500)')}`
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <span className="lead-id" style={{fontSize: '0.75rem'}}>{p[0]} (Lead ID: {p[1]})</span>
                <span className={`status-badge ${p[3] === 'Completed' ? 'status-interested' : (p[3] === 'Pending More Info' ? 'status-new' : 'status-new')}`} 
                      style={{background: p[3] === 'Pending More Info' ? 'var(--amber-bg)' : undefined, color: p[3] === 'Pending More Info' ? 'var(--amber)' : undefined}}>
                  {p[3]}
                </span>
              </div>
              
              <div style={{marginBottom: '20px'}}>
                 {/* Indices: p[10] Client, p[11] Req */}
                 <h4 style={{fontSize: '1.2rem', marginBottom: '4px'}}>{p[10] || 'Project'}</h4>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-600)', background: 'var(--brand-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', width: 'fit-content'}}>
                    <Code size={14} /> <strong>Requirement:</strong> {p[11]}
                 </div>
              </div>
              
              <div style={{background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem'}}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-600)', paddingBottom: '8px'}}>
                    <Calendar size={14} /> <strong>Deadline:</strong> {p[4]}
                 </div>
                 {p[9] && p[3] === 'In Progress' && (
                   <div style={{marginTop: '10px', color: 'var(--rose)', background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid var(--rose-light)'}}>
                      <div style={{fontWeight: 700, marginBottom: '4px'}}>QA FEEDBACK:</div>
                      {p[9]}
                   </div>
                 )}
              </div>
              
              <div className="card-actions" style={{display: 'flex', gap: '10px'}}>
                {p[3] === 'In Progress' ? (
                  <>
                    <button className="btn btn-primary" style={{flex: 1}} onClick={() => handleComplete(p[0], p[1])}>
                      <CheckCircle size={16} /> Mark Completed
                    </button>
                    <button className="btn btn-ghost" style={{color: 'var(--amber)'}} onClick={() => handleMoreInfo(p[0])}>
                      <HelpCircle size={16} /> Need Info
                    </button>
                  </>
                ) : (
                  <div className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem'}}>
                    <Clock size={18} /> {p[3]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <div className="icon-box" style={{background: 'var(--gray-100)', color: 'var(--gray-400)', width: '56px', height: '56px', marginBottom: '16px'}}>
            <Package size={26} />
          </div>
          <h3>Steady and Smooth</h3>
          <p className="text-muted">No projects assigned to you right now</p>
        </div>
      )}
    </div>
  );
};

export default DeveloperView;
