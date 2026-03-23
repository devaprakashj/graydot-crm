import React, { useState, useEffect } from 'react';
import { request, getRequest } from '../../services/api';
import { ShieldCheck, XCircle, CheckCircle, Clock, AlertTriangle, ExternalLink, Github, Globe, Code } from 'lucide-react';

const TestingView: React.FC<{ user: any }> = ({ user }) => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await getRequest('getProjects', { role: 'Tester', email: user.email });
    if (res.success) setProjects(res.data);
  };

  const handleTestResult = async (projectId: string, leadId: string, result: 'Pass' | 'Fail') => {
    let feedback = '';
    if (result === 'Fail') {
      feedback = window.prompt("Why did this project fail QA? Please provide specific feedback for the developer.") || 'No specific reasons given.';
      if (feedback === null) return;
    }

    const confirmation = window.confirm(`Confirm project successfully ${result === 'Pass' ? 'PASSED' : 'FAILED'} QA?`);
    if (confirmation) {
      const res = await request('testerAction', { projectId, leadId, result, feedback, userEmail: user.email });
      if (res.success) fetchProjects();
    }
  };

  return (
    <div className="tester-view animate-fade-in">
      <div className="section-header">
        <div>
          <h3>QA & Quality Control</h3>
          <p className="text-muted">Test projects and ensure high standards</p>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
          {projects.map((p, idx) => (
            <div key={idx} className="glass-card p-24 animate-fade-in" style={{
              animationDelay: `${idx * 0.05}s`,
              borderTop: `4px solid ${p[5] === 'Fail' ? 'var(--rose)' : 'var(--brand-600)'}`
            }}>
              <div className="card-header">
                <span className="lead-id" style={{fontSize: '0.75rem'}}>{p[0]} (Dev: {p[2]})</span>
                <span className={`status-badge ${p[5] === 'Fail' ? 'status-new' : 'status-interested'}`} style={{background: p[5] === 'Fail' ? 'var(--rose-bg)' : undefined, color: p[5] === 'Fail' ? 'var(--rose)' : undefined}}>
                  {p[5] === 'Fail' ? 'RE-TESTING' : 'Waiting QA'}
                </span>
              </div>
              
              <div style={{margin: '16px 0'}}>
                <h4 style={{fontSize: '1.2rem'}}>{p[10]}</h4>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-600)', background: 'var(--brand-50)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.82rem', marginTop: '4px', width: 'fit-content'}}>
                    <Code size={14} /> <strong>Req:</strong> {p[11]}
                </div>
              </div>

              <div style={{background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem'}}>
                 <div style={{fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <ExternalLink size={14} /> SUBMITTED LINKS (Review these)
                 </div>
                 
                 <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <a href={p[7]} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{justifyContent: 'flex-start', background: 'white', padding: '12px', border: '1px solid var(--gray-200)', color: 'black'}}>
                       <Github size={16} /> <strong>Repository:</strong> {p[7]}
                    </a>
                    {p[8] && (
                      <a href={p[8]} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{justifyContent: 'flex-start', background: 'white', padding: '12px', border: '1px solid var(--gray-200)', color: 'var(--brand-600)'}}>
                         <Globe size={16} /> <strong>Live Preview:</strong> {p[8]}
                      </a>
                    )}
                 </div>
              </div>

              <div className="card-actions" style={{display: 'flex', gap: '12px'}}>
                <button className="btn btn-primary" style={{background: 'var(--emerald)', border: 'none', flex: 1}} onClick={() => handleTestResult(p[0], p[1], 'Pass')}>
                   <CheckCircle size={16} /> PASS 
                </button>
                <button className="btn btn-ghost" style={{color: 'var(--rose)', flex: 1, borderColor: 'var(--rose)'}} onClick={() => handleTestResult(p[0], p[1], 'Fail')}>
                   <XCircle size={16} /> FAIL
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card p-60">
          <div className="icon-box" style={{background: 'var(--gray-100)', color: 'var(--gray-400)', width: '64px', height: '64px', marginBottom: '20px'}}>
             <ShieldCheck size={32} />
          </div>
          <h3>Everything looks good</h3>
          <p className="text-muted">There are no projects waiting for testing at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default TestingView;
