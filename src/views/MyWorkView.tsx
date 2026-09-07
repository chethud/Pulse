import React, { useState, useMemo } from 'react';
import { ChevronRight, FolderKanban } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isPhotoAdminUser } from '../types';

function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-CA');
}

function isDeadlineWithin15Days(dateStr: string): boolean {
  const deadline = new Date(dateStr);
  if (Number.isNaN(deadline.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 15;
}

export const MyWorkView: React.FC = () => {
  const {
    currentUser,
    users,
    projects,
    clients,
    setSelectedProjectId,
    setCurrentView,
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);

  React.useEffect(() => {
    setSelectedUserId(currentUser.id);
  }, [currentUser.id]);

  const viewUser = users.find((u) => u.id === selectedUserId) || currentUser;
  const isViewingSelf = viewUser.id === currentUser.id;
  const viewingAll = selectedUserId === 'ALL';

  const assignedProjects = useMemo(() => {
    const list = viewingAll
      ? projects.filter((p) => p.status !== 'Completed')
      : projects.filter(
          (p) =>
            p.projectManagerId === viewUser.id ||
            (p.teamMemberIds || []).includes(viewUser.id)
        );

    return [...list].sort((a, b) => {
      const aDone = a.status === 'Completed' || a.progress === 100;
      const bDone = b.status === 'Completed' || b.progress === 100;
      if (aDone && !bDone) return 1;
      if (!aDone && bDone) return -1;
      return a.name.localeCompare(b.name);
    });
  }, [projects, viewUser.id, viewingAll]);

  const activeCount = assignedProjects.filter((p) => p.status === 'Active').length;
  const leadCount = viewingAll
    ? 0
    : assignedProjects.filter((p) => p.projectManagerId === viewUser.id).length;
  const atRiskCount = assignedProjects.filter((p) => p.health.overall !== 'Healthy').length;

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {isViewingSelf ? 'My Work' : viewingAll ? 'Team Projects' : `${viewUser.name}'s Work`}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {viewingAll
              ? 'Active delivery projects across the team.'
              : `Projects assigned to ${isViewingSelf ? 'you' : viewUser.name} as lead or team member.`}
          </p>
        </div>

        <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>View:</span>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="input-field"
            style={{
              fontSize: '0.75rem',
              padding: '0.35rem 0.65rem',
              width: 'auto',
              minWidth: '170px',
              height: '32px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <option value={currentUser.id}>My Projects ({currentUser.name})</option>
            <option value="ALL">All Active Projects</option>
            {users
              .filter((u) => !isPhotoAdminUser(u) && u.role !== 'CLIENT' && u.id !== currentUser.id)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.title})
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="kpi-strip">
        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Assigned Projects
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {assignedProjects.length}
          </div>
        </div>
        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {activeCount}
          </div>
        </div>
        {!viewingAll && (
          <div className="kpi-strip-item">
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              As Lead
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {leadCount}
            </div>
          </div>
        )}
        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            At Risk
          </div>
          <div
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: atRiskCount > 0 ? 'var(--status-warning)' : 'var(--text-primary)',
              marginTop: '2px',
            }}
          >
            {atRiskCount}
          </div>
        </div>
      </div>

      <div className="admark-card" style={{ overflow: 'hidden' }}>
        {assignedProjects.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <FolderKanban size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              No projects assigned
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {viewingAll
                ? 'No active projects found.'
                : `${isViewingSelf ? 'You are' : `${viewUser.name} is`} not assigned to any projects yet.`}
            </div>
          </div>
        ) : (
          <table className="admark-table" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Project</th>
                <th style={{ width: '18%' }}>Client</th>
                {!viewingAll && <th style={{ width: '10%' }}>Role</th>}
                <th style={{ width: '14%' }}>Progress</th>
                <th style={{ width: '12%' }}>Health</th>
                <th style={{ width: viewingAll ? '14%' : '10%' }}>Status</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {assignedProjects.map((proj) => {
                const client = clients.find((c) => c.id === proj.clientId);
                const isLead = !viewingAll && proj.projectManagerId === viewUser.id;
                const deadlineUrgent =
                  proj.status !== 'Completed' && isDeadlineWithin15Days(proj.deadline);
                const lead = users.find((u) => u.id === proj.projectManagerId);

                return (
                  <tr
                    key={proj.id}
                    onClick={() => {
                      setCurrentView('projects');
                      setSelectedProjectId(proj.id);
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Open project overview"
                  >
                    <td style={{ minWidth: 0 }}>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: 'var(--brand-crimson)',
                            padding: '1px 5px',
                            background: 'rgba(225, 29, 72, 0.1)',
                            borderRadius: '3px',
                            flexShrink: 0,
                          }}
                        >
                          {proj.code}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }} className="truncate">
                            {proj.name}
                          </div>
                          {viewingAll && (
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }} className="truncate">
                              Lead: {lead?.name || 'Unassigned'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', minWidth: 0 }} className="truncate">
                      {client?.name || '—'}
                    </td>

                    {!viewingAll && (
                      <td>
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            background: isLead ? 'rgba(225, 29, 72, 0.14)' : 'rgba(255,255,255,0.06)',
                            color: isLead ? 'var(--brand-crimson)' : 'var(--text-secondary)',
                            borderColor: isLead ? 'rgba(225, 29, 72, 0.3)' : 'var(--border-subtle)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isLead ? 'Lead' : 'Team'}
                        </span>
                      </td>
                    )}

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

                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {proj.status}
                    </td>

                    <td
                      style={{
                        textAlign: 'right',
                        fontSize: '0.78rem',
                        color: deadlineUrgent ? 'var(--status-danger)' : 'var(--text-secondary)',
                        fontWeight: deadlineUrgent ? 700 : 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span className="inline-flex items-center gap-1" style={{ justifyContent: 'flex-end' }}>
                        {formatDeadline(proj.deadline)}
                        <ChevronRight size={13} color="var(--text-muted)" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
