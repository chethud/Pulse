import React from 'react';
import {
  FolderKanban,
  Clock,
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    projects,
    tasks,
    modules,
    clients,
    activities,
    users,
    setSelectedProjectId,
    setSelectedTaskId,
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

      {/* Main Grid: Left Section (Project Overview Table) + Right Section (Upcoming Deadlines & Workload) */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Clean Project Overview Table */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                  <th style={{ width: '38%' }}>Project</th>
                  <th style={{ width: '18%' }}>Client</th>
                  <th style={{ width: '18%' }}>Progress</th>
                  <th style={{ width: '14%' }}>Health</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Due</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => {
                  const client = clients.find((c) => c.id === proj.clientId);
                  const pm = users.find((u) => u.id === proj.projectManagerId);

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

                      {/* 13. Health: Small Status Indicator Dot */}
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

                      {/* Deadline */}
                      <td style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {proj.deadline.replace('2025-', '').replace('-', '/')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Deadlines & Team Workload */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 14. Upcoming Deadlines (Clean list with date hierarchy) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
              Upcoming Deadlines
            </div>

            <div className="admark-card" style={{ padding: '0.5rem 0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {tasks.slice(0, 5).map((t) => {
                  const proj = projects.find((p) => p.id === t.projectId);
                  const assignee = users.find((u) => u.id === t.assigneeId);
                  const formattedDate = t.dueDate.replace('2025-', '').replace('-', '/');

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="admark-card-interactive flex items-start justify-between"
                      style={{
                        padding: '0.4rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ maxWidth: '75%' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                          {t.title}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                          {proj?.code} • {assignee?.name?.split(' ')[0] || 'Unassigned'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {formattedDate}
                        </div>
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 19. Recent Activity (Clean timeline with subtle dots) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
              Recent Activity
            </div>

            <div className="admark-card" style={{ padding: '0.75rem 0.85rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {activities.slice(0, 6).map((act) => {
                  const actor = users.find((u) => u.id === act.userId);
                  return (
                    <div key={act.id} className="flex items-start gap-2" style={{ fontSize: '0.75rem' }}>
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
    </div>
  );
};
