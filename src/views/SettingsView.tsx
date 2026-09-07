import React from 'react';
import { Settings, Shield, Globe, Bell, Key, GitBranch, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Platform Settings & Governance
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Admark Digitals workspace configuration, role permissions matrix, and integrations.
        </p>
      </div>

      {/* Organization Settings */}
      <div className="admark-card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={15} color="var(--brand-crimson)" />
          <span>Organization Profile</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Company Brand Name</label>
            <input type="text" readOnly value="Admark Digitals" className="input-field" style={{ marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Default Timezone</label>
            <input type="text" readOnly value="UTC+05:30 (IST) & GMT (London)" className="input-field" style={{ marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Weekly Working Capacity</label>
            <input type="text" readOnly value="40 Hours / Developer" className="input-field" style={{ marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Client Tenant Isolation</label>
            <input type="text" readOnly value="Enabled (Multi-Tenant Secure Partition)" className="input-field" style={{ marginTop: '4px' }} />
          </div>
        </div>
      </div>

      {/* RBAC Role Permissions Matrix Preview */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--brand-crimson)" />
          <span>RBAC Matrix & Scope Guard</span>
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Role</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Projects & Financials</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Tasks & Code</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Bugs & QA</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Releases & Deploy</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Internal Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Super Admin', fin: 'Full Access', code: 'Full Access', qa: 'Full Access', rel: 'Full Access', notes: 'Visible' },
                { role: 'Project Manager', fin: 'Project Budget', code: 'Manage & Assign', qa: 'Review & Verify', rel: 'Approve Candidate', notes: 'Visible' },
                { role: 'Team Lead', fin: 'No Access', code: 'Review & Merge', qa: 'Triage & Assign', rel: 'Build & Deploy', notes: 'Visible' },
                { role: 'Developer', fin: 'No Access', code: 'Commit & Log Time', qa: 'Resolve Defect', rel: 'View Artifacts', notes: 'Visible' },
                { role: 'QA Tester', fin: 'No Access', code: 'Link Test Run', qa: 'Log & Execute', rel: 'Pass / Fail Gate', notes: 'Visible' },
                { role: 'Client Portal', fin: 'Invoices Only', code: 'Approved Only', qa: 'UAT Sign-off', rel: 'Acceptance Sign', notes: 'MASKED / HIDDEN' },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.role}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.fin}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.code}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.qa}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.rel}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className={`badge ${row.notes === 'Visible' ? 'badge-healthy' : 'badge-critical'}`}>
                      {row.notes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Connections */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch size={18} color="var(--brand-crimson)" />
          <span>Connected Ecosystem Integrations</span>
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'GitHub Enterprise', desc: 'Sync PR status, commits, and automated branch linking', connected: true },
            { name: 'Figma Cloud', desc: 'Embed live design tokens and interactive prototypes', connected: true },
            { name: 'Stripe Webhooks', desc: 'Real-time billing, deposit holding, and currency FX sync', connected: true },
            { name: 'SendGrid & WhatsApp', desc: 'Client automated milestone alerts and itinerary dispatches', connected: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between" style={{ padding: '0.85rem', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <span className="badge badge-healthy">Connected</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
