import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Users, Briefcase, LayoutDashboard, 
  LogOut, Package, Activity,
  TrendingUp, Clock, Target,
  Heart, Phone, FileCheck, CheckCircle,
  AlertCircle, ShieldCheck, XCircle, Bell, RefreshCw, Search,
  Bot, Send, Sparkles
} from 'lucide-react';
import type { User } from '../App';
import { getRequest } from '../services/api';
import AdminView from './views/AdminView';
import LeadGenerationView from './views/LeadGenerationView';
import SalesView from './views/SalesView';
import ManagerView from './views/ManagerView';
import DeveloperView from './views/DeveloperView';
import TestingView from './views/TestingView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    const [lRes, pRes] = await Promise.all([
      getRequest('getLeads', { role: user.role, email: user.email }),
      getRequest('getProjects', { role: user.role, email: user.email })
    ]);
    
    let pending = [];
    if (lRes.success) {
      if (user.role === 'Sales') pending = lRes.data.filter((l:any) => l[10] === 'New');
      if (user.role === 'Manager') pending = lRes.data.filter((l:any) => l[11] === 'Pending');
      if (user.role === 'Admin') pending = lRes.data.filter((l:any) => l[11] === 'Pending');
    }
    if (pRes.success) {
      if (user.role === 'Developer') pending = [...pending, ...pRes.data.filter((p:any) => p[3] === 'In Progress')];
      if (user.role === 'Tester') pending = [...pending, ...pRes.data.filter((p:any) => p[3] === 'Completed')];
    }
    setNotifications(pending);
  };

  // Get base path based on role (e.g. /admin, /sales)
  const getBasePath = (role: string) => {
    switch (role) {
      case 'Admin': return '/admin';
      case 'Lead': return '/lead';
      case 'Sales': return '/sales';
      case 'Manager': return '/manager';
      case 'Developer': return '/developer';
      case 'Tester': return '/testing';
      default: return '/dashboard';
    }
  };

  const basePath = getBasePath(user.role);

  const getPageTitle = (pathname: string): string => {
    const segment = pathname.split('/').filter(Boolean).pop() || '';
    if (segment === user.role?.toLowerCase() || !segment) return 'Overview';
    const titles: Record<string, string> = {
      users: 'Team Members',
      leads: 'Lead Pipeline',
      projects: 'Projects',
      logs: 'Activity Logs',
    };
    return titles[segment] || 'Overview';
  };

  const getNavItems = (role: string) => {
    const currentBase = getBasePath(role);
    const items = [
      { path: currentBase, label: 'Overview', icon: LayoutDashboard, roles: ['Admin', 'Lead', 'Sales', 'Manager', 'Developer', 'Tester'] },
      { path: `${currentBase}/users`, label: 'Team', icon: Users, roles: ['Admin'] },
      { path: `${currentBase}/leads`, label: 'Leads', icon: Briefcase, roles: ['Admin', 'Lead', 'Sales', 'Manager'] },
      { path: `${currentBase}/projects`, label: 'Projects', icon: Package, roles: ['Admin', 'Manager', 'Developer', 'Tester'] },
      { path: `${currentBase}/logs`, label: 'Activity', icon: Activity, roles: ['Admin'] },
    ];
    return items.filter(item => item.roles.includes(role));
  };

  const isOverview = location.pathname === basePath || location.pathname === `${basePath}/`;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-video-container">
            <video src="/logo.mp4" autoPlay loop muted playsInline />
          </div>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">{user.name[0].toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role-badge">{user.role}</span>
          </div>
        </div>


        <nav className="sidebar-nav">
          {getNavItems(user.role).map((item) => (
            <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <item.icon size={19} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-ghost w-full logout-btn" onClick={() => { onLogout(); navigate('/login'); }}>
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="page-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
             <h2>{isOverview ? `Good morning, ${user.name.split(' ')[0]}` : getPageTitle(location.pathname)}</h2>
             <button className="btn btn-ghost" style={{padding: '8px'}} onClick={() => { setIsRefreshing(true); fetchNotifications().then(() => setIsRefreshing(false)); }}>
                <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
             </button>
          </div>

          <div style={{flex: 1, maxWidth: '400px', position: 'relative', margin: '0 40px'}}>
             <Search size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)'}} />
             <input className="input-field" placeholder="Search everywhere..." style={{paddingLeft: '38px', background: 'rgba(255,255,255,0.5)', height: '40px'}} />
          </div>
          
          <div className="header-actions">
            {/* Notifications */}
            <div style={{position: 'relative'}}>
              <button 
                className={`btn btn-ghost ${notifications.length > 0 ? 'text-brand' : ''}`}
                style={{padding: '8px', color: 'var(--gray-600)'}}
                onClick={() => setShowNotif(!showNotif)}
              >
                <Bell size={20} />
                {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
              </button>
              
              {showNotif && (
                <div className="notification-dropdown glass-card animate-scale-up">
                  <h4 style={{padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', fontSize: '0.85rem'}}>
                    {notifications.length > 0 ? `${notifications.length} Pending Actions` : 'No New Notifications'}
                  </h4>
                  <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {notifications.map((n:any, i) => (
                      <div key={i} className="notification-item" onClick={() => { setShowNotif(false); navigate(`${basePath}/${n[3] === 'In Progress' || n[3] === 'Completed' ? 'projects' : 'leads'}`); }}>
                        <div className="notif-dot"></div>
                        <div>
                          <p style={{fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px'}}>{n[0]}: Attention Required</p>
                          <small className="text-muted">Status: {n[10] || n[3]}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="status-label">
              <span className="indicator active"></span>
              Live Tracking
            </div>
            
            <div className="user-profile-header">
               <div className="user-avatar-small">{user.name[0]}</div>
            </div>
          </div>
        </header>

        <div className="content-area animate-fade-in" key={location.pathname}>
          <Routes>
            <Route index element={<UnifiedDashboard user={user} />} />
            <Route path="users" element={user.role === 'Admin' ? <AdminView user={user} /> : <Navigate to={basePath} />} />
            <Route path="leads" element={<LeadsRoute user={user} />} />
            <Route path="projects" element={<ProjectsRoute user={user} />} />
            <Route path="logs" element={user.role === 'Admin' ? <LogsView /> : <Navigate to={basePath} />} />
            <Route path="*" element={<Navigate to={basePath} />} />
          </Routes>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="mobile-bottom-nav">
          {getNavItems(user.role).map((item) => (
            <Link key={item.path} to={item.path} className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </main>

      {/* AI ASSISTANT CHATBOT */}
      <AIAssistant user={user} />

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        {getNavItems(user.role).map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
        <button className="mobile-nav-item" onClick={() => { onLogout(); navigate('/login'); }} style={{background: 'none', border: 'none', padding: 0}}>
          <LogOut size={20} />
          <span>Exit</span>
        </button>
      </nav>
    </div>
  );
};

// Route helpers (using updated logic)
const LeadsRoute = ({ user }: { user: User }) => {
  if (user.role === 'Lead') return <LeadGenerationView user={user} />;
  if (user.role === 'Sales') return <SalesView user={user} />;
  if (user.role === 'Manager' || user.role === 'Admin') return <ManagerView user={user} />;
  return <div>Access Denied</div>;
};

const ProjectsRoute = ({ user }: { user: User }) => {
  if (user.role === 'Developer') return <DeveloperView user={user} />;
  if (user.role === 'Tester') return <TestingView user={user} />;
  if (user.role === 'Manager' || user.role === 'Admin') return <TestingView user={user} />;
  return <div>Access Denied</div>;
};

const UnifiedDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [data, setData] = useState<{ leads: any[], projects: any[] }>({ leads: [], projects: [] });
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [lRes, pRes, tRes] = await Promise.all([
        getRequest('getLeads', { role: user.role, email: user.email }),
        getRequest('getProjects', { role: user.role, email: user.email }),
        user.role === 'Lead' ? getRequest('getDailyTracker', { email: user.email }) : Promise.resolve({ success: false })
      ]);
      setData({ 
        leads: lRes.success ? lRes.data : [], 
        projects: pRes.success ? pRes.data : [] 
      });
      if (tRes.success) setTracker(tRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getStats = () => {
    const { leads, projects } = data;
    switch (user.role) {
      case 'Lead':
        return [
          { label: 'My Created Leads', value: leads.length, icon: Briefcase, color: 'var(--brand-600)', bg: 'var(--brand-50)' },
          { label: 'Assigned to Sales', value: leads.filter(l => l[9] !== 'Unassigned').length, icon: TrendingUp, color: 'var(--emerald)', bg: 'var(--emerald-bg)' },
          { label: 'In Progress', value: leads.filter(l => l[14] === 'In Progress').length, icon: Activity, color: 'var(--amber)', bg: 'var(--amber-bg)' },
          { label: 'Delivered', value: leads.filter(l => l[14] === 'Delivered').length, icon: Package, color: 'var(--violet)', bg: 'var(--violet-bg)' }
        ];
      case 'Sales':
        return [
          { label: 'My Assigned Leads', value: leads.length, icon: Briefcase, color: 'var(--brand-600)', bg: 'var(--brand-50)' },
          { label: 'Interested Leads', value: leads.filter(l => l[10] === 'Interested').length, icon: Heart, color: 'var(--emerald)', bg: 'var(--emerald-bg)' },
          { label: 'Contacted', value: leads.filter(l => l[10] === 'Contacted').length, icon: Phone, color: 'var(--sky)', bg: 'var(--sky-50)' },
          { label: 'Total Earnings', value: `₹${leads.filter(l => l[14] === 'Delivered').reduce((acc, curr) => acc + (Number(curr[5]) || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'var(--violet)', bg: 'var(--violet-bg)' }
        ];
      case 'Manager':
      case 'Admin':
        return [
          { label: 'Pending Approvals', value: leads.filter(l => l[11] === 'Pending').length, icon: Target, color: 'var(--amber)', bg: 'var(--amber-bg)' },
          { label: 'Project Pipeline', value: projects.length, icon: Package, color: 'var(--brand-600)', bg: 'var(--brand-50)' },
          { label: 'Ready for Delivery', value: leads.filter(l => l[14] === 'Approved for Delivery').length, icon: FileCheck, color: 'var(--emerald)', bg: 'var(--emerald-bg)' },
          { label: 'Total Volume', value: leads.length, icon: Activity, color: 'var(--violet)', bg: 'var(--violet-bg)' }
        ];
      case 'Developer':
        return [
          { label: 'My Active Tasks', value: projects.filter(p => p[3] === 'In Progress').length, icon: Package, color: 'var(--brand-600)', bg: 'var(--brand-50)' },
          { label: 'Completed', value: projects.filter(p => p[3] === 'Completed').length, icon: CheckCircle, color: 'var(--emerald)', bg: 'var(--emerald-bg)' },
          { label: 'QA Revisions', value: projects.filter(p => p[5] === 'Fail').length, icon: AlertCircle, color: 'var(--rose)', bg: 'var(--rose-bg)' },
          { label: 'Upcoming', value: projects.length, icon: Clock, color: 'var(--sky)', bg: 'var(--sky-50)' }
        ];
      case 'Tester':
        return [
          { label: 'Waiting for QA', value: projects.length, icon: ShieldCheck, color: 'var(--brand-600)', bg: 'var(--brand-50)' },
          { label: 'Total Verified', value: projects.filter(p => p[3] === 'Verified').length, icon: CheckCircle, color: 'var(--emerald)', bg: 'var(--emerald-bg)' },
          { label: 'QA Failed', value: projects.filter(p => p[5] === 'Fail').length, icon: XCircle, color: 'var(--rose)', bg: 'var(--rose-bg)' },
          { label: 'Total Projects', value: projects.length, icon: Activity, color: 'var(--violet)', bg: 'var(--violet-bg)' }
        ];
      default:
        return [];
    }
  };

  if (loading) return <div className="p-40 text-center text-muted">Loading your overview...</div>;

  const cards = getStats();

  return (
    <div>
      {user.role === 'Lead' && tracker && (
        <div className="glass-card p-24 mb-24 animate-fade-in" style={{borderLeft: '4px solid var(--brand-500)'}}>
           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px'}}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: 0}}>
                 <Target size={18} className="text-brand" /> Today's Lead Target
              </h4>
              <span style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-600)'}}>{tracker.count} / {tracker.target}</span>
           </div>
           <div style={{height: '10px', background: 'var(--gray-100)', borderRadius: '10px', overflow: 'hidden'}}>
              <div style={{
                height: '100%', 
                width: `${tracker.progress}%`, 
                background: 'linear-gradient(90deg, var(--brand-400), var(--brand-600))',
                borderRadius: '10px',
                transition: 'width 1s ease-out'
              }}></div>
           </div>
           <p className="text-muted" style={{fontSize: '0.75rem', marginTop: '10px'}}>
              You need {tracker.target - tracker.count} more leads today to hit your daily goal. Keep pushing! 🚀
           </p>
        </div>
      )}

      <div className="dashboard-grid">
        {cards.map((card, i) => (
          <div key={i} className="stats-card glass-card animate-fade-in" style={{animationDelay: `${i*0.05}s`}}>
            <div><h3>{card.label}</h3><p>{card.value}</p></div>
            <div className="icon-box" style={{background: card.bg, color: card.color}}><card.icon size={22} /></div>
          </div>
        ))}
      </div>
      <div className="glass-card p-24" style={{borderLeft: '3px solid var(--brand-500)'}}>
        <h4 style={{marginBottom: '6px', fontSize: '0.9rem'}}>Department Focus</h4>
        <p className="text-muted" style={{fontSize: '0.85rem', lineHeight: '1.6'}}>
          {user.role === 'Admin' && 'Monitor team performance across all departments. Use the sidebar to navigate between Team, Leads, and Projects.'}
          {user.role === 'Lead' && 'Focus on generating quality leads today. Each lead is auto-assigned to a sales team member via round-robin.'}
          {user.role === 'Sales' && 'Check your assigned leads and update their status. Interested leads automatically move to the manager approval queue.'}
          {user.role === 'Manager' && 'Review the approval queue for interested leads. Assign developers and set deadlines to keep projects on track.'}
          {user.role === 'Developer' && 'Complete your assigned projects and mark them done. They will automatically move to the QA testing phase.'}
          {user.role === 'Tester' && 'Review completed projects from developers. Run QA checks and mark them as Pass or Fail.'}
        </p>
      </div>
    </div>
  );
};

const LogsView = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    getRequest('getActivityLogs').then(res => { if (res.success) setLogs(res.data); });
  }, []);
  return (
    <div className="glass-card" style={{overflow: 'hidden'}}>
      <div style={{padding: '20px 24px', borderBottom: '1px solid var(--gray-100)'}}>
        <h3 style={{fontSize: '1rem'}}>System Activity</h3>
        <p className="text-muted" style={{fontSize: '0.82rem'}}>Audit trail for all workflow stages</p>
      </div>
      <div className="table-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
        <table>
          <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Reference ID</th></tr></thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td style={{fontSize: '0.75rem', color: 'var(--gray-500)'}}>{new Date(log[0]).toLocaleString()}</td>
                <td style={{fontWeight: 600, fontSize: '0.82rem'}}>{log[2]}</td>
                <td><span className="source-tag" style={{background: 'var(--brand-50)', color: 'var(--brand-700)'}}>{log[1]}</span></td>
                <td><span className="lead-id">{log[3] || '—'}</span></td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={4} style={{textAlign: 'center', padding: '40px'}}>No records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AIAssistant: React.FC<{ user: User }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { text: `Hello ${user.name}! I am your GrayDot Assistant. How can I help you today?`, isBot: true }
  ]);
  const [input, setInput] = useState('');

  const botResponses: Record<string, string> = {
    'role': `As a **${user.role}**, your role is: ` + (
      user.role === 'Lead' ? "To generate high-quality leads and add them to the system. Focus on accuracy!" :
      user.role === 'Sales' ? "To contact leads, explain our services, and mark them as Interested or Rejected." :
      user.role === 'Manager' ? "To approve leads, assign developers, and set final project deadlines." :
      user.role === 'Developer' ? "To work on assigned projects and mark them as done once complete." :
      user.role === 'Tester' ? "To review developer work and mark it as Pass (Verified) or Fail (Revision Needed)." :
      "To manage users, settings, and monitor system-wide activity."
    ),
    'how to': "Use the sidebar to navigate. The 'Overview' shows your stats, while 'Leads/Projects' is where you do your work.",
    'target': user.role === 'Lead' ? "Your daily target is tracked on your Overview page. Aim for 10 leads daily!" : "Targets are currently focused on the Lead Generation team.",
    'help': "You can ask me about your 'role', 'how to' use the system, or just say 'hello'!"
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { text: input, isBot: false };
    setMessages([...messages, userMsg]);
    
    // Simple logic for bot
    setTimeout(() => {
      const lower = input.toLowerCase();
      let response = "I'm sorry, I'm still learning. Try asking about your 'role' or 'help'.";
      
      for (const key in botResponses) {
        if (lower.includes(key)) {
          response = botResponses[key];
          break;
        }
      }
      
      if (lower.includes('hello') || lower.includes('hi')) response = `Hi! Ready to boost GrayDot as a ${user.role} today? 🚀`;

      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 600);
    setInput('');
  };

  return (
    <>
      <button 
        className="ai-fab animate-fade-in" 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '80px', right: '24px', 
          width: '56px', height: '56px', borderRadius: '28px',
          background: 'var(--brand-600)', color: 'white', border: 'none',
          boxShadow: 'var(--shadow-lg)', cursor: 'pointer', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? <XCircle size={24} /> : <Sparkles size={24} />}
      </button>

      {isOpen && (
        <div className="ai-chat-window glass-card animate-scale-up" style={{
          position: 'fixed', bottom: '150px', right: '24px',
          width: '320px', height: '400px', zIndex: 2000, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{padding: '16px', background: 'var(--brand-600)', color: 'white', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Bot size={20} />
            <span style={{fontWeight: 700, fontSize: '0.9rem'}}>GrayDot Assistant AI</span>
          </div>
          
          <div style={{flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.isBot ? 'flex-start' : 'flex-end',
                background: m.isBot ? 'var(--gray-50)' : 'var(--brand-50)',
                color: m.isBot ? 'var(--gray-800)' : 'var(--brand-800)',
                padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem',
                maxWidth: '85%', border: m.isBot ? '1px solid var(--gray-100)' : '1px solid var(--brand-100)'
              }}>
                {m.text}
              </div>
            ))}
          </div>

          <div style={{padding: '12px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: '8px'}}>
            <input 
              className="input-field" 
              placeholder="Ask me anything..." 
              style={{height: '36px', fontSize: '0.8rem'}}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button className="btn btn-primary" style={{padding: '8px', minWidth: '40px'}} onClick={handleSend}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
