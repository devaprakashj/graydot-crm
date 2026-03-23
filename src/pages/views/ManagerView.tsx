import React, { useState, useEffect } from 'react';
import { request, getRequest } from '../../services/api';
import { CheckCircle, XCircle, User, Calendar, Briefcase, FileCheck, IndianRupee, Clock, Download, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ManagerView: React.FC<{ user: any }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'Approvals' | 'Pipeline'>('Approvals');
  const [leads, setLeads] = useState<any[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [approvalModal, setApprovalModal] = useState<any>(null);
  const [formData, setFormData] = useState({ developer: '', deadline: '' });

  useEffect(() => {
    fetchLeads();
    fetchAllLeads();
    fetchDevelopers();
  }, []);

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 45, 90);
    doc.text('GrayDot Global Lead Pipeline', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Role: Manager Export (${user.name})`, 14, 35);
    doc.text(`Total Leads: ${allLeads.length}`, 14, 40);
    
    const tableData = allLeads.map(l => [
      l[0], // ID
      l[1], // Client
      `${l[8]||'System'} / ${l[9]}`, // Owners
      l[4]?.substring(0, 40), // Req
      l[5] === 'Unassigned' || !l[5] ? '₹-' : `₹${l[5]}`, // Price
      l[10], // Status
      l[14] || 'Initialized' // Step
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Lead ID', 'Client', 'Lead/Sales', 'Requirement', 'Price', 'Status', 'Step']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 45, 90], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    doc.save(`graydot-manager-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const fetchAllLeads = async () => {
    const res = await getRequest('getLeads', { role: user.role, email: user.email });
    if (res.success) setAllLeads(res.data);
  };

  const fetchLeads = async () => {
    const res = await getRequest('getLeads', { role: user.role, email: user.email });
    if (res.success) setLeads(res.data);
  };

  const fetchDevelopers = async () => {
    const res = await getRequest('getUsers');
    if (res.success) {
      setDevelopers(res.data.filter((u: any) => u[3] === 'Developer'));
    }
  };

  const handleManagerAction = async (leadId: string, action: 'Approved' | 'Rejected') => {
    if (action === 'Approved') {
      const res = await request('managerAction', { 
        leadId, 
        managerAction: 'Approved', 
        developer: formData.developer, 
        deadline: formData.deadline,
        managerEmail: user.email 
      });
      if (res.success) {
        setApprovalModal(null);
        setFormData({ developer: '', deadline: '' });
        fetchLeads();
      }
    } else {
      if (window.confirm("Reject and send back to Sales?")) {
        const res = await request('managerAction', { leadId, managerAction: 'Rejected', managerEmail: user.email });
        if (res.success) fetchLeads();
      }
    }
  };

  const handleFinalApproval = async (leadId: string) => {
    if (window.confirm("Give final approval for delivery?")) {
      const res = await request('finalManagerApproval', { leadId, managerEmail: user.email });
      if (res.success) fetchLeads();
    }
  };

  return (
    <div className="manager-view animate-fade-in">
      <div className="section-header">
        <div>
          <h3>Manager Dashboard</h3>
          <p className="text-muted">Review approvals and monitor global project pipeline</p>
        </div>
        <div style={{display: 'flex', gap: '8px'}}>
           <button className={`btn ${activeTab === 'Approvals' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('Approvals')}>
              <CheckCircle size={17} /> Approval Queue
           </button>
           <button className={`btn ${activeTab === 'Pipeline' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setActiveTab('Pipeline'); fetchAllLeads(); }}>
              <Briefcase size={17} /> All Leads
           </button>
        </div>
      </div>

      {activeTab === 'Approvals' ? (
        <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
        {/* Section 1: Lead Approval (Step 3) */}
        <section>
          <h4 style={{marginBottom: '16px', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Briefcase size={18} /> New Interested Leads
          </h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {leads.filter(l => l[11] === 'Pending').map((l, idx) => (
              <div key={idx} className="glass-card p-20 animate-fade-in" style={{borderLeft: '4px solid var(--amber)'}}>
                <div className="card-header">
                  <span className="lead-id">{l[0]}</span>
                </div>
                <h4 style={{marginTop: '12px', fontSize: '1.2rem'}}>{l[1]}</h4>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', padding: '12px', background: 'var(--gray-50)', borderRadius: '8px', fontSize: '0.85rem'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <User size={14} className="text-muted" /> <strong>Lead By:</strong> {l[8]}
                   </div>
                   <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Clock size={14} className="text-muted" /> <strong>Sales By:</strong> {l[9]}
                   </div>
                </div>

                <p className="text-muted" style={{fontSize: '0.85rem', margin: '14px 0'}}><strong>Requirement:</strong> {l[4]}</p>
                
                <div style={{display: 'flex', gap: '8px', fontSize: '1rem', color: 'var(--brand-600)', fontWeight: 700, marginBottom: '20px'}}>
                   <IndianRupee size={16} /> Price: ₹{l[5]}
                </div>

                <div style={{display: 'flex', gap: '10px'}}>
                  <button className="btn btn-primary" style={{flex: 1, padding: '10px'}} onClick={() => setApprovalModal(l)}>
                     Approve / Assign
                  </button>
                  <button className="btn btn-ghost" style={{padding: '10px', color: 'var(--rose)'}} onClick={() => handleManagerAction(l[0], 'Rejected')}>
                     <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
            {leads.filter(l => l[11] === 'Pending').length === 0 && <div className="empty-state p-40">No new approvals pending.</div>}
          </div>
        </section>

        {/* Section 2: Final Review (Step 6) */}
        <section>
          <h4 style={{marginBottom: '16px', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <FileCheck size={18} /> Final Project Approval
          </h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {leads.filter(l => l[14] === 'Awaiting Final Approval' || l[14] === 'In QA Testing').map((l, idx) => (
              <div key={idx} className="glass-card p-20 animate-fade-in" style={{borderLeft: '4px solid var(--emerald)'}}>
                <div className="card-header">
                  <span className="lead-id">{l[0]}</span>
                  <span className="status-badge status-interested" style={{fontSize: '0.7rem'}}>{l[14]}</span>
                </div>
                <h4 style={{marginTop: '12px'}}>{l[1]}</h4>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', fontWeight: 600, margin: '12px 0', fontSize: '0.85rem'}}>
                  {l[14] === 'Awaiting Final Approval' ? <><CheckCircle size={16} /> PASSED QA</> : <><Clock size={16} /> TESTING IN PROGRESS</>}
                </div>
                <button className="btn btn-primary w-full" disabled={l[14] !== 'Awaiting Final Approval'} onClick={() => handleFinalApproval(l[0])}>
                   {l[14] === 'Awaiting Final Approval' ? 'Approve for Delivery' : 'In QA Phase'}
                </button>
              </div>
            ))}
            {leads.filter(l => l[14] === 'Awaiting Final Approval' || l[14] === 'In QA Testing').length === 0 && <div className="empty-state p-40">No projects waiting for review.</div>}
          </div>
        </section>
      </div>
      ) : (
        <div className="animate-fade-in">
           <div className="section-header" style={{margin: '10px 0 20px 0'}}>
              <div>
                 <h4 style={{margin: 0, fontSize: '1.1rem'}}>Global Lead Pipeline</h4>
                 <p className="text-muted" style={{fontSize: '0.85rem'}}>Full visibility across all project departments</p>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                 <button className="btn btn-ghost" onClick={downloadReport} style={{color: 'var(--brand-600)'}}>
                    <Download size={16} /> Download PDF
                 </button>
                 <button className="btn btn-ghost" onClick={fetchAllLeads}>
                    <RefreshCw size={16} /> Sync Pipeline
                 </button>
              </div>
           </div>
           <div className="glass-card" style={{overflowX: 'auto', padding: '12px'}}>
              <table style={{minWidth: '950px', width: '100%', borderCollapse: 'collapse'}}>
                 <thead>
                    <tr>
                       <th style={{textAlign: 'left', width: '80px', fontSize: '0.75rem'}}>Lead ID</th>
                       <th style={{textAlign: 'left', width: '150px', fontSize: '0.75rem'}}>Client</th>
                       <th style={{textAlign: 'left', width: '180px', fontSize: '0.75rem'}}>Owners</th>
                       <th style={{textAlign: 'left', fontSize: '0.75rem'}}>Requirement</th>
                       <th style={{textAlign: 'left', width: '100px', fontSize: '0.75rem'}}>Financials</th>
                       <th style={{textAlign: 'left', width: '150px', fontSize: '0.75rem'}}>Status & Step</th>
                       <th style={{textAlign: 'left', width: '110px', fontSize: '0.75rem'}}>Created</th>
                    </tr>
                 </thead>
                 <tbody>
                    {allLeads.map((l, idx) => (
                       <tr key={idx} style={{borderBottom: '1px solid var(--gray-100)'}}>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}><span className="lead-id" style={{fontSize: '0.65rem'}}>{l[0]}</span></td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{fontWeight: 700, fontSize: '0.85rem', marginBottom: '2px'}}>{l[1]}</div>
                             <div style={{fontSize: '0.7rem', color: 'var(--gray-500)'}}>{l[2]}</div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '2px'}}>
                                <span><b className="text-muted">Lead:</b> {l[8] || 'System'}</span>
                                <span><b className="text-brand">Sales:</b> {l[9]}</span>
                                {l[12] && <span><b style={{color: 'var(--emerald)'}}>Dev:</b> {l[12]}</span>}
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0', maxWidth: '160px'}}>
                             <div style={{fontSize: '0.75rem', lineHeight: '1.4', marginBottom: '4px'}}>{l[4]}</div>
                             <div style={{fontSize: '0.6rem', display: 'inline-block', padding: '2px 6px', background: 'var(--gray-50)', borderRadius: '4px', color: 'var(--gray-500)'}}>
                                Src: {l[3]}
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{fontWeight: 800, color: l[5] === 'Unassigned' ? 'var(--gray-400)' : 'var(--emerald)', fontSize: '0.8rem'}}>
                                {l[5] === 'Unassigned' || !l[5] ? '₹-' : `₹${l[5]}`}
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                                <span className={`status-badge status-${l[10]?.toLowerCase().replace(' ', '-')}`} style={{fontSize: '0.6rem', padding: '4px 8px'}}>
                                   {l[10]}
                                </span>
                                <span style={{fontSize: '0.6rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.4px'}}>
                                   {l[14] || 'Initialized'}
                                </span>
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0', fontSize: '0.7rem', color: 'var(--gray-500)'}}>
                             <div>{l[15] && !isNaN(new Date(l[15]).getTime()) ? new Date(l[15]).toLocaleDateString() : (l[6] || 'N/A')}</div>
                             <div style={{fontSize: '0.65rem'}}>{l[14] ? (l[13] || 'No Deadline') : (l[6] || '')}</div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {approvalModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setApprovalModal(null)}>
          <div className="modal-content glass-card animate-fade-in">
            <h3>Approve & Assign Developer</h3>
            <p className="text-muted">Lead: {approvalModal[1]}</p>
            <form onSubmit={(e) => { e.preventDefault(); handleManagerAction(approvalModal[0], 'Approved'); }}>
              <div className="input-group">
                <label><User size={14} /> Assign Developer</label>
                <select className="input-field" value={formData.developer} onChange={e => setFormData({...formData, developer: e.target.value})} required>
                  <option value="">Select a Developer...</option>
                  {developers.map(d => <option key={d[2]} value={d[2]}>{d[1]}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label><Calendar size={14} /> Project Deadline</label>
                <input type="date" className="input-field" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setApprovalModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm & Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerView;
