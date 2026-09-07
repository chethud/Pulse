import React, { useState } from 'react';
import {
  X,
  FolderTree,
  FolderKanban,
  Building2,
  GitPullRequest,
  Clock,
  Sparkles,
  GitBranch,
  Globe,
  Database,
  Server,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskPriority } from '../../types';

type CreateTab = 'module' | 'project';

export const QuickCreateModal: React.FC = () => {
  const {
    quickCreateOpen,
    setQuickCreateOpen,
    projects,
    clients,
    users,
    modules,
    addModule,
    addProject,
    currentUser,
    logout,
  } = useApp();

  const isCEO = currentUser.title === 'CEO' || currentUser.name.toLowerCase().includes('jois');

  const [activeTab, setActiveTab] = useState<CreateTab>('module');

  // Module form state
  const [moduleName, setModuleName] = useState('');
  const [moduleProjId, setModuleProjId] = useState(projects[0]?.id || '');
  const [moduleDesc, setModuleDesc] = useState('');
  const [moduleLeadId, setModuleLeadId] = useState(users.find((u) => u.role === 'DEVELOPER')?.id || users[0]?.id || '');
  const [moduleProgress, setModuleProgress] = useState('0');
  const [moduleTargetDate, setModuleTargetDate] = useState('2026-11-30');

  // Project form state
  const [projName, setProjName] = useState('');
  const [projCode, setProjCode] = useState('');
  const [projClientId, setProjClientId] = useState(clients[0]?.id || '');
  const [projLeadDevId, setProjLeadDevId] = useState(users.find((u) => u.department === 'Engineering')?.id || users[0]?.id || '');
  const [projBudget, setProjBudget] = useState('120000');
  const [projPriority, setProjPriority] = useState<TaskPriority>('High');
  const [projDeadline, setProjDeadline] = useState('2025-10-31');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('React, Node.js, PostgreSQL');
  const [projLiveUrl, setProjLiveUrl] = useState('');
  const [projGitAccount, setProjGitAccount] = useState('');
  const [projVercelAccount, setProjVercelAccount] = useState('');
  const [projBackendProvider, setProjBackendProvider] = useState<'Supabase' | 'AWS' | 'Firebase' | 'Neon' | 'Self-Hosted' | 'Other' | 'None'>('Supabase');
  const [projBackendAccount, setProjBackendAccount] = useState('');

  if (!quickCreateOpen) return null;

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleName.trim() || !moduleProjId) return;

    addModule({
      projectId: moduleProjId,
      name: moduleName.trim(),
      description: moduleDesc.trim() || 'Core delivery module.',
      leadId: moduleLeadId,
      progress: Math.min(100, Math.max(0, Number(moduleProgress) || 0)),
      order: modules.filter((m) => m.projectId === moduleProjId).length + 1,
      targetDate: moduleTargetDate || undefined,
    });

    setModuleName('');
    setModuleDesc('');
    setModuleProgress('0');
    setQuickCreateOpen(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCEO) return;
    if (!projName.trim() || !projClientId) return;

    const code = projCode.trim() || projName.trim().slice(0, 3).toUpperCase() + '-APP';
    addProject({
      name: projName.trim(),
      code,
      clientId: projClientId,
      description: projDesc || 'Client software delivery project.',
      projectManagerId: projLeadDevId || currentUser.id,
      teamMemberIds: [projLeadDevId, users[2]?.id, users[3]?.id].filter(Boolean),
      startDate: new Date().toISOString().split('T')[0],
      deadline: projDeadline,
      priority: projPriority,
      status: 'Active',
      budget: {
        total: Number(projBudget) || 100000,
        spent: 0,
        currency: 'USD',
      },
      techStack: projTech.split(',').map((t) => t.trim()),
      liveUrl: projLiveUrl.trim() || undefined,
      productionUrl: projLiveUrl.trim() || undefined,
      gitAccount: projGitAccount.trim() || undefined,
      vercelAccount: projVercelAccount.trim() || undefined,
      backendProvider: projBackendProvider,
      backendAccount: projBackendAccount.trim() || undefined,
    });

    setProjName('');
    setProjLiveUrl('');
    setProjGitAccount('');
    setProjVercelAccount('');
    setProjBackendAccount('');
    setQuickCreateOpen(false);
  };



  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setQuickCreateOpen(false)}>
      <div
        className="admark-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          borderRadius: '0.75rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-sidebar)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--brand-crimson)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} />
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Quick Create</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Create project modules or client projects
              </div>
            </div>
          </div>
          <button onClick={() => setQuickCreateOpen(false)} className="btn btn-ghost btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Tab selector */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'module', label: 'Module', icon: <FolderTree size={14} /> },
            { id: 'project', label: 'Project', icon: <FolderKanban size={14} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as CreateTab)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0.625rem 0.75rem',
                border: 'none',
                background: activeTab === t.id ? 'var(--bg-card)' : 'transparent',
                color: activeTab === t.id ? 'var(--brand-crimson)' : 'var(--text-secondary)',
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                borderBottom: activeTab === t.id ? '2px solid var(--brand-crimson)' : '2px solid transparent',
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Form body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'module' && (
            <form onSubmit={handleCreateModule} className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Module Name *
                </label>
                <input
                  required
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="e.g. Authentication & RBAC Engine"
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Project *
                  </label>
                  <select
                    value={moduleProjId}
                    onChange={(e) => setModuleProjId(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Lead Developer
                  </label>
                  <select
                    value={moduleLeadId}
                    onChange={(e) => setModuleLeadId(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    {users
                      .filter((u) => u.role !== 'CLIENT')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Initial Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={moduleProgress}
                    onChange={(e) => setModuleProgress(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={moduleTargetDate}
                    onChange={(e) => setModuleTargetDate(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Module Scope & Description
                </label>
                <textarea
                  rows={3}
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  placeholder="Describe technical deliverable, integrations, and milestones..."
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Module
                </button>
              </div>
            </form>
          )}



          {activeTab === 'project' && (
            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              {!isCEO ? (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--status-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span>Only CEO (T Jois) is authorized to create client projects.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateOpen(false);
                      logout();
                    }}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.72rem', height: '26px', padding: '0 8px', whiteSpace: 'nowrap' }}
                  >
                    Sign Out to Switch
                  </button>
                </div>
              ) : (
                <div style={{ padding: '0.5rem 0.85rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--status-healthy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✓ Authenticated as <strong>CEO (T Jois)</strong>. Project creation authorized.</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Project Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. AI Logistics Dispatch Engine"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Project Code (e.g. LOG-DIS)
                  </label>
                  <input
                    type="text"
                    value={projCode}
                    onChange={(e) => setProjCode(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Client *
                  </label>
                  <select
                    value={projClientId}
                    onChange={(e) => setProjClientId(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.industry})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={projDeadline}
                    onChange={(e) => setProjDeadline(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Code2 size={12} style={{ color: 'var(--brand-crimson)' }} />
                  <span>Assigned Developer (Engineering) *</span>
                </label>
                <select
                  value={projLeadDevId}
                  onChange={(e) => setProjLeadDevId(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px', fontWeight: 600 }}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.title} ({u.department})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Primary engineer assigned for development and delivery.
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  placeholder="React, Next.js, Node.js"
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Live Hosted Project URL (Preview Link)
                </label>
                <input
                  type="url"
                  value={projLiveUrl}
                  onChange={(e) => setProjLiveUrl(e.target.value)}
                  placeholder="https://your-project.admarkdigitals.com"
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GitBranch size={12} style={{ color: 'var(--brand-crimson)' }} />
                    <span>Git Account / Org</span>
                  </label>
                  <input
                    type="text"
                    value={projGitAccount}
                    onChange={(e) => setProjGitAccount(e.target.value)}
                    placeholder="github.com/chethud"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={12} style={{ color: '#38bdf8' }} />
                    <span>Vercel User / Team</span>
                  </label>
                  <input
                    type="text"
                    value={projVercelAccount}
                    onChange={(e) => setProjVercelAccount(e.target.value)}
                    placeholder="chethan-team"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Database size={12} style={{ color: '#34d399' }} />
                    <span>Backend Platform</span>
                  </label>
                  <select
                    value={projBackendProvider}
                    onChange={(e) => setProjBackendProvider(e.target.value as any)}
                    className="input-field"
                    style={{ marginTop: '4px', fontWeight: 600 }}
                  >
                    <option value="Supabase">Supabase</option>
                    <option value="AWS">AWS</option>
                    <option value="Firebase">Firebase</option>
                    <option value="Neon">Neon Postgres</option>
                    <option value="Self-Hosted">Self-Hosted / VPS</option>
                    <option value="Other">Other</option>
                    <option value="None">None (Static)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Server size={12} style={{ color: '#fbbf24' }} />
                    <span>Cloud / DB Identifier</span>
                  </label>
                  <input
                    type="text"
                    value={projBackendAccount}
                    onChange={(e) => setProjBackendAccount(e.target.value)}
                    placeholder="Supabase org or AWS account"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Goals, target deliverables, architecture overview..."
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isCEO}
                  className="btn btn-primary"
                  style={{ opacity: !isCEO ? 0.5 : 1, cursor: !isCEO ? 'not-allowed' : 'pointer' }}
                  title={!isCEO ? 'Only CEO T Jois can launch projects' : undefined}
                >
                  Launch Project
                </button>
              </div>
            </form>
          )}


        </div>
      </div>
    </div>
  );
};
