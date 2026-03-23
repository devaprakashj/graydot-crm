import React, { useState, useEffect } from 'react';
import { request, getRequest } from '../../services/api';
import { Phone, CheckCircle, Package, AlertCircle, RefreshCw, Inbox, Clock, Receipt, X, Download } from 'lucide-react';

const SalesView: React.FC<{ user: any }> = ({ user }) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [invoiceLead, setInvoiceLead] = useState<any>(null);
  const [settings, setSettings] = useState({
    companyName: 'GrayDot',
    address: '123 Innovation Hub, Tech City, IN 600001',
    phone: '+91 98765 43210',
    email: 'sales@graydot.com',
    bankName: 'HDFC Bank',
    accNo: '1234567890',
    ifsc: 'HDFC0001234',
    terms: 'Please include invoice number in payment notes. This is a computer generated invoice.'
  });

  useEffect(() => { 
    fetchLeads(); 
    fetchSettings();
  }, []);

  const fetchLeads = async () => {
    const res = await getRequest('getLeads', { role: 'Sales', email: user.email });
    if (res.success) setLeads(res.data);
  };

  const fetchSettings = async () => {
    const res = await getRequest('getSettings');
    if (res.success && res.data) setSettings(res.data);
  };

  const updateStatus = async (leadId: string, status: string) => {
    let price = '';
    if (status === 'Interested') {
      price = window.prompt("Confirm Project Price (₹):") || '';
      if (!price) {
        alert("Price is required to send to Manager!");
        return;
      }
    }
    const res = await request('updateLeadStatus', { leadId, status, price, userEmail: user.email });
    if (res.success) fetchLeads();
  };

  const handleDeliver = async (leadId: string) => {
    if (window.confirm("Mark as Delivered and Payment Collected?")) {
      const res = await request('deliverProject', { leadId, userEmail: user.email });
      if (res.success) fetchLeads();
    }
  };

  const handleResolveInfo = async (leadId: string) => {
    if (window.confirm("Confirm you have provided the requested info to the developer?")) {
      const res = await request('resolveInfoRequest', { leadId, userEmail: user.email });
      if (res.success) fetchLeads();
    }
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New': 'var(--brand-600)',
      'Contacted': 'var(--sky)',
      'Interested': 'var(--emerald)',
      'Not Interested': 'var(--rose)',
      'No Response': 'var(--gray-500)',
      'More Info Req': 'var(--amber)',
    };
    return colors[status] || 'var(--gray-500)';
  };

  return (
    <div className="sales-view animate-fade-in">
      <div className="section-header">
        <div>
          <h3>Sales Pipeline</h3>
          <p className="text-muted">Contact leads and manage delivery</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <div className="stats-card glass-card" style={{padding: '10px 20px', minWidth: '160px'}}>
             <span className="text-muted" style={{fontSize: '0.75rem'}}>Assigned</span>
             <h4 style={{fontSize: '1.2rem', marginBottom: 0}}>{leads.length}</h4>
          </div>
        </div>
      </div>

      {leads.length > 0 ? (
        <div className="dashboard-grid">
          {leads.map((l, idx) => (
            <div 
              key={idx} 
              className="glass-card lead-card p-24 animate-fade-in" 
              style={{
                animationDelay: `${idx * 0.05}s`,
                borderTop: `3px solid ${statusColor(l[10])}`,
                background: l[10] === 'More Info Req' ? 'rgba(255, 191, 0, 0.02)' : 'white'
              }}
            >
              <div className="card-header">
                <span className="lead-id">{l[0]}</span>
                <span className={`status-badge ${l[10] === 'More Info Req' ? 'status-new' : `status-${l[10]?.toLowerCase().replace(' ', '-')}`}`}
                      style={{
                        background: l[10] === 'More Info Req' ? 'var(--amber-bg)' : undefined,
                        color: l[10] === 'More Info Req' ? 'var(--amber)' : undefined
                      }}>
                  {l[10]}
                </span>
              </div>
              
              <div style={{marginTop: '12px'}}>
                <h4 style={{fontSize: '1.1rem', marginBottom: '4px'}}>{l[1]}</h4>
                <p className="text-muted" style={{fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                  <Phone size={12} style={{marginRight: '4px'}} /> {l[2]}
                </p>

                {l[10] === 'More Info Req' && (
                  <div style={{background: 'var(--amber-bg)', color: 'var(--amber)', padding: '10px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', gap: '8px', marginBottom: '16px', border: '1px solid var(--amber-light)'}}>
                    <AlertCircle size={14} /> <strong>Developer:</strong> More info needed for development.
                  </div>
                )}

                <div className="glass-card" style={{padding: '12px', background: '#f8fafc', marginBottom: '16px', fontSize: '0.85rem'}}>
                  <strong>Requirement:</strong>
                  <p className="text-muted" style={{margin: '4px 0'}}>{l[4]}</p>
                  <p style={{marginTop: '8px', color: 'var(--brand-600)', fontWeight: 600}}>Budget: ₹{l[5]}</p>
                </div>
              </div>
              
              {/* Actions based on Step */}
              <div className="card-actions" style={{marginTop: 'auto', borderTop: '1px solid var(--gray-100)', paddingTop: '16px'}}>
                {l[10] === 'More Info Req' ? (
                  <button className="btn btn-primary w-full" style={{background: 'var(--amber)', border: 'none'}} onClick={() => handleResolveInfo(l[0])}>
                    <RefreshCw size={16} /> Mark Info Resolved
                  </button>
                ) : (l[10] === 'Interested' && l[15] === 'Pending') ? (
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', fontWeight: 600, fontSize: '0.85rem', padding: '10px', background: 'var(--amber-bg)', borderRadius: '6px', width: '100%', justifyContent: 'center'}}>
                    <Clock size={16} /> Waiting for Manager Approval
                  </div>
                ) : (l[14] === 'In Progress' || l[14] === 'In QA Testing' || l[14] === 'Awaiting Final Approval') ? (
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-600)', fontWeight: 600, fontSize: '0.85rem', padding: '10px', background: 'var(--brand-50)', borderRadius: '6px', width: '100%', justifyContent: 'center'}}>
                    <RefreshCw size={16} className="animate-spin" /> {l[14]}...
                  </div>
                ) : l[14] === 'Approved for Delivery' ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'}}>
                    <button className="btn btn-ghost w-full" style={{borderColor: 'var(--brand-200)', color: 'var(--brand-700)', background: 'var(--brand-50)'}} onClick={() => setInvoiceLead(l)}>
                      <Receipt size={16} /> Generate Invoice
                    </button>
                    <button className="btn btn-primary w-full" onClick={() => handleDeliver(l[0])}>
                      <Package size={16} /> Deliver & Collect Payment
                    </button>
                  </div>
                ) : l[14] === 'Delivered' ? (
                  <div className="text-success" style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem', width: '100%', justifyContent: 'center'}}>
                    <CheckCircle size={18} /> Delivered & Completed
                  </div>
                ) : (
                  <div style={{display: 'flex', gap: '10px', width: '100%'}}>
                    <select 
                      className="input-field" 
                      value={l[10]} 
                      disabled={l[10] === 'Interested'}
                      onChange={(e) => updateStatus(l[0], e.target.value)}
                      style={{fontSize: '0.82rem', flex: 1}}
                    >
                      <option value="New">Mark Status...</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested → Send to Mgr</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="No Response">No Response</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <div className="icon-box" style={{background: 'var(--gray-100)', color: 'var(--gray-400)', marginBottom: '16px'}}>
            <Inbox size={26} />
          </div>
          <h3>Your pipeline is empty</h3>
          <p className="text-muted">New leads will be auto-assigned soon</p>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceLead && (
        <div className="modal-overlay" style={{padding: '20px'}}>
          <div className="glass-card animate-scale-in" style={{maxWidth: '850px', width: '100%', padding: '0', position: 'relative', background: 'white', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'}}>
            <button className="icon-btn" style={{position: 'absolute', top: '24px', right: '24px', zIndex: 10, background: 'rgba(255,255,255,0.8)'}} onClick={() => setInvoiceLead(null)}>
              <X size={20} />
            </button>

            <div id="printable-invoice" style={{padding: '40px'}}>
              {/* Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--brand-500)', paddingBottom: '30px', marginBottom: '30px'}}>
                <div>
                  <h1 style={{color: 'var(--brand-600)', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '4px'}}>{settings.companyName}</h1>
                  <p style={{fontSize: '0.85rem', color: 'var(--gray-600)', maxWidth: '300px'}}>{settings.address}</p>
                  <p style={{fontSize: '0.85rem', color: 'var(--gray-600)'}}>{settings.email} | {settings.phone}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 style={{fontSize: '1.8rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '8px'}}>TAX INVOICE</h2>
                  <div style={{fontSize: '0.9rem', color: 'var(--gray-600)'}}>
                    <p><strong>Invoice No:</strong> INV-{invoiceLead[0].split('-')[1]}-{new Date().getFullYear()}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                    <p><strong>Status:</strong> DUE ON RECEIPT</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px'}}>
                <div style={{background: 'var(--gray-50)', padding: '20px', borderRadius: '12px'}}>
                  <h4 style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700}}>Billing To:</h4>
                  <h3 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', color: 'var(--gray-900)'}}>{invoiceLead[1]}</h3>
                  <p style={{fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '4px'}}><Phone size={12} style={{marginRight: '6px'}}/> {invoiceLead[2]}</p>
                  <p style={{fontSize: '0.9rem', color: 'var(--gray-600)'}}>Ref: {invoiceLead[0]}</p>
                </div>
                <div style={{padding: '20px'}}>
                  <h4 style={{fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700}}>Project Details:</h4>
                  <p style={{fontSize: '0.95rem', color: 'var(--gray-700)', marginBottom: '8px'}}><strong>Timeline:</strong> {invoiceLead[6] || 'As per agreement'}</p>
                  <p style={{fontSize: '0.95rem', color: 'var(--gray-700)'}}><strong>Service:</strong> Custom Development</p>
                </div>
              </div>

              {/* Table */}
              <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '30px'}}>
                <thead>
                  <tr style={{background: 'var(--brand-600)', color: 'white'}}>
                    <th style={{padding: '14px 20px', textAlign: 'left', borderRadius: '8px 0 0 0', fontSize: '0.85rem', fontWeight: 600}}>DESCRIPTION</th>
                    <th style={{padding: '14px 20px', textAlign: 'right', borderRadius: '0 8px 0 0', fontSize: '0.85rem', fontWeight: 600, width: '150px'}}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{borderBottom: '1px solid var(--gray-100)'}}>
                    <td style={{padding: '24px 20px'}}>
                      <div style={{fontWeight: 700, fontSize: '1rem', color: 'var(--gray-800)', marginBottom: '6px'}}>Project: {invoiceLead[0]}</div>
                      <div style={{fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: '1.5'}}>{invoiceLead[4]}</div>
                    </td>
                    <td style={{padding: '24px 20px', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: 'var(--gray-900)'}}>₹{Number(invoiceLead[5]).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals & Notes */}
              <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px'}}>
                <div>
                  <div style={{marginBottom: '20px'}}>
                    <h4 style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '8px'}}>Payment Methods:</h4>
                    <div style={{background: 'var(--gray-50)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: '1.6', border: '1px solid var(--gray-100)'}}>
                      <strong>Bank Transfer:</strong><br/>
                      Account Name: {settings.companyName} Solutions Pvt Ltd<br/>
                      Account No: {settings.accNo}<br/>
                      Bank: {settings.bankName} | IFSC: {settings.ifsc}
                    </div>
                  </div>
                  <div style={{fontSize: '0.75rem', color: 'var(--gray-400)', borderLeft: '3px solid var(--gray-200)', paddingLeft: '12px'}}>
                    <strong>Terms:</strong> {settings.terms}
                  </div>
                </div>
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0'}}>
                    <span style={{color: 'var(--gray-600)', fontSize: '0.9rem'}}>Subtotal:</span>
                    <span style={{fontWeight: 600}}>₹{Number(invoiceLead[5]).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--gray-100)'}}>
                    <span style={{color: 'var(--gray-600)', fontSize: '0.9rem'}}>GST (0%):</span>
                    <span style={{fontWeight: 600}}>₹0</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: '8px'}}>
                    <span style={{fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)'}}>GRAND TOTAL:</span>
                    <span style={{fontWeight: 900, fontSize: '1.3rem', color: 'var(--brand-600)'}}>₹{Number(invoiceLead[5]).toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{marginTop: '40px', textAlign: 'center'}}>
                    <div style={{height: '60px', borderBottom: '1px solid var(--gray-300)', marginBottom: '8px'}}></div>
                    <p style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600}}>Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (Not Printed) */}
            <div className="no-print" style={{display: 'flex', gap: '12px', padding: '24px 40px', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)'}}>
              <button 
                className="btn btn-primary" 
                style={{flex: 1}}
                onClick={() => {
                   const printContents = document.getElementById('printable-invoice')?.innerHTML;
                   const originalContents = document.body.innerHTML;
                   const printWindow = window.open('', '_blank');
                   if (printWindow) {
                     printWindow.document.write(`<html><head><title>Invoice_${invoiceLead[0]}</title><style>body { font-family: sans-serif; padding: 20px; }</style></head><body>${printContents}</body></html>`);
                     printWindow.document.close();
                     printWindow.print();
                   }
                }}
              >
                <Download size={18} /> Print / Save as PDF
              </button>
              <button className="btn btn-ghost" style={{flex: 1}} onClick={() => setInvoiceLead(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesView;
