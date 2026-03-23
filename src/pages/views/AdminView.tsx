import React, { useState, useEffect } from 'react';
import { UserPlus, Power, PowerOff, Search, Edit2, Settings, Save, Building, CreditCard, FileText, Target, TrendingUp, RefreshCw, AlertCircle, Briefcase, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { request, getRequest } from '../../services/api';

const AdminView: React.FC<{ user: any }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'Team' | 'Settings' | 'Rescue' | 'Finance' | 'Activity' | 'Performance' | 'Pipeline'>('Team');
  const [team, setTeam] = useState<any[]>([]);
  const [orphanedWork, setOrphanedWork] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [financeStats, setFinanceStats] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Sales' });
  const [editData, setEditData] = useState({ userId: '', name: '', email: '', role: '' });

  // Settings state
  const [settings, setSettings] = useState({
    companyName: 'GrayDot',
    address: '123 Innovation Hub, Tech City, IN 600001',
    phone: '+91 98765 43210',
    email: 'sales@graydot.com',
    bankName: 'HDFC Bank',
    accNo: '1234567890',
    ifsc: 'HDFC0001234',
    terms: 'Please include invoice number in payment notes. This is a computer generated invoice.',
    dailyTarget: '10'
  });

  useEffect(() => {
    fetchUsers();
    fetchSettings();
    fetchFinance();
    fetchLogs();
    fetchPerformance();
    fetchAllLeads();
  }, []);

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 45, 90);
    doc.text('GrayDot Global Lead Pipeline', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Active Leads: ${allLeads.length}`, 14, 35);
    
    const tableData = allLeads.map(l => [
      l[0], // ID
      l[1], // Client
      `${l[8]||'System'} / ${l[9]}`, // Owners
      l[4]?.substring(0, 40), // Req
      l[5] === 'Unassigned' ? '₹-' : `₹${l[5]}`, // Price
      l[10], // Status
      l[14] || 'Initialized' // Step
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Lead ID', 'Client', 'Lead/Sales', 'Requirement', 'Price', 'Status', 'Step']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 45, 90], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    doc.save(`graydot-admin-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const fetchAllLeads = async () => {
    try {
      const res = await getRequest('getLeads', { role: 'Admin' });
      if (res.success) setAllLeads(res.data);
      else console.error("Leads fail:", res.message);
    } catch (e) { console.error("Leads crash:", e); }
  };

  const fetchPerformance = async () => {
    try {
      const res = await getRequest('getTeamPerformance');
      if (res.success) setPerformance(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchFinance = async () => {
    try {
      const res = await getRequest('getFinanceStats', { email: user.email });
      if (res.success) setFinanceStats(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchLogs = async () => {
    try {
      const res = await getRequest('getActivityLogs', { email: user.email });
      if (res.success) setActivityLogs(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchOrphanedWork = async () => {
    try {
      const res = await getRequest('getOrphanedWork', { email: user.email });
      if (res.success) setOrphanedWork(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await getRequest('getUsers');
      if (res.success) setTeam(res.data);
      else alert("Restricted: " + res.message);
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res = await getRequest('getSettings');
      if (res.success && res.data) {
        const tRes = await getRequest('getDailyTracker', { email: user.email });
        setSettings({ ...res.data, dailyTarget: tRes.success ? tRes.data.target.toString() : '10' });
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveSettings = async () => {
    const res = await request('updateSettings', { ...settings, adminEmail: user.email });
    if (res.success) {
      await request('updateDailyTarget', { newTarget: settings.dailyTarget });
      alert("All settings & Daily Target saved successfully!");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await request('addUser', { ...formData, createdBy: user.email });
      if (res.success) {
        alert("User added successfully! They will receive a welcome email.");
        setShowAddModal(false);
        setFormData({ name: '', email: '', role: 'Sales' });
        fetchUsers();
      } else {
        alert("Failed to add user: " + res.message);
      }
    } catch (err) {
      alert("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await request('updateUser', { ...editData, adminEmail: user.email });
      if (res.success) {
        alert("User updated successfully!");
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert("Failed to update user: " + res.message);
      }
    } catch (err) {
      alert("Error updating user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (u: any) => {
    setEditData({
      userId: u[0],
      name: u[1],
      email: u[2],
      role: u[3]
    });
    setShowEditModal(true);
  };

  const toggleUserStatus = async (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    const res = await request('updateUserStatus', { email, status: newStatus, adminEmail: user.email });
    if (res.success) fetchUsers();
  };

  const filteredTeam = team.filter(u =>
    u[1]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u[2]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u[3]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-view animate-fade-in" style={{paddingRight: '24px', maxWidth: '100%', overflowX: 'hidden'}}>
      <div className="section-header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '32px'}}>
        <div>
          <h3>Admin Control Panel</h3>
          <p className="text-muted">Manage system users, pipelines, and global configurations</p>
        </div>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start'}}>
          <button 
            className={`btn ${activeTab === 'Team' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => setActiveTab('Team')}
            style={{flex: '0 1 auto', minWidth: '140px'}}
          >
            <UserPlus size={17} /> Team
          </button>
          <button 
            className={`btn ${activeTab === 'Settings' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => setActiveTab('Settings')}
            style={{flex: '0 1 auto', minWidth: '160px'}}
          >
            <Settings size={17} /> Invoice Theme
          </button>
          <button 
            className={`btn ${activeTab === 'Rescue' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => {
              setActiveTab('Rescue');
              fetchOrphanedWork();
            }}
            style={{flex: '0 1 auto', minWidth: '160px'}}
          >
            <PowerOff size={17} /> Task Rescue
          </button>
          <button 
            className={`btn ${activeTab === 'Finance' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => {
              setActiveTab('Finance');
              fetchFinance();
            }}
            style={{flex: '0 1 auto', minWidth: '140px'}}
          >
            <CreditCard size={17} /> Finance
          </button>
          <button 
            className={`btn ${activeTab === 'Activity' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => {
              setActiveTab('Activity');
              fetchLogs();
            }}
            style={{flex: '0 1 auto', minWidth: '160px'}}
          >
            <FileText size={17} /> System Logs
          </button>
          <button 
            className={`btn ${activeTab === 'Performance' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => {
              setActiveTab('Performance');
              fetchPerformance();
            }}
            style={{flex: '0 1 auto', minWidth: '160px'}}
          >
            <TrendingUp size={17} /> Performance
          </button>
          <button 
            className={`btn ${activeTab === 'Pipeline' ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => {
              setActiveTab('Pipeline');
              fetchAllLeads();
            }}
            style={{flex: '0 1 auto', minWidth: '160px'}}
          >
            <Briefcase size={17} /> Lead Pipeline
          </button>
        </div>
      </div>

      {activeTab === 'Team' ? (
        <>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px'}}>
            <div style={{position: 'relative', maxWidth: '320px', flex: 1}}>
              <Search size={16} style={{position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)'}} />
              <input
                className="input-field"
                placeholder="Search by name, email or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{paddingLeft: '38px', fontSize: '0.85rem'}}
              />
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} /> Add Team Member
            </button>
          </div>

          <div className="table-container glass-card">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{width: '120px'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.map((u, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div className="user-avatar" style={{width: '32px', height: '32px', fontSize: '0.75rem', borderRadius: '8px'}}>
                          {u[1]?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{fontWeight: 600}}>{u[1]}</span>
                      </div>
                    </td>
                    <td style={{color: 'var(--gray-500)'}}>{u[2]}</td>
                    <td><span className="user-role-badge">{u[3]}</span></td>
                    <td>
                      <span className={`status-badge ${u[4] === 'Active' ? 'status-interested' : 'status-rejected'}`}>
                        {u[4]}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <button className="btn btn-ghost" style={{padding: '6px 10px'}} onClick={() => openEditModal(u)}><Edit2 size={14} /></button>
                        <button className={`btn ${u[4] === 'Active' ? 'btn-danger' : 'btn-primary'}`} style={{padding: '6px 10px'}} onClick={() => toggleUserStatus(u[2], u[4])}>
                          {u[4] === 'Active' ? <PowerOff size={14} /> : <Power size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === 'Settings' ? (
        <div className="glass-card p-32 animate-fade-in" style={{maxWidth: '800px'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}><Building size={18} className="text-muted" /> Company Identity</h4>
              <div className="input-group">
                <label>Company Name</label>
                <input className="input-field" value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Address</label>
                <textarea className="input-field" style={{minHeight: '80px'}} value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="input-group">
                  <label>Support Phone</label>
                  <input className="input-field" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Support Email</label>
                  <input className="input-field" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                </div>
              </div>
              
              <hr style={{border: 'none', borderTop: '1px solid var(--gray-100)', margin: '15px 0'}} />
              
              <div className="input-group">
                <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}><Target size={18} className="text-brand" /> Team Performance Settings</h4>
                <label>Daily Lead Target (Per Member)</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <input type="number" className="input-field" style={{maxWidth: '120px'}} value={settings.dailyTarget} onChange={e => setSettings({...settings, dailyTarget: e.target.value})} />
                  <span className="text-muted">leads / day</span>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}><CreditCard size={18} className="text-muted" /> Bank Details</h4>
              <div className="input-group">
                <label>Bank Name</label>
                <input className="input-field" value={settings.bankName} onChange={e => setSettings({...settings, bankName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Account Number</label>
                <input className="input-field" value={settings.accNo} onChange={e => setSettings({...settings, accNo: e.target.value})} />
              </div>
              <div className="input-group">
                <label>IFSC Code</label>
                <input className="input-field" value={settings.ifsc} onChange={e => setSettings({...settings, ifsc: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="input-group" style={{marginTop: '24px'}}>
             <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}><FileText size={18} className="text-muted" /> Terms & Conditions</h4>
             <textarea className="input-field" style={{minHeight: '100px'}} value={settings.terms} onChange={e => setSettings({...settings, terms: e.target.value})} />
          </div>

          <div style={{marginTop: '32px', borderTop: '1px solid var(--gray-100)', paddingTop: '24px', textAlign: 'right'}}>
             <button className="btn btn-primary" style={{minWidth: '160px'}} onClick={handleSaveSettings}>
                <Save size={18} /> Update Invoice Settings
             </button>
          </div>
        </div>
      ) : activeTab === 'Rescue' ? (
        <div className="glass-card p-24 animate-fade-in">
          {/* ... Task Rescue UI ... */}
          <h4 style={{marginBottom: '16px', color: 'var(--red-600)', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <PowerOff size={20} /> Orphaned Work (Disabled Owners)
          </h4>
          {orphanedWork.length === 0 ? (
            <p className="text-muted">No orphaned tasks found. All work is assigned to active members.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Item ID</th>
                    <th>Disabled Owner</th>
                    <th>Assign To New Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {orphanedWork.map((item, idx) => (
                    <tr key={idx}>
                      <td><span className={`status-badge ${item.type === 'Lead' ? 'status-new' : 'status-interested'}`}>{item.type}</span></td>
                      <td style={{fontWeight: 600}}>{item.id}</td>
                      <td style={{color: 'var(--red-500)'}}>{item.currentOwner}</td>
                      <td>
                        <select 
                          className="input-field" 
                          style={{padding: '4px 8px', height: '32px'}}
                          onChange={async (e) => {
                            const newEmail = e.target.value;
                            if (!newEmail) return;
                            if (window.confirm(`Transfer this ${item.type} to ${newEmail}?`)) {
                              const res = await request('reassignWork', { 
                                type: item.type, 
                                id: item.id, 
                                newOwnerEmail: newEmail,
                                adminEmail: user.email 
                              });
                              if (res.success) {
                                alert("Task reassigned successfully!");
                                fetchOrphanedWork();
                              }
                            }
                          }}
                        >
                          <option value="">Select New Owner...</option>
                          {team.filter(u => u[4] === 'Active' && 
                             (item.type === 'Lead' ? u[3] === 'Sales' : u[3] === 'Developer')
                           ).map(u => (
                            <option key={u[2]} value={u[2]}>{u[1]} ({u[2]})</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'Finance' ? (
        <div className="animate-fade-in">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px'}}>
            <div className="glass-card p-24" style={{borderLeft: '4px solid #10b981'}}>
              <span className="text-muted" style={{fontSize: '0.85rem', fontWeight: 600}}>REALIZED REVENUE</span>
              <h2 style={{margin: '8px 0', color: '#059669'}}>₹{financeStats?.received.toLocaleString() || 0}</h2>
              <p style={{fontSize: '0.75rem', color: 'var(--gray-400)'}}>From Delivered/Completed Projects</p>
            </div>
            <div className="glass-card p-24" style={{borderLeft: '4px solid #f59e0b'}}>
              <span className="text-muted" style={{fontSize: '0.85rem', fontWeight: 600}}>PENDING COLLECTION</span>
              <h2 style={{margin: '8px 0', color: '#d97706'}}>₹{financeStats?.pending.toLocaleString() || 0}</h2>
              <p style={{fontSize: '0.75rem', color: 'var(--gray-400)'}}>From Approved Active Leads</p>
            </div>
            <div className="glass-card p-24" style={{borderLeft: '4px solid #3b82f6'}}>
              <span className="text-muted" style={{fontSize: '0.85rem', fontWeight: 600}}>TOTAL PIPE-LINE</span>
              <h2 style={{margin: '8px 0', color: '#2563eb'}}>₹{financeStats?.potential.toLocaleString() || 0}</h2>
              <p style={{fontSize: '0.75rem', color: 'var(--gray-400)'}}>Potential from All Leads</p>
            </div>
          </div>
          
          <div className="glass-card p-24">
            <h4 style={{marginBottom: '16px'}}>Lead Conversion Overview</h4>
            <div style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)'}}>{financeStats?.leadCount || 0}</div>
                <div className="text-muted" style={{fontSize: '0.8rem'}}>Total Leads</div>
              </div>
              <div style={{width: '1px', height: '40px', background: 'var(--gray-200)'}}></div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)'}}>{financeStats?.projectCount || 0}</div>
                <div className="text-muted" style={{fontSize: '0.8rem'}}>Projects Started</div>
              </div>
              <div style={{width: '1px', height: '40px', background: 'var(--gray-200)'}}></div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: 800, color: '#10b981'}}>{financeStats?.leadCount ? Math.round((financeStats.projectCount / financeStats.leadCount) * 100) : 0}%</div>
                <div className="text-muted" style={{fontSize: '0.8rem'}}>Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'Performance' ? (
        <div className="animate-fade-in">
          <div className="section-header" style={{marginBottom: '24px'}}>
            <div>
              <h3 style={{display: 'flex', alignItems: 'center', gap: '10px'}}><TrendingUp style={{color: 'var(--brand-600)'}} /> Team Efficiency Audit</h3>
              <p className="text-muted">Real-time workload and target progress tracking</p>
            </div>
            <button className="btn btn-ghost" onClick={fetchPerformance}><RefreshCw size={16} /> Refresh Audit</button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px'}}>
             {performance.map((p, idx) => (
                <div key={idx} className="glass-card p-24" style={{borderLeft: `4px solid ${p.status === 'Active' ? 'var(--brand-500)' : 'var(--red-400)'}`}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                      <div>
                         <h4 style={{margin: '0 0 4px 0', fontSize: '1.1rem'}}>{p.name}</h4>
                         <span className="user-role-badge">{p.role}</span>
                         <small style={{display: 'block', marginTop: '4px', color: 'var(--gray-400)'}}>{p.email}</small>
                      </div>
                      <div style={{textAlign: 'right'}}>
                         <div style={{fontSize: '0.75rem', fontWeight: 700, color: p.status === 'Active' ? 'var(--emerald)' : 'var(--red-500)'}}>{p.status.toUpperCase()}</div>
                      </div>
                   </div>

                   <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                      <div style={{background: 'var(--gray-50)', padding: '12px', borderRadius: '12px', textAlign: 'center'}}>
                         <div style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-600)'}}>{p.activeTasks}</div>
                         <div style={{fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600}}>Active Tasks</div>
                      </div>
                      <div style={{background: 'var(--gray-50)', padding: '12px', borderRadius: '12px', textAlign: 'center'}}>
                         <div style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)'}}>{p.completedTasks}</div>
                         <div style={{fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600}}>LifeTime Work</div>
                      </div>
                   </div>

                   {p.todayTarget && (
                      <div style={{borderTop: '1px solid var(--gray-100)', paddingTop: '16px'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Target size={14} className="text-brand" /> Today's Performance</span>
                            <span style={{color: 'var(--brand-600)'}}>{p.todayTarget.count} / {p.todayTarget.target}</span>
                         </div>
                         <div style={{height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden'}}>
                            <div style={{
                               height: '100%', 
                               width: `${Math.min(100, (p.todayTarget.count / p.todayTarget.target) * 100)}%`, 
                               background: (p.todayTarget.count / p.todayTarget.target) >= 1 ? 'var(--emerald)' : 'var(--brand-500)',
                               borderRadius: '4px'
                            }}></div>
                         </div>
                         <p style={{fontSize: '0.7rem', marginTop: '6px', color: 'var(--gray-500)'}}>
                            Achievement: <b>{Math.round((p.todayTarget.count / p.todayTarget.target) * 100)}%</b> of daily quota
                         </p>
                      </div>
                   )}

                   {/* Delay Indicator Suggestion */}
                   {p.activeTasks > 5 && (
                      <div style={{marginTop: '12px', padding: '8px 12px', background: 'var(--amber-bg)', color: 'var(--amber)', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600}}>
                         <AlertCircle size={14} /> High workload may cause delays
                      </div>
                   )}
                </div>
             ))}
          </div>
        </div>
      ) : activeTab === 'Pipeline' ? (
        <div className="animate-fade-in">
           <div className="section-header" style={{marginBottom: '24px'}}>
              <div>
                 <h3>Global Lead Repository</h3>
                 <p className="text-muted">Tracking all opportunities across the 10-step workflow</p>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                 <button className="btn btn-ghost" onClick={async () => {
                    const res = await getRequest('format');
                    if (res.success) alert(res.message);
                 }} style={{color: 'var(--amber)'}}>
                    <Settings size={16} /> Repair & Format Sheets
                 </button>
                 <button className="btn btn-ghost" onClick={downloadReport} style={{color: 'var(--brand-600)'}}>
                    <Download size={16} /> Download Report
                 </button>
                 <button className="btn btn-ghost" onClick={fetchAllLeads}><RefreshCw size={16} /> Sync Pipeline</button>
              </div>
           </div>

           <div className="glass-card" style={{overflowX: 'auto', padding: '10px', maxWidth: '100%'}}>
              <table style={{minWidth: '920px', width: '100%', borderCollapse: 'collapse'}}>
                 <thead>
                    <tr>
                       <th style={{textAlign: 'left', fontSize: '0.7rem', width: '80px'}}>Lead ID</th>
                       <th style={{textAlign: 'left', fontSize: '0.7rem', width: '150px'}}>Client</th>
                       <th style={{textAlign: 'left', fontSize: '0.7rem', width: '180px'}}>Owners</th>
                       <th style={{textAlign: 'left', fontSize: '0.7rem'}}>Requirement</th>
                       <th style={{textAlign: 'left', fontSize: '0.7rem', width: '100px'}}>Financials</th>
                       <th style={{textAlign: 'left', fontSize: '0.7rem', width: '150px'}}>Status & Step</th>
                       <th style={{textAlign: 'left', fontSize: '0.7rem', width: '100px'}}>Created</th>
                    </tr>
                 </thead>
                 <tbody>
                    {allLeads.map((l, idx) => (
                       <tr key={idx} style={{borderBottom: '1px solid var(--gray-100)'}}>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}><span className="lead-id" style={{fontSize: '0.65rem'}}>{l[0]}</span></td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{fontWeight: 700, fontSize: '0.82rem', marginBottom: '2px'}}>{l[1]}</div>
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
                             <div style={{fontSize: '0.72rem', lineHeight: '1.4', marginBottom: '4px'}}>{l[4]}</div>
                             <div style={{fontSize: '0.6rem', display: 'inline-block', padding: '2px 6px', background: 'var(--gray-50)', borderRadius: '4px', color: 'var(--gray-500)'}}>
                                Src: {l[3]}
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{fontWeight: 800, color: l[5] === 'Unassigned' ? 'var(--gray-400)' : 'var(--emerald)', fontSize: '0.8rem'}}>
                                {l[5] === 'Unassigned' ? '₹-' : `₹${l[5]}`}
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0'}}>
                             <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                                <span className={`status-badge status-${l[10]?.toLowerCase().replace(' ', '-')}`} style={{fontSize: '0.6rem', padding: '4px 8px'}}>
                                   {l[10]}
                                </span>
                                <span style={{fontSize: '0.6rem', fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                                   {l[14] || 'Initialized'}
                                </span>
                             </div>
                          </td>
                          <td style={{verticalAlign: 'top', padding: '12px 0', fontSize: '0.7rem', color: 'var(--gray-500)'}}>
                             <div>{l[15] && !isNaN(new Date(l[15]).getTime()) ? new Date(l[15]).toLocaleDateString() : 'N/A'}</div>
                             <div style={{fontSize: '0.65rem'}}>{l[6]}</div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : (
        <div className="glass-card p-24 animate-fade-in">
          <h4 style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
             <FileText size={18} className="text-muted" /> Audit Trail (Latest 100 Actions)
          </h4>
          <div className="table-container">
            <table>
               <thead>
                 <tr>
                   <th>Timestamp</th>
                   <th>Who</th>
                   <th>Action</th>
                   <th>Reference</th>
                 </tr>
               </thead>
               <tbody>
                 {activityLogs.map((log, idx) => (
                   <tr key={idx}>
                     <td style={{fontSize: '0.75rem', color: 'var(--gray-500)', whiteSpace: 'nowrap'}}>
                       {new Date(log[3]).toLocaleString()}
                     </td>
                     <td style={{fontWeight: 600, fontSize: '0.85rem'}}>{log[0]}</td>
                     <td>
                       <span style={{
                         padding: '4px 8px', 
                         borderRadius: '6px', 
                         fontSize: '0.75rem',
                         background: log[1].includes('Error') ? '#fef2f2' : '#f0f9ff',
                         color: log[1].includes('Error') ? '#991b1b' : '#0369a1'
                       }}>
                         {log[1]}
                       </span>
                     </td>
                     <td style={{fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--gray-500)'}}>{log[2]}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-content glass-card animate-fade-in">
            <h3>Add Team Member</h3>
            <form onSubmit={handleAddUser}>
              <div className="input-group"><label>Full Name</label><input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="input-group"><label>Email Address</label><input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
              <div className="input-group">
                <label>Role</label>
                <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Admin">Admin</option>
                  <option value="Lead">Lead Generation</option>
                  <option value="Sales">Sales</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Tester">QA Tester</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-content glass-card animate-fade-in">
            <h3>Edit Team Member</h3>
            <form onSubmit={handleEditUser}>
              <div className="input-group"><label>Full Name</label><input className="input-field" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required /></div>
              <div className="input-group">
                <label>Role</label>
                <select className="input-field" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})}>
                  <option value="Admin">Admin</option>
                  <option value="Lead">Lead Generation</option>
                  <option value="Sales">Sales</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Tester">QA Tester</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
