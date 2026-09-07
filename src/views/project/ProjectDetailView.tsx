import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  CheckSquare,
  FolderTree,
  FileText,
  Flag,
  Zap,
  Bug as BugIcon,
  TestTube2,
  GitPullRequest,
  Rocket,
  Clock,
  Users2,
  Calendar,
  AlertTriangle,
  Play,
  CheckCircle2,
  Plus,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Upload,
  Download,
  GitBranch,
  X,
  Trash2,
  ShieldAlert,
  Settings as SettingsIcon,
  Globe,
  Link2,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskStatus, TaskPriority, ChangeRequestStatus } from '../../types';

interface ProjectDetailViewProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ currentTab, setCurrentTab }) => {
  const {
    selectedProjectId,
    projects,
    clients,
    users,
    modules,
    requirements,
    tasks,
    bugs,
    milestones,
    sprints,
    changeRequests,
    releases,
    testRuns,
    testCases,
    clientUAT,
    documents,
    timeLogs,
    activities,
    setSelectedTaskId,
    setSelectedBugId,
    updateTaskStatus,
    setQuickCreateOpen,
    approveMilestone,
    approveRelease,
    updateUATStatus,
    addUATItem,
    updateCRStatus,
    activeRole,
    currentUser,
    startTimer,
    updateProject,
    deleteProject,
    addModule,
    updateModule,
    deleteModule,
    canDelete,
    isSuperAdmin,
    logout,
    setCurrentView,
    setSelectedProjectId,
  } = useApp();

  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [showCeoRequiredModal, setShowCeoRequiredModal] = useState(false);

  // Add Module modal state (CEO Only)
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [newModuleLeadId, setNewModuleLeadId] = useState(users[0]?.id || '');
  const [newModuleTargetDate, setNewModuleTargetDate] = useState('2025-10-31');
  const [newModuleStatus, setNewModuleStatus] = useState<'Planned' | 'In Progress' | 'Completed' | 'Delayed'>('In Progress');
  const [newModuleDeliverables, setNewModuleDeliverables] = useState('');

  const [taskViewMode, setTaskViewMode] = useState<'board' | 'list' | 'gantt' | 'calendar'>('board');
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('All');
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<string>('All');
  const [taskScopeFilter, setTaskScopeFilter] = useState<'all' | 'remaining' | 'blockers'>(
    currentTab === 'what-left' ? 'remaining' : currentTab === 'blockers' ? 'blockers' : 'all'
  );
  const [qualitySubTab, setQualitySubTab] = useState<'bugs' | 'test-runs' | 'test-cases'>(
    currentTab === 'testing' ? 'test-runs' : 'bugs'
  );
  const [clientSubTab, setClientSubTab] = useState<'uat' | 'cr'>('uat');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewDesc, setNewReviewDesc] = useState('');
  const [newReviewFeedback, setNewReviewFeedback] = useState('');
  const [newReviewStatus, setNewReviewStatus] = useState<'Passed' | 'Needs Change' | 'Pending'>('Pending');

  useEffect(() => {
    if (currentTab === 'what-left') setTaskScopeFilter('remaining');
    else if (currentTab === 'blockers') setTaskScopeFilter('blockers');
    else if (currentTab === 'testing') setQualitySubTab('test-runs');
    else if (currentTab === 'bugs') setQualitySubTab('bugs');
    else if (currentTab === 'cr') setClientSubTab('cr');
    else if (currentTab === 'uat') setClientSubTab('uat');
  }, [currentTab]);

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const client = clients.find((c) => c.id === project.clientId);
  const pm = users.find((u) => u.id === project.projectManagerId);

  // Project settings form state
  const [settingsLiveUrl, setSettingsLiveUrl] = useState(project.liveUrl || project.productionUrl || project.stagingUrl || '');
  const [settingsStagingUrl, setSettingsStagingUrl] = useState(project.stagingUrl || '');
  const [settingsRepoUrl, setSettingsRepoUrl] = useState(project.repositoryUrl || '');
  const [settingsName, setSettingsName] = useState(project.name);
  const [settingsCode, setSettingsCode] = useState(project.code);
  const [settingsDesc, setSettingsDesc] = useState(project.description);
  const [settingsStatus, setSettingsStatus] = useState(project.status);
  const [settingsPriority, setSettingsPriority] = useState(project.priority);
  const [settingsDeadline, setSettingsDeadline] = useState(project.deadline);
  const [settingsTech, setSettingsTech] = useState(project.techStack?.join(', ') || '');
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  useEffect(() => {
    setSettingsLiveUrl(project.liveUrl || project.productionUrl || project.stagingUrl || '');
    setSettingsStagingUrl(project.stagingUrl || '');
    setSettingsRepoUrl(project.repositoryUrl || '');
    setSettingsName(project.name);
    setSettingsCode(project.code);
    setSettingsDesc(project.description);
    setSettingsStatus(project.status);
    setSettingsPriority(project.priority);
    setSettingsDeadline(project.deadline);
    setSettingsTech(project.techStack?.join(', ') || '');
  }, [project.id]);

  const handleSaveProjectSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, {
      name: settingsName.trim(),
      code: settingsCode.trim(),
      description: settingsDesc.trim(),
      liveUrl: settingsLiveUrl.trim(),
      stagingUrl: settingsStagingUrl.trim(),
      productionUrl: settingsLiveUrl.trim(),
      repositoryUrl: settingsRepoUrl.trim(),
      status: settingsStatus,
      priority: settingsPriority,
      deadline: settingsDeadline,
      techStack: settingsTech.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3500);
  };

  // Project-scoped data
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectBugs = bugs.filter((b) => b.projectId === project.id);
  const projectModules = modules.filter((m) => m.projectId === project.id);
  const projectReqs = requirements.filter((r) => r.projectId === project.id);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectSprints = sprints.filter((s) => s.projectId === project.id);
  const projectCRs = changeRequests.filter((c) => c.projectId === project.id);
  const projectReleases = releases.filter((r) => r.projectId === project.id);
  const projectTestRuns = testRuns.filter((tr) => tr.projectId === project.id);
  const projectTestCases = testCases.filter((tc) => tc.projectId === project.id);
  const projectUAT = clientUAT.filter((u) => u.projectId === project.id);
  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectTime = timeLogs.filter((tl) => tl.projectId === project.id);
  const projectActs = activities.filter((a) => a.projectId === project.id);

  // Dynamic Progress Calculation from actual work (Completed / Total)
  const completedTasksCount = projectTasks.filter((t) => t.status === 'Done').length;
  const totalTasksCount = projectTasks.length || 1;
  const calculatedProgress = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Remaining work items
  const remainingTasks = projectTasks.filter((t) => t.status !== 'Done');
  const openBugsCount = projectBugs.filter((b) => b.status !== 'Closed' && b.status !== 'Verified').length;
  const pendingQACount = projectTasks.filter((t) => t.status === 'QA').length;
  const pendingClientReviewCount = projectTasks.filter((t) => t.status === 'Client Review').length;

  // Blockers
  const blockedTasks = projectTasks.filter((t) => t.status === 'Blocked' || (t.blockedByTaskIds && t.blockedByTaskIds.length > 0));

  // Filtered tasks for task tab
  const filteredTasks = projectTasks.filter((t) => {
    if (taskScopeFilter === 'remaining' && t.status === 'Done') return false;
    if (taskScopeFilter === 'blockers' && t.status !== 'Blocked' && (!t.blockedByTaskIds || t.blockedByTaskIds.length === 0)) return false;
    if (taskFilterStatus !== 'All' && t.status !== taskFilterStatus) return false;
    if (taskFilterAssignee !== 'All' && t.assigneeId !== taskFilterAssignee) return false;
    return true;
  });

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'Backlog', label: 'Backlog', color: 'var(--text-muted)' },
    { id: 'Ready', label: 'Ready', color: '#3b82f6' },
    { id: 'In Progress', label: 'In Progress', color: 'var(--brand-crimson)' },
    { id: 'Code Review', label: 'Code Review', color: '#8b5cf6' },
    { id: 'QA', label: 'QA Testing', color: '#f59e0b' },
    { id: 'Client Review', label: 'Client Review', color: '#ec4899' },
    { id: 'Done', label: 'Done', color: '#10b981' },
  ];

  const isTasksActive = currentTab === 'tasks' || currentTab === 'board' || currentTab === 'what-left' || currentTab === 'blockers';
  const isQualityActive = currentTab === 'quality' || currentTab === 'bugs' || currentTab === 'testing';
  const isClientReviewActive = currentTab === 'client-review' || currentTab === 'uat' || currentTab === 'cr';

  const isTabActive = (tabId: string) => {
    if (tabId === 'tasks') return isTasksActive;
    if (tabId === 'quality') return isQualityActive;
    if (tabId === 'client-review') return isClientReviewActive;
    return currentTab === tabId;
  };

  // Deduplicated and non-redundant tabs
  const navTabs: { id: string; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks', count: projectTasks.length },
    { id: 'modules', label: 'Modules', count: projectModules.length },
    { id: 'quality', label: 'Quality & QA', count: openBugsCount + projectTestRuns.length },
    { id: 'client-review', label: 'Client Review', count: projectUAT.length },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* 17. Project Page Header */}
      <div
        style={{
          padding: '1.25rem 2rem 0.75rem 2rem',
          backgroundColor: 'var(--bg-topbar)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  padding: '1px 5px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '3px',
                }}
              >
                {project.code}
              </span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {project.name}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{client?.name || 'Alliance Travel'}</span>
              <span>•</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{project.progress}% Complete</span>
              <span>•</span>
              <span className="status-indicator">
                <span
                  className={`status-dot ${
                    project.health.overall === 'Healthy'
                      ? 'healthy'
                      : project.health.overall === 'At Risk'
                      ? 'warning'
                      : 'danger'
                  }`}
                />
                <span>{project.health.overall}</span>
              </span>
              <span>•</span>
              <span>PM: <strong style={{ color: 'var(--text-secondary)' }}>{pm?.name || 'Alex Morgan'}</strong></span>
              <span>•</span>
              <span>Due: {project.deadline}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add Task</span>
            </button>
            <button
              onClick={() => {
                const url = project.liveUrl || project.productionUrl || project.stagingUrl;
                if (url) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                  setCurrentTab('settings');
                }
              }}
              className="btn btn-secondary btn-sm"
              title={
                project.liveUrl || project.productionUrl || project.stagingUrl
                  ? `Open live hosted project: ${project.liveUrl || project.productionUrl || project.stagingUrl}`
                  : 'Configure Live URL in Settings'
              }
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <ExternalLink size={13} />
              <span>Preview Live Site</span>
            </button>
            {canDelete && (
              <button
                onClick={() => setShowDeleteProjectModal(true)}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--status-danger)' }}
                title="Delete Project"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Horizontal Tabs System */}
        <div className="tab-bar-container" style={{ margin: '0 -0.5rem -1px -0.5rem' }}>
          {navTabs.map((tab) => {
            const active = isTabActive(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'tasks') {
                    setTaskScopeFilter('all');
                    setCurrentTab('tasks');
                  } else if (tab.id === 'quality') {
                    setCurrentTab('quality');
                  } else if (tab.id === 'client-review') {
                    setCurrentTab('client-review');
                  } else {
                    setCurrentTab(tab.id);
                  }
                }}
                className={`tab-button ${active ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="tab-badge">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {/* ================= TAB 1: OVERVIEW ================= */}
        {currentTab === 'overview' && (
          <div className="flex flex-col gap-5">
            {/* 18. Compact Summary Strip */}
            <div className="kpi-strip">
              <div className="kpi-strip-item">
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Overall Progress
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {project.progress}%
                </div>
              </div>

              <div className="kpi-strip-item">
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tasks Completed
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {completedTasksCount} / {projectTasks.length}
                </div>
              </div>

              <div className="kpi-strip-item">
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Open Bugs
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: openBugsCount > 0 ? 'var(--status-danger)' : 'var(--text-primary)', marginTop: '2px' }}>
                  {openBugsCount}
                </div>
              </div>

              <div className="kpi-strip-item">
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Blocked
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: blockedTasks.length > 0 ? 'var(--status-warning)' : 'var(--text-primary)', marginTop: '2px' }}>
                  {blockedTasks.length}
                </div>
              </div>

              <div className="kpi-strip-item">
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  In QA
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {pendingQACount}
                </div>
              </div>

              <div className="kpi-strip-item">
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Client Review
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {pendingClientReviewCount}
                </div>
              </div>
            </div>

            {/* 2-Column: Project Module Progress & Activity Timeline */}
            <div className="grid grid-cols-12 gap-5 items-start">
              {/* Left 7 cols: Module Progress */}
              <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
                  Project Progress by Module
                </div>

                <div className="admark-card" style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {projectModules.map((mod) => {
                      const modTasks = projectTasks.filter((t) => t.moduleId === mod.id);
                      const modCompleted = modTasks.filter((t) => t.status === 'Done').length;
                      const modProgress = modTasks.length > 0 ? Math.round((modCompleted / modTasks.length) * 100) : mod.progress;

                      return (
                        <div key={mod.id}>
                          <div className="flex items-center justify-between" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mod.name}</span>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{modProgress}%</span>
                          </div>
                          <div className="progress-bar-track" style={{ height: '4px' }}>
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${modProgress}%`,
                                backgroundColor: modProgress === 100 ? 'var(--status-healthy)' : 'var(--text-secondary)',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 5 cols: 19. Project Activity Timeline */}
              <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
                  Project Activity
                </div>

                <div className="admark-card" style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {projectActs.slice(0, 5).map((act) => {
                      const actor = users.find((u) => u.id === act.userId);
                      return (
                        <div key={act.id} className="flex items-start gap-2.5" style={{ fontSize: '0.78rem' }}>
                          <span className="status-dot neutral" style={{ marginTop: '5px' }} />
                          <div style={{ lineHeight: 1.35, flex: 1 }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {actor?.name || 'Team member'}
                            </span>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>{act.action}</span>{' '}
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{act.targetTitle}</span>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {act.timestamp}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: TASKS & BOARD ================= */}
        {isTasksActive && (
          <div className="flex flex-col gap-3">
            {/* View Switcher & Filters */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1" style={{ background: 'var(--bg-elevated)', padding: '3px', borderRadius: '0.5rem' }}>
                  <button
                    onClick={() => setTaskViewMode('board')}
                    className={`btn btn-sm ${taskViewMode === 'board' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Kanban Board
                  </button>
                  <button
                    onClick={() => setTaskViewMode('list')}
                    className={`btn btn-sm ${taskViewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setTaskViewMode('gantt')}
                    className={`btn btn-sm ${taskViewMode === 'gantt' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Gantt / Timeline
                  </button>
                  <button
                    onClick={() => setTaskViewMode('calendar')}
                    className={`btn btn-sm ${taskViewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    Calendar
                  </button>
                </div>

                <div className="flex items-center gap-1" style={{ background: 'var(--bg-elevated)', padding: '3px', borderRadius: '0.5rem' }}>
                  <button
                    onClick={() => setTaskScopeFilter('all')}
                    className={`btn btn-sm ${taskScopeFilter === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  >
                    All ({projectTasks.length})
                  </button>
                  <button
                    onClick={() => setTaskScopeFilter('remaining')}
                    className={`btn btn-sm ${taskScopeFilter === 'remaining' ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  >
                    What's Left? ({remainingTasks.length})
                  </button>
                  <button
                    onClick={() => setTaskScopeFilter('blockers')}
                    className={`btn btn-sm ${taskScopeFilter === 'blockers' ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', color: blockedTasks.length > 0 ? 'var(--status-danger)' : undefined }}
                  >
                    Blockers ({blockedTasks.length})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={taskFilterAssignee}
                  onChange={(e) => setTaskFilterAssignee(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                >
                  <option value="All">All Assignees</option>
                  {users.filter((u) => u.role !== 'CLIENT').map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={14} />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Kanban Board Mode with Drag & Drop */}
            {taskViewMode === 'board' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(230px, 1fr))',
                  gap: '0.75rem',
                  overflowX: 'auto',
                  paddingBottom: '1rem',
                }}
              >
                {kanbanColumns.map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col.id);

                  return (
                    <div
                      key={col.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData('text/plain');
                        if (taskId) {
                          updateTaskStatus(taskId, col.id);
                        }
                      }}
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '520px',
                      }}
                    >
                      {/* Column Header */}
                      <div
                        style={{
                          padding: '0.65rem 0.75rem',
                          borderBottom: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: col.color }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {col.label}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                          }}
                        >
                          {colTasks.length}
                        </span>
                      </div>

                      {/* Column Tasks */}
                      <div style={{ flex: 1, padding: '0.45rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflowY: 'auto' }}>
                        {colTasks.map((t) => {
                          const assignee = users.find((u) => u.id === t.assigneeId);
                          const formattedDue = t.dueDate.replace('2025-', '').replace('-', '/');

                          return (
                            <div
                              key={t.id}
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                              onClick={() => setSelectedTaskId(t.id)}
                              className="admark-card-interactive"
                              style={{
                                padding: '0.6rem 0.65rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                cursor: 'grab',
                              }}
                            >
                              <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                  #{t.taskNumber}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    color: t.priority === 'Urgent' ? 'var(--status-danger)' : t.priority === 'High' ? 'var(--status-warning)' : 'var(--text-muted)',
                                  }}
                                >
                                  {t.priority}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '6px' }}>
                                {t.title}
                              </div>

                              {/* Footer: Assignee Avatar & Due Date */}
                              <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                                <div className="flex items-center gap-1.5">
                                  <img
                                    src={assignee?.avatar}
                                    alt={assignee?.name}
                                    style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                    {assignee?.name.split(' ')[0]}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                  {formattedDue}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View Mode */}
            {taskViewMode === 'list' && (
              <div className="admark-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Task Title</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Assignee</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Subtasks</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Time</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => {
                      const assignee = users.find((u) => u.id === t.assigneeId);
                      const completedSub = t.subtasks.filter((s) => s.completed).length;

                      return (
                        <tr
                          key={t.id}
                          onClick={() => setSelectedTaskId(t.id)}
                          style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                          className="admark-card-interactive"
                        >
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-crimson)' }}>
                            #{t.taskNumber}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.title}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>{assignee?.name}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span className="badge badge-neutral">{t.priority}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span className={`badge ${t.status === 'Done' ? 'badge-healthy' : 'badge-neutral'}`}>{t.status}</span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                            {completedSub}/{t.subtasks.length}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>{t.loggedHours} / {t.estimatedHours}h</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{t.dueDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Gantt / Timeline View */}
            {taskViewMode === 'gantt' && (
              <div className="admark-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Timeline & Task Dependency Flow
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {filteredTasks.map((t, idx) => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem' }}>
                      <div style={{ width: '220px', flexShrink: 0 }} className="truncate">
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-crimson)', fontWeight: 700 }}>
                          #{t.taskNumber}{' '}
                        </span>
                        <span>{t.title}</span>
                      </div>

                      <div style={{ flex: 1, position: 'relative', height: '24px', background: 'var(--bg-elevated)', borderRadius: '4px' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: `${(idx * 15) % 65}%`,
                            width: `${Math.max(25, (t.estimatedHours / 48) * 60)}%`,
                            height: '100%',
                            backgroundColor: t.status === 'Done' ? 'var(--status-healthy)' : t.status === 'In Progress' ? 'var(--brand-crimson)' : 'var(--status-info)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 8px',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {t.status} ({t.estimatedHours}h)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {taskViewMode === 'calendar' && (
              <div className="admark-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  March 2025 Delivery Calendar
                </h3>
                <div className="grid grid-cols-7 gap-2" style={{ textAlign: 'center', fontSize: '0.75rem' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <div key={d} style={{ fontWeight: 700, color: 'var(--text-muted)', padding: '0.5rem' }}>
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => {
                    const day = i + 1;
                    const dayTasks = filteredTasks.filter((t) => t.dueDate.endsWith(`-${day < 10 ? '0' + day : day}`));
                    return (
                      <div
                        key={day}
                        style={{
                          minHeight: '70px',
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '4px',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{day}</div>
                        {dayTasks.map((dt) => (
                          <div
                            key={dt.id}
                            onClick={() => setSelectedTaskId(dt.id)}
                            className="truncate"
                            style={{
                              fontSize: '0.65rem',
                              padding: '2px 4px',
                              borderRadius: '2px',
                              background: 'var(--bg-card-hover)',
                              color: 'var(--brand-crimson)',
                              fontWeight: 600,
                              marginTop: '2px',
                              cursor: 'pointer',
                            }}
                          >
                            #{dt.taskNumber} {dt.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: MODULES & FEATURES ================= */}
        {currentTab === 'modules' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Functional Modules & Deliverables</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Architecture modules, technical ownership, key deliverables, and execution progress
                </div>
              </div>

              <button
                onClick={() => {
                  if (isSuperAdmin) {
                    setShowAddModuleModal(true);
                  } else {
                    setShowCeoRequiredModal(true);
                  }
                }}
                className="btn btn-primary btn-sm"
                title={isSuperAdmin ? 'Add New Module' : 'Only CEO (Super Admin) is authorized to add modules'}
              >
                <Plus size={14} />
                <span>Add Module</span>
                {!isSuperAdmin && <span style={{ fontSize: '0.65rem', opacity: 0.8, marginLeft: '2px' }}>(CEO only)</span>}
              </button>
            </div>

            {projectModules.length === 0 ? (
              <div
                className="admark-card flex flex-col items-center justify-center text-center"
                style={{ padding: '3.5rem 1.5rem', borderRadius: '0.75rem', border: '1px dashed var(--border-subtle)' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-crimson)',
                    marginBottom: '1rem',
                  }}
                >
                  <FolderTree size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  No Modules Configured Yet
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '440px', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  Functional modules break this project into distinct feature areas, technical ownership, milestones, and deliverable packages.
                </p>
                <button
                  onClick={() => {
                    if (isSuperAdmin) {
                      setShowAddModuleModal(true);
                    } else {
                      setShowCeoRequiredModal(true);
                    }
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '1.25rem' }}
                >
                  <Plus size={14} />
                  <span>Add First Module</span>
                  {!isSuperAdmin && <span style={{ fontSize: '0.65rem', opacity: 0.8, marginLeft: '2px' }}>(CEO only)</span>}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {projectModules.map((mod) => {
                  const lead = users.find((u) => u.id === mod.leadId);
                  const modTasks = projectTasks.filter((t) => t.moduleId === mod.id);
                  const modCompleted = modTasks.filter((t) => t.status === 'Done').length;
                  const calculatedModProgress = modTasks.length > 0 ? Math.round((modCompleted / modTasks.length) * 100) : mod.progress;

                  const statusBadgeClass =
                    mod.status === 'Completed' || calculatedModProgress === 100
                      ? 'badge-healthy'
                      : mod.status === 'Delayed'
                      ? 'badge-critical'
                      : mod.status === 'Planned'
                      ? 'badge-neutral'
                      : 'badge-info';

                  return (
                    <div key={mod.id} className="admark-card" style={{ padding: '1.25rem' }}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{mod.name}</h3>
                          {mod.status && (
                            <span className={`badge ${statusBadgeClass}`}>
                              {mod.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`badge ${calculatedModProgress === 100 ? 'badge-healthy' : 'badge-neutral'}`}>
                            {calculatedModProgress}% Done
                          </span>
                          {canDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete module "${mod.name}"? This action cannot be undone.`)) {
                                  deleteModule(mod.id);
                                }
                              }}
                              className="btn btn-secondary btn-sm text-critical"
                              title="Delete Module"
                              style={{ padding: '0.2rem 0.4rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                            >
                              <Trash2 size={13} style={{ color: 'var(--status-critical)' }} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                        {mod.description}
                      </p>

                      <div className="progress-bar-track" style={{ margin: '0.75rem 0 0.5rem 0' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${calculatedModProgress}%`,
                            backgroundColor: calculatedModProgress === 100 ? 'var(--status-healthy)' : 'var(--brand-crimson)',
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                        <span>
                          Lead: <strong style={{ color: 'var(--text-secondary)' }}>{lead?.name || 'Assigned Lead'}</strong>
                        </span>
                        {mod.targetDate && (
                          <span>
                            Target: <strong style={{ color: 'var(--text-primary)' }}>{mod.targetDate}</strong>
                          </span>
                        )}
                        <span>Tasks: {modTasks.length} ({modCompleted} done)</span>
                      </div>

                      {/* Deliverables checklist if defined */}
                      {mod.deliverables && mod.deliverables.length > 0 && (
                        <div style={{ marginTop: '0.5rem', background: 'var(--bg-app)', padding: '0.65rem 0.75rem', borderRadius: '0.4rem', border: '1px solid var(--border-subtle)', marginBottom: '0.65rem' }}>
                          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            Deliverables Checklist
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {mod.deliverables.map((del, idx) => (
                              <span key={idx} className="badge badge-neutral" style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}>
                                ✓ {del}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Linked tasks preview */}
                      {modTasks.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {modTasks.slice(0, 3).map((mt) => (
                            <div
                              key={mt.id}
                              onClick={() => setSelectedTaskId(mt.id)}
                              className="admark-card-interactive flex items-center justify-between"
                              style={{ padding: '0.35rem 0.6rem', borderRadius: '4px', background: 'var(--bg-app)', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              <span className="truncate">#{mt.taskNumber} {mt.title}</span>
                              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{mt.status}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CEO Quick Actions */}
                      {isCEO && (
                        <div className="flex items-center justify-end gap-2" style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                          {calculatedModProgress < 100 && (
                            <button
                              onClick={() => {
                                updateModule(mod.id, {
                                  progress: 100,
                                  status: 'Completed',
                                });
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                            >
                              <CheckCircle2 size={12} />
                              <span>Mark Complete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: REQUIREMENTS ================= */}
        {currentTab === 'requirements' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Requirements Management</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Business specifications requested by client and validated with acceptance criteria
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projectReqs.map((req) => (
                <div key={req.id} className="admark-card" style={{ padding: '1.25rem' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-crimson)' }}>
                        {req.code}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{req.title}</h3>
                    </div>
                    <span className={`badge ${req.status === 'Approved' ? 'badge-healthy' : 'badge-at-risk'}`}>
                      {req.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    {req.description}
                  </p>

                  <div style={{ marginTop: '0.75rem', background: 'var(--bg-app)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Acceptance Criteria
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {req.acceptanceCriteria.map((ac, idx) => (
                        <li key={idx} style={{ marginBottom: '2px' }}>{ac}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between" style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Source: {req.source} ({req.requestedBy})</span>
                    <span>Priority: <strong>{req.priority}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SPRINTS ================= */}
        {currentTab === 'sprints' && (
          <div className="flex flex-col gap-4">
            {projectSprints.map((sp) => (
              <div key={sp.id} className="admark-card" style={{ padding: '1.25rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{sp.name}</h2>
                      <span className="badge badge-healthy">{sp.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Goal: {sp.goal}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-crimson)' }}>
                      {sp.completedStoryPoints} / {sp.totalStoryPoints} pts
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Velocity: 28 pts / sprint</div>
                  </div>
                </div>

                <div className="progress-bar-track" style={{ margin: '0.75rem 0' }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.round((sp.completedStoryPoints / sp.totalStoryPoints) * 100)}%`, backgroundColor: 'var(--brand-crimson)' }} />
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '1rem', marginBottom: '0.5rem' }}>
                  Sprint Task Backlog
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {projectTasks.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="admark-card-interactive flex items-center justify-between"
                      style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-app)', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-crimson)', fontSize: '0.75rem' }}>
                          #{t.taskNumber}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{t.title}</span>
                      </div>
                      <span className={`badge ${t.status === 'Done' ? 'badge-healthy' : 'badge-neutral'}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= QUALITY & QA (BUGS & TESTING) ================= */}
        {isQualityActive && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-1" style={{ background: 'var(--bg-elevated)', padding: '3px', borderRadius: '0.5rem' }}>
                <button
                  onClick={() => setQualitySubTab('bugs')}
                  className={`btn btn-sm ${qualitySubTab === 'bugs' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <BugIcon size={14} />
                  <span>Bugs & Defects ({projectBugs.length})</span>
                </button>
                <button
                  onClick={() => setQualitySubTab('test-runs')}
                  className={`btn btn-sm ${qualitySubTab === 'test-runs' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <TestTube2 size={14} />
                  <span>Test Runs ({projectTestRuns.length})</span>
                </button>
                <button
                  onClick={() => setQualitySubTab('test-cases')}
                  className={`btn btn-sm ${qualitySubTab === 'test-cases' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <CheckSquare size={14} />
                  <span>Test Cases ({projectTestCases.length})</span>
                </button>
              </div>

              {qualitySubTab === 'bugs' && (
                <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm" style={{ background: 'var(--status-danger)' }}>
                  <Plus size={14} />
                  <span>Report Bug</span>
                </button>
              )}
            </div>

            {/* Sub-view: Bugs */}
            {qualitySubTab === 'bugs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {projectBugs.map((bug) => {
                  const assignee = users.find((u) => u.id === bug.assigneeId);

                  return (
                    <div
                      key={bug.id}
                      onClick={() => setSelectedBugId(bug.id)}
                      className="admark-card-interactive"
                      style={{ padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--status-danger)', fontSize: '0.85rem' }}>
                            #{bug.bugNumber}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{bug.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${bug.severity === 'Critical' ? 'badge-critical' : 'badge-at-risk'}`}>
                            {bug.severity}
                          </span>
                          <span className="badge badge-info">{bug.environment}</span>
                          <span className={`badge ${bug.status === 'Fixed' || bug.status === 'Verified' ? 'badge-healthy' : 'badge-neutral'}`}>
                            {bug.status}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                        {bug.description}
                      </p>

                      <div className="flex items-center justify-between" style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>Assignee: <strong>{assignee?.name}</strong></span>
                        <span>Device: {bug.browser || 'Chrome/Safari'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sub-view: Test Runs */}
            {qualitySubTab === 'test-runs' && (
              <div className="grid grid-cols-2 gap-4">
                {projectTestRuns.map((tr) => {
                  const passRate = Math.round((tr.passed / tr.totalTests) * 100);

                  return (
                    <div key={tr.id} className="admark-card" style={{ padding: '1.25rem' }}>
                      <div className="flex items-center justify-between">
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{tr.name}</h3>
                        <span className="badge badge-healthy">{tr.status}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Executed by {tr.executedBy} on {tr.executedAt}
                      </div>

                      <div className="flex items-center justify-between" style={{ margin: '0.75rem 0 0.25rem 0' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--status-healthy)' }}>
                          {passRate}% Passing
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {tr.passed} Pass / {tr.failed} Fail / {tr.blocked} Blocked
                        </span>
                      </div>

                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${passRate}%`, backgroundColor: 'var(--status-healthy)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sub-view: Test Cases */}
            {qualitySubTab === 'test-cases' && (
              <div className="admark-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>
                  Test Cases Repository
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.65rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Test Case Title</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Priority</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Result</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Last Run</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectTestCases.map((tc) => (
                      <tr key={tc.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-crimson)' }}>
                          {tc.code}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{tc.title}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span className="badge badge-neutral">{tc.priority}</span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span className={`badge ${tc.status === 'Pass' ? 'badge-healthy' : 'badge-critical'}`}>
                            {tc.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{tc.lastRunDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= CLIENT REVIEW ================= */}
        {isClientReviewActive && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Client Review & UAT Sign-off
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Deliverable acceptance, feedback notes, and sign-off status ({projectUAT.length} items)
                </div>
              </div>

              <button
                onClick={() => setShowAddReviewModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} />
                <span>Add Client Review</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projectUAT.length === 0 ? (
                <div className="admark-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No client reviews yet. Click "Add Client Review" above to add one.
                </div>
              ) : (
                projectUAT.map((uat) => (
                  <div key={uat.id} className="admark-card" style={{ padding: '1.25rem' }}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{uat.featureTitle}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${uat.status === 'Passed' ? 'badge-healthy' : uat.status === 'Needs Change' ? 'badge-critical' : 'badge-neutral'}`}>
                          {uat.status}
                        </span>
                        <button onClick={() => updateUATStatus(uat.id, 'Passed')} className="btn btn-sm btn-secondary">
                          Pass
                        </button>
                        <button onClick={() => updateUATStatus(uat.id, 'Needs Change')} className="btn btn-sm btn-danger">
                          Request Change
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      {uat.description}
                    </p>

                    {uat.clientFeedback && (
                      <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '4px', background: 'var(--status-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.8rem', color: 'var(--status-warning)' }}>
                        <strong>Client Feedback:</strong> {uat.clientFeedback}
                      </div>
                    )}

                    {uat.reviewedBy && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Reviewed by: {uat.reviewedBy} {uat.clientReviewedAt && `• ${uat.clientReviewedAt}`}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}


        {/* ================= TAB 13: TIME & TEAM ================= */}
        {currentTab === 'time' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Time Logs & Capacity Tracking</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Billable client hours, employee timesheets, and capacity distribution
                </div>
              </div>
            </div>

            <div className="admark-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 1rem' }}>Member</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Hours</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Work Description</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTime.map((tl) => {
                    const u = users.find((usr) => usr.id === tl.userId);
                    return (
                      <tr key={tl.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{u?.name}</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{tl.date}</td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--status-healthy)' }}>
                          {tl.hours}h
                        </td>
                        <td style={{ padding: '0.65rem 1rem' }}>{tl.description}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span className={`badge ${tl.isBillable ? 'badge-healthy' : 'badge-neutral'}`}>
                            {tl.isBillable ? 'Billable' : 'Internal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 14: ACTIVITY TIMELINE ================= */}
        {currentTab === 'activity' && (
          <div className="flex flex-col gap-3">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Project Audit & Activity Log</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projectActs.map((act) => {
                const u = users.find((usr) => usr.id === act.userId);
                return (
                  <div key={act.id} className="admark-card flex items-start gap-3" style={{ padding: '0.875rem' }}>
                    <img src={u?.avatar} alt={u?.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, fontSize: '0.8125rem' }}>
                      <div>
                        <strong>{u?.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>{act.action}</span>{' '}
                        <strong style={{ color: 'var(--brand-crimson)' }}>{act.targetTitle}</strong>
                      </div>
                      {act.details && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {act.details}
                        </div>
                      )}
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {act.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* ================= TAB 15: WHAT IS LEFT? (REMAINING WORK) ================= */}
        {currentTab === 'what-left' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Project Completion Checklist — What Is Left?</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Clear, quantifiable inventory of all unfinished tasks, unresolved bugs, QA items, and client approvals
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-at-risk" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                  {calculatedProgress}% Complete
                </span>
              </div>
            </div>

            {/* Metric Cards: Remaining Breakdown */}
            <div className="grid grid-cols-4 gap-3">
              <div className="admark-card" style={{ padding: '1rem', borderLeft: '4px solid var(--brand-crimson)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Remaining Tasks
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-crimson)', marginTop: '4px' }}>
                  {remainingTasks.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Out of {totalTasksCount} total tasks
                </div>
              </div>

              <div className="admark-card" style={{ padding: '1rem', borderLeft: '4px solid var(--status-danger)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Open Bugs
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-danger)', marginTop: '4px' }}>
                  {openBugsCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Requiring verification
                </div>
              </div>

              <div className="admark-card" style={{ padding: '1rem', borderLeft: '4px solid var(--status-warning)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Pending QA Testing
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                  {pendingQACount}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Tasks in QA queue
                </div>
              </div>

              <div className="admark-card" style={{ padding: '1rem', borderLeft: '4px solid #ec4899' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Pending Client Reviews
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ec4899', marginTop: '4px' }}>
                  {pendingClientReviewCount + projectUAT.filter((u) => u.status !== 'Passed').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Awaiting client sign-off
                </div>
              </div>
            </div>

            {/* List of Remaining Tasks */}
            <div className="admark-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>
                Remaining Incomplete Tasks ({remainingTasks.length})
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 1rem' }}>Task ID</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Task Title</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Assignee</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Current Status</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Est. Remaining</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {remainingTasks.map((rt) => {
                    const u = users.find((usr) => usr.id === rt.assigneeId);
                    const remainingHours = Math.max(0, rt.estimatedHours - rt.loggedHours);

                    return (
                      <tr
                        key={rt.id}
                        onClick={() => setSelectedTaskId(rt.id)}
                        style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                        className="admark-card-interactive"
                      >
                        <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-crimson)' }}>
                          #{rt.taskNumber}
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{rt.title}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>{u?.name}</td>
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span className={`badge ${rt.status === 'Blocked' ? 'badge-critical' : 'badge-neutral'}`}>
                            {rt.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{remainingHours}h</td>
                        <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{rt.dueDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 16: BLOCKERS ================= */}
        {currentTab === 'blockers' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Project Blockers & Delivery Obstacles</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Work items paused due to dependencies, missing credentials, client input, or upstream impediments
                </div>
              </div>
              <span className={`badge ${blockedTasks.length > 0 ? 'badge-critical' : 'badge-healthy'}`}>
                {blockedTasks.length} Active Blockers
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {blockedTasks.length === 0 ? (
                <div className="admark-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={32} color="var(--status-healthy)" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700 }}>Zero Active Blockers!</div>
                  <div style={{ fontSize: '0.8rem' }}>The development team is running without impediments.</div>
                </div>
              ) : (
                blockedTasks.map((bt) => {
                  const assignee = users.find((u) => u.id === bt.assigneeId);

                  return (
                    <div
                      key={bt.id}
                      className="admark-card"
                      style={{
                        padding: '1.25rem',
                        borderLeft: '4px solid var(--status-danger)',
                        background: 'rgba(239, 68, 68, 0.03)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--status-danger)', fontSize: '0.9rem' }}>
                            #{bt.taskNumber}
                          </span>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{bt.title}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="badge badge-critical">Blocked: {bt.blockedSinceDate || '2 days'}</span>
                          <button
                            onClick={() => updateTaskStatus(bt.id, 'In Progress')}
                            className="btn btn-sm btn-secondary"
                          >
                            Mark Unblocked
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem', background: 'var(--bg-app)', padding: '0.875rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--status-danger)', fontWeight: 600 }}>
                          Impediment / Reason: {bt.blockedReason || 'Dependent on Task #102 completion and client API keys.'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <strong>Impact:</strong> {bt.blockedImpact || 'Halts payment integration testing in staging.'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Responsible Owner: <strong style={{ color: 'var(--text-primary)' }}>{bt.blockedByOwner || 'Priya Sharma (PM)'}</strong> • Assignee: {assignee?.name}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 17: MAINTENANCE WORKSPACE ================= */}
        {currentTab === 'maintenance' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Post-Launch Maintenance & Support Workspace</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ongoing production stability, maintenance tickets, routine patch cycles, and SLA monitoring
                </div>
              </div>
              <button
                onClick={() => {
                  alert('Project marked in Maintenance status.');
                }}
                className="btn btn-secondary btn-sm"
              >
                Set Project Status: Maintenance
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="admark-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Open Maintenance Tasks
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  12
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Routine optimizations & updates</div>
              </div>

              <div className="admark-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Support Defect Backlog
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-healthy)', marginTop: '4px' }}>
                  3
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Resolved within 4h SLA</div>
              </div>

              <div className="admark-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Uptime & SLA
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-healthy)', marginTop: '4px' }}>
                  99.98%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Continuous production monitoring</div>
              </div>
            </div>

            <div className="admark-card" style={{ padding: '1.25rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Active Maintenance & Patch Tasks</h3>
                <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={14} />
                  <span>New Maintenance Task</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { title: 'Payment gateway SSL certificate renewal (Annual)', priority: 'High', status: 'In Progress', assignee: 'Vikram Patel' },
                  { title: 'PostgreSQL database index re-indexing & vacuum optimization', priority: 'Medium', status: 'Ready', assignee: 'Rahul Verma' },
                  { title: 'Mobile push notification token cleanup cron job', priority: 'Low', status: 'Done', assignee: 'Aisha Khan' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between" style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-app)', borderRadius: '4px', fontSize: '0.8125rem' }}>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-neutral">MNT-{idx + 101}</span>
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.assignee}</span>
                      <span className={`badge ${item.status === 'Done' ? 'badge-healthy' : 'badge-neutral'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: PROJECT SETTINGS ================= */}
        {currentTab === 'settings' && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SettingsIcon size={20} style={{ color: 'var(--brand-crimson)' }} />
                  <span>Project Settings & Hosting Configuration</span>
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Configure live hosted preview URLs, staging environments, repository destinations, and project delivery parameters.
                </div>
              </div>

              {settingsSavedNotice && (
                <div
                  className="animate-fade-in"
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: 'var(--status-healthy)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  ✓ Project settings & live hosted URL updated!
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProjectSettings} className="flex flex-col gap-4">
              {/* Live Hosting & Deployment URLs */}
              <div className="admark-card" style={{ padding: '1.25rem' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
                  <Globe size={16} style={{ color: 'var(--brand-crimson)' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Live Hosting & Preview Environments</h3>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Live Hosted Project URL (Preview URL) *
                      </label>
                      {settingsLiveUrl.trim() && (
                        <a
                          href={settingsLiveUrl.trim()}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--brand-crimson)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontWeight: 600,
                          }}
                        >
                          <span>Test / Open Preview</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                      <input
                        type="url"
                        value={settingsLiveUrl}
                        onChange={(e) => setSettingsLiveUrl(e.target.value)}
                        placeholder="https://your-project.admarkdigitals.com"
                        className="input-field"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      This hosted URL opens whenever anyone clicks the <strong>Preview</strong> button on the Projects list or header.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Staging Environment URL
                      </label>
                      <input
                        type="url"
                        value={settingsStagingUrl}
                        onChange={(e) => setSettingsStagingUrl(e.target.value)}
                        placeholder="https://staging.your-project.dev"
                        className="input-field"
                        style={{ marginTop: '4px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Code Repository URL (GitHub / GitLab)
                      </label>
                      <input
                        type="url"
                        value={settingsRepoUrl}
                        onChange={(e) => setSettingsRepoUrl(e.target.value)}
                        placeholder="https://github.com/organization/repo"
                        className="input-field"
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="admark-card" style={{ padding: '1.25rem' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
                  <Link2 size={16} style={{ color: 'var(--text-muted)' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Project Details</h3>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Project Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                        className="input-field"
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Project Code *
                      </label>
                      <input
                        required
                        type="text"
                        value={settingsCode}
                        onChange={(e) => setSettingsCode(e.target.value)}
                        className="input-field"
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Delivery Status
                      </label>
                      <select
                        value={settingsStatus}
                        onChange={(e) => setSettingsStatus(e.target.value as any)}
                        className="input-field"
                        style={{ marginTop: '4px' }}
                      >
                        <option value="Active">Active</option>
                        <option value="Planning">Planning</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Deployed">Deployed</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Priority
                      </label>
                      <select
                        value={settingsPriority}
                        onChange={(e) => setSettingsPriority(e.target.value as any)}
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
                        Target Delivery Deadline
                      </label>
                      <input
                        type="date"
                        value={settingsDeadline}
                        onChange={(e) => setSettingsDeadline(e.target.value)}
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
                      value={settingsTech}
                      onChange={(e) => setSettingsTech(e.target.value)}
                      placeholder="e.g. React, Next.js, Node.js, PostgreSQL"
                      className="input-field"
                      style={{ marginTop: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Project Description
                    </label>
                    <textarea
                      rows={3}
                      value={settingsDesc}
                      onChange={(e) => setSettingsDesc(e.target.value)}
                      className="input-field"
                      style={{ marginTop: '4px', resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between" style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Updates are saved and immediately reflected on live previews and the project board.
                </div>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={14} />
                  <span>Save Project Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Client Review Modal */}
        {showAddReviewModal && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddReviewModal(false)}>
            <div
              className="admark-card"
              style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', borderRadius: '0.75rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Client Review</h2>
                <button onClick={() => setShowAddReviewModal(false)} className="btn btn-ghost btn-icon">
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newReviewTitle.trim()) return;

                  addUATItem({
                    projectId: project.id,
                    releaseId: 'rel-1',
                    featureTitle: newReviewTitle.trim(),
                    description: newReviewDesc.trim() || 'Verified deliverable against specification.',
                    testSteps: ['Verify feature functionality', 'Check responsive behavior', 'Confirm expected outcome'],
                    expectedResult: 'Feature functions according to specification.',
                    status: newReviewStatus,
                    clientFeedback: newReviewFeedback.trim() || undefined,
                    clientReviewedAt: new Date().toLocaleDateString(),
                    reviewedBy: currentUser.name,
                  });

                  setNewReviewTitle('');
                  setNewReviewDesc('');
                  setNewReviewFeedback('');
                  setNewReviewStatus('Pending');
                  setShowAddReviewModal(false);
                }}
                className="flex flex-col gap-3"
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Deliverable / Feature Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Package Customization & Date Selection"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Scope / Test Description
                  </label>
                  <textarea
                    rows={2}
                    value={newReviewDesc}
                    onChange={(e) => setNewReviewDesc(e.target.value)}
                    placeholder="Describe what was verified or reviewed..."
                    className="input-field"
                    style={{ marginTop: '4px', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Review Status
                  </label>
                  <select
                    value={newReviewStatus}
                    onChange={(e) => setNewReviewStatus(e.target.value as any)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Passed">Passed</option>
                    <option value="Needs Change">Needs Change</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Client Feedback / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newReviewFeedback}
                    onChange={(e) => setNewReviewFeedback(e.target.value)}
                    placeholder="Client feedback comments..."
                    className="input-field"
                    style={{ marginTop: '4px', resize: 'vertical' }}
                  />
                </div>

                <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowAddReviewModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Module Modal (CEO Only) */}
        {showAddModuleModal && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModuleModal(false)}>
            <div
              className="admark-card"
              style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', borderRadius: '0.75rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <div className="flex items-center gap-2">
                  <FolderTree size={18} style={{ color: 'var(--brand-crimson)' }} />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Project Module</h2>
                </div>
                <button onClick={() => setShowAddModuleModal(false)} className="btn btn-ghost btn-icon">
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '0.45rem 0.75rem', background: 'rgba(230, 57, 70, 0.08)', border: '1px solid rgba(230, 57, 70, 0.2)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--brand-crimson)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✓ CEO Authorized Action ({currentUser.name})</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newModuleName.trim()) return;

                  const dels = newModuleDeliverables
                    .split('\n')
                    .map((d) => d.trim())
                    .filter(Boolean);

                  addModule({
                    projectId: project.id,
                    name: newModuleName.trim(),
                    description: newModuleDesc.trim() || 'Functional architecture module deliverable.',
                    leadId: newModuleLeadId || currentUser.id,
                    order: projectModules.length + 1,
                    targetDate: newModuleTargetDate || project.deadline,
                    status: newModuleStatus,
                    deliverables: dels.length > 0 ? dels : undefined,
                  });

                  setNewModuleName('');
                  setNewModuleDesc('');
                  setNewModuleDeliverables('');
                  setShowAddModuleModal(false);
                }}
                className="flex flex-col gap-3"
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Module Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="e.g. Authentication & Security"
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Module Lead Engineer
                    </label>
                    <select
                      value={newModuleLeadId}
                      onChange={(e) => setNewModuleLeadId(e.target.value)}
                      className="input-field"
                      style={{ marginTop: '4px' }}
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Initial Status
                    </label>
                    <select
                      value={newModuleStatus}
                      onChange={(e) => setNewModuleStatus(e.target.value as any)}
                      className="input-field"
                      style={{ marginTop: '4px' }}
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newModuleTargetDate}
                    onChange={(e) => setNewModuleTargetDate(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Module Scope & Description
                  </label>
                  <textarea
                    rows={2}
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    placeholder="Describe technical scope, key services, and features..."
                    className="input-field"
                    style={{ marginTop: '4px', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Key Deliverables Checklist (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newModuleDeliverables}
                    onChange={(e) => setNewModuleDeliverables(e.target.value)}
                    placeholder="OAuth2 SSO integration&#10;Role-based access matrix&#10;Acceptance test suite"
                    className="input-field"
                    style={{ marginTop: '4px', resize: 'vertical' }}
                  />
                </div>

                <div className="flex justify-end gap-2" style={{ marginTop: '0.75rem' }}>
                  <button type="button" onClick={() => setShowAddModuleModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Project Confirmation Modal */}
        {showDeleteProjectModal && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setShowDeleteProjectModal(false)}>
            <div
              className="admark-card"
              style={{ width: '100%', maxWidth: '460px', padding: '1.5rem', borderRadius: '0.75rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5" style={{ color: 'var(--status-danger)', marginBottom: '0.75rem' }}>
                <Trash2 size={20} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Delete Project</h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>{project.code} - {project.name}</strong>?
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                This will permanently remove the project and its delivery data. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2" style={{ marginTop: '1.25rem' }}>
                <button onClick={() => setShowDeleteProjectModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProject(project.id);
                    setShowDeleteProjectModal(false);
                    setSelectedProjectId(null);
                    setCurrentView('projects');
                  }}
                  className="btn btn-primary"
                  style={{ background: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CEO Authorization Required Modal */}
        {showCeoRequiredModal && (
          <div className="modal-backdrop animate-fade-in" onClick={() => setShowCeoRequiredModal(false)}>
            <div
              className="admark-card"
              style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', borderRadius: '0.75rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--status-warning)' }}>
                  <ShieldAlert size={20} />
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>CEO Authorization Required</h2>
                </div>
                <button onClick={() => setShowCeoRequiredModal(false)} className="btn btn-ghost btn-icon">
                  <X size={16} />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Only <strong>CEO (T Jois)</strong> is authorized to create/delete projects and add modules in the Admark Digitals workspace. Please sign in with the CEO account credentials to perform this action.
              </p>

              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>CEO Account Required:</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>tjois@admarkdigitals.com</div>
                </div>
                <button
                  onClick={() => {
                    setShowCeoRequiredModal(false);
                    logout();
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Sign Out to Switch
                </button>
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '1.25rem' }}>
                <button onClick={() => setShowCeoRequiredModal(false)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
