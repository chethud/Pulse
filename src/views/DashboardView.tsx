import React from 'react';
import {
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

/** True when submission/deadline is within 15 days (or already past). */
function isDeadlineWithin15Days(dateStr: string): boolean {
  const deadline = new Date(dateStr);
  if (Number.isNaN(deadline.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
}

/** Max billable projects per person — each slot is worth 100/3 of utilization. */
const MAX_BILLABLE_PROJECTS = 3;

function projectProgress(p: { progress?: number; status?: string }): number {
  if (p.status === 'Completed') return 100;
  const value = typeof p.progress === 'number' ? p.progress : 0;
  return Math.max(0, Math.min(100, value));
}

/**
 * Per-person utilization from project progress (not hours).
 * Each of up to 3 billable projects contributes progress/3.
 * Example: 1 project at 90% → 90/3 = 30%. Three projects at 20/80/40 → 46.7%.
 */
function personUtilization(
  userId: string,
  projects: { id: string; status: string; progress: number; projectManagerId: string; teamMemberIds: string[] }[]
): { pct: number; projectCount: number; atCapacity: boolean } {
  const assigned = projects
    .filter(
      (p) =>
        p.status !== 'Archived' &&
        (p.teamMemberIds?.includes(userId) || p.projectManagerId === userId)
    )
    .sort((a, b) => projectProgress(b) - projectProgress(a))
    .slice(0, MAX_BILLABLE_PROJECTS);

  const progressSum = assigned.reduce((sum, p) => sum + projectProgress(p), 0);
  const pct = Math.round(progressSum / MAX_BILLABLE_PROJECTS);
  return {
    pct: Math.max(0, Math.min(100, pct)),
    projectCount: assigned.length,
    atCapacity: assigned.length >= MAX_BILLABLE_PROJECTS,
  };
}

export const DashboardView: React.FC = () => {
  const {
    projects,
    tasks,
    modules,
    clients,
    users,
    setSelectedProjectId,
    setCurrentView,
    setQuickCreateOpen,
  } = useApp();

  // KPI calculations
  const activeProjects = projects.filter((p) => p.status === 'Active' || p.status === 'Planning');
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'Done' || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    if (Number.isNaN(due.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  });

  // Team utilization: average of each person's progress-weighted billable slots (max 3 projects)
  const teamMembers = users.filter((u) => u.role !== 'CLIENT' && u.role !== 'PHOTO_ADMIN');
  const memberUtils = teamMembers.map((u) => personUtilization(u.id, projects));
  const utilizationPct =
    teamMembers.length === 0
      ? 0
      : Math.round(memberUtils.reduce((sum, m) => sum + m.pct, 0) / teamMembers.length);
  const membersAtCapacity = memberUtils.filter((m) => m.atCapacity).length;

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* 10. Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Software Delivery
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage projects, workload, modules and releases from one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('projects')}
            className="btn btn-secondary btn-sm"
          >
            <span>All Projects</span>
          </button>
          <button
            onClick={() => setQuickCreateOpen(true, 'project')}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* 9. Compact KPI Strip (Single Unified Bar with Vertical Hairline Dividers) */}
      <div className="kpi-strip">
        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Projects
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {activeProjects.length}
          </div>
        </div>

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Overdue Tasks
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: overdueTasks.length > 0 ? 'var(--status-warning)' : 'var(--text-primary)', marginTop: '2px' }}>
            {overdueTasks.length}
          </div>
        </div>

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Modules
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {modules.length}
          </div>
        </div>

        <div
          className="kpi-strip-item"
          title={`Avg of each person’s project progress across ${MAX_BILLABLE_PROJECTS} billable slots (progress ÷ ${MAX_BILLABLE_PROJECTS}). ${membersAtCapacity} of ${teamMembers.length} at full ${MAX_BILLABLE_PROJECTS}-project cap.`}
          style={{ cursor: 'default' }}
        >
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Team Utilization
          </div>
          <div
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color:
                utilizationPct >= 90
                  ? 'var(--status-danger)'
                  : utilizationPct >= 70
                  ? 'var(--status-warning)'
                  : 'var(--text-primary)',
              marginTop: '2px',
            }}
          >
            {utilizationPct}%
          </div>
        </div>
      </div>

      {/* Project Overview (full width) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="flex items-center justify-between" style={{ padding: '0 0.25rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Project Overview
          </div>
          <button
            onClick={() => setCurrentView('projects')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
          >
            <span>View all</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="admark-card" style={{ overflow: 'hidden' }}>
          <table className="admark-table">
            <thead>
              <tr>
                <th style={{ width: '34%' }}>Project</th>
                <th style={{ width: '20%' }}>Client</th>
                <th style={{ width: '18%' }}>Progress</th>
                <th style={{ width: '14%' }}>Health</th>
                <th style={{ width: '14%', textAlign: 'right' }}>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {[...projects]
                .sort((a, b) => {
                  const aDone = a.status === 'Completed' || a.progress === 100;
                  const bDone = b.status === 'Completed' || b.progress === 100;
                  if (aDone && !bDone) return 1;
                  if (!aDone && bDone) return -1;
                  return b.progress - a.progress;
                })
                .map((proj) => {
                const client = clients.find((c) => c.id === proj.clientId);
                const pm = users.find((u) => u.id === proj.projectManagerId);
                const isDone = proj.status === 'Completed' || proj.progress === 100;
                const deadlineUrgent =
                  !isDone && isDeadlineWithin15Days(proj.deadline);

                return (
                  <tr
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setCurrentView('projects');
                    }}
                    style={{
                      cursor: 'pointer',
                      opacity: isDone ? 0.72 : 1,
                      background: isDone ? 'rgba(16, 185, 129, 0.04)' : undefined,
                    }}
                  >
                    {/* Project Icon / Code & Name */}
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            padding: '1px 4px',
                            background: 'var(--bg-elevated)',
                            borderRadius: '3px',
                          }}
                        >
                          {proj.code}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                            {proj.name}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            PM: {pm?.name || 'Unassigned'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      {client?.name || 'Enterprise'}
                    </td>

                    {/* Progress: Thin 4px Bar + % */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar-track" style={{ flex: 1, height: '4px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${proj.progress}%`,
                              backgroundColor:
                                proj.health.overall === 'Healthy'
                                  ? 'var(--status-healthy)'
                                  : proj.health.overall === 'At Risk'
                                  ? 'var(--status-warning)'
                                  : 'var(--status-danger)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: '28px' }}>
                          {proj.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Health */}
                    <td>
                      <span className="status-indicator">
                        <span
                          className={`status-dot ${
                            proj.health.overall === 'Healthy'
                              ? 'healthy'
                              : proj.health.overall === 'At Risk'
                              ? 'warning'
                              : 'danger'
                          }`}
                        />
                        <span>{proj.health.overall}</span>
                      </span>
                    </td>

                    {/* Deadline — red when due within 15 days */}
                    <td
                      style={{
                        textAlign: 'right',
                        fontSize: '0.78rem',
                        color: deadlineUrgent ? 'var(--status-danger)' : 'var(--text-secondary)',
                        fontWeight: deadlineUrgent ? 700 : 500,
                      }}
                      title={deadlineUrgent ? 'Submission deadline within 15 days' : undefined}
                    >
                      {formatDeadline(proj.deadline)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
