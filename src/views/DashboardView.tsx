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
  const activeProjects = projects.filter((p) => p.status === 'Active');
  const overdueTasks = tasks.filter((t) => {
    return t.status !== 'Done' && new Date(t.dueDate) < new Date('2025-03-01');
  });

  // Team capacity
  const teamMembers = users.filter((u) => u.role !== 'CLIENT');
  const totalCapacity = teamMembers.length * 40;
  const assignedHours = tasks.reduce((sum, t) => sum + (t.status !== 'Done' ? t.estimatedHours : 0), 0);
  const utilizationPct = Math.min(96, Math.round((assignedHours / totalCapacity) * 100));

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
            onClick={() => setQuickCreateOpen(true)}
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

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Team Utilization
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
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
              {projects.map((proj) => {
                const client = clients.find((c) => c.id === proj.clientId);
                const pm = users.find((u) => u.id === proj.projectManagerId);
                const deadlineUrgent =
                  proj.status !== 'Completed' && isDeadlineWithin15Days(proj.deadline);

                return (
                  <tr
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setCurrentView('projects');
                    }}
                    style={{ cursor: 'pointer' }}
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
