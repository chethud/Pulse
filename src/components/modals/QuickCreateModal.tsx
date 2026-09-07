import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Bug as BugIcon,
  FolderKanban,
  Building2,
  GitPullRequest,
  Clock,
  Sparkles,
  GitBranch,
  Globe,
  Database,
  Server,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskPriority, BugSeverity } from '../../types';

type CreateTab = 'task' | 'bug' | 'project' | 'client' | 'cr' | 'time';

export const QuickCreateModal: React.FC = () => {
  const {
    quickCreateOpen,
    setQuickCreateOpen,
    projects,
    clients,
    users,
    modules,
    tasks,
    addTask,
    addBug,
    addProject,
    addClient,
    addChangeRequest,
    logTime,
    currentUser,
    logout,
  } = useApp();

  const isCEO = currentUser.title === 'CEO' || currentUser.name.toLowerCase().includes('jois');

  const [activeTab, setActiveTab] = useState<CreateTab>('task');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProjId, setTaskProjId] = useState(projects[0]?.id || '');
  const [taskModuleId, setTaskModuleId] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('High');
  const [taskAssignee, setTaskAssignee] = useState(users.find((u) => u.role === 'DEVELOPER')?.id || users[0].id);
  const [taskEstHours, setTaskEstHours] = useState('16');
  const [taskDueDate, setTaskDueDate] = useState('2025-03-15');
  const [taskDesc, setTaskDesc] = useState('');

  // Bug form state
  const [bugTitle, setBugTitle] = useState('');
  const [bugProjId, setBugProjId] = useState(projects[0]?.id || '');
  const [bugSeverity, setBugSeverity] = useState<BugSeverity>('Major');
  const [bugPriority, setBugPriority] = useState<TaskPriority>('High');
  const [bugEnv, setBugEnv] = useState<'Development' | 'Staging' | 'Production'>('Staging');
  const [bugAssignee, setBugAssignee] = useState(users.find((u) => u.role === 'DEVELOPER')?.id || users[0].id);
  const [bugSteps, setBugSteps] = useState('');
  const [bugExpected, setBugExpected] = useState('');
  const [bugActual, setBugActual] = useState('');

  // Project form state
  const [projName, setProjName] = useState('');
  const [projCode, setProjCode] = useState('');
  const [projClientId, setProjClientId] = useState(clients[0]?.id || '');
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

  // Time log form state
  const [timeProjId, setTimeProjId] = useState(projects[0]?.id || '');
  const [timeTaskId, setTimeTaskId] = useState('');
  const [timeHours, setTimeHours] = useState('4.0');
  const [timeDesc, setTimeDesc] = useState('');
  const [timeBillable, setTimeBillable] = useState(true);

  if (!quickCreateOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskProjId) return;

    addTask({
      title: taskTitle.trim(),
      description: taskDesc || 'Task created via Quick Create.',
      projectId: taskProjId,
      moduleId: taskModuleId || undefined,
      assigneeId: taskAssignee,
      reporterId: currentUser.id,
      priority: taskPriority,
      status: 'Ready',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: taskDueDate,
      estimatedHours: Number(taskEstHours) || 8,
      loggedHours: 0,
      tags: ['Feature', 'Sprint'],
      subtasks: [
        { id: `sub-${Date.now()}-1`, title: 'Initial setup & architecture', completed: false, assigneeId: taskAssignee },
        { id: `sub-${Date.now()}-2`, title: 'Implementation & unit testing', completed: false, assigneeId: taskAssignee },
      ],
      isClientVisible: true,
    });

    setTaskTitle('');
    setTaskDesc('');
    setQuickCreateOpen(false);
  };

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle.trim() || !bugProjId) return;

    addBug({
      title: bugTitle.trim(),
      description: bugActual || 'Bug reported via Quick Create',
      projectId: bugProjId,
      environment: bugEnv,
      severity: bugSeverity,
      priority: bugPriority,
      reporterId: currentUser.id,
      assigneeId: bugAssignee,
      stepsToReproduce: bugSteps ? bugSteps.split('\n').filter(Boolean) : ['Open application', 'Perform action', 'Observe failure'],
      expectedResult: bugExpected || 'Operation should succeed smoothly.',
      actualResult: bugActual || 'Encountered unexpected error / failure.',
      status: 'New',
    });

    setBugTitle('');
    setBugSteps('');
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
      projectManagerId: currentUser.id,
      teamMemberIds: [currentUser.id, users[2]?.id, users[3]?.id].filter(Boolean),
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

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeProjId || !timeHours) return;

    logTime({
      userId: currentUser.id,
      projectId: timeProjId,
      taskId: timeTaskId || undefined,
      date: new Date().toISOString().split('T')[0],
      hours: Number(timeHours) || 1,
      description: timeDesc || 'Work completed on project deliverables.',
      isBillable: timeBillable,
    });

    setTimeDesc('');
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
                Instantly spawn tasks, bugs, projects, or log time
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
            { id: 'task', label: 'Task', icon: <CheckSquare size={14} /> },
            { id: 'bug', label: 'Bug / Issue', icon: <BugIcon size={14} /> },
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
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Task Title *
                </label>
                <input
                  required
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Webhook Dispatch for Order Confirmation"
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
                    value={taskProjId}
                    onChange={(e) => setTaskProjId(e.target.value)}
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
                    Module (Optional)
                  </label>
                  <select
                    value={taskModuleId}
                    onChange={(e) => setTaskModuleId(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="">General Project Task</option>
                    {modules
                      .filter((m) => m.projectId === taskProjId)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Assignee
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
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
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    value={taskEstHours}
                    onChange={(e) => setTaskEstHours(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Task Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Provide technical context, acceptance criteria, or API links..."
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          )}

          {activeTab === 'bug' && (
            <form onSubmit={handleCreateBug} className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Bug Title *
                </label>
                <input
                  required
                  type="text"
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                  placeholder="e.g. 500 error when clicking checkout with EUR currency"
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Project *
                  </label>
                  <select
                    value={bugProjId}
                    onChange={(e) => setBugProjId(e.target.value)}
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
                    Severity *
                  </label>
                  <select
                    value={bugSeverity}
                    onChange={(e) => setBugSeverity(e.target.value as BugSeverity)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                    <option value="Trivial">Trivial</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Environment
                  </label>
                  <select
                    value={bugEnv}
                    onChange={(e) => setBugEnv(e.target.value as 'Development' | 'Staging' | 'Production')}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="Development">Development</option>
                    <option value="Staging">Staging</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Steps to Reproduce (one per line)
                </label>
                <textarea
                  rows={3}
                  value={bugSteps}
                  onChange={(e) => setBugSteps(e.target.value)}
                  placeholder="1. Go to cart&#10;2. Select EUR currency&#10;3. Click Pay with Card"
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Expected Result
                  </label>
                  <input
                    type="text"
                    value={bugExpected}
                    onChange={(e) => setBugExpected(e.target.value)}
                    placeholder="Grand total matches itemized subtotal"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Actual Result
                  </label>
                  <input
                    type="text"
                    value={bugActual}
                    onChange={(e) => setBugActual(e.target.value)}
                    placeholder="Discrepancy of 1.25 EUR appears"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--status-danger)' }}>
                  File Bug
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

          {activeTab === 'time' && (
            <form onSubmit={handleLogTime} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Project *
                  </label>
                  <select
                    value={timeProjId}
                    onChange={(e) => setTimeProjId(e.target.value)}
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
                    Associated Task (Optional)
                  </label>
                  <select
                    value={timeTaskId}
                    onChange={(e) => setTimeTaskId(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="">General Project Work</option>
                    {tasks
                      .filter((t) => t.projectId === timeProjId)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          #{t.taskNumber} {t.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Hours Spent *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={timeHours}
                    onChange={(e) => setTimeHours(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div className="flex items-center gap-2" style={{ paddingTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="billable"
                    checked={timeBillable}
                    onChange={(e) => setTimeBillable(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--brand-crimson)' }}
                  />
                  <label htmlFor="billable" style={{ fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                    Billable to Client
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Work Summary / Activities Done
                </label>
                <textarea
                  rows={3}
                  value={timeDesc}
                  onChange={(e) => setTimeDesc(e.target.value)}
                  placeholder="Completed code review, merged PR #45, verified in staging..."
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Log Hours
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
