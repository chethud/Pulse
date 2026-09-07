import React, { useState } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  Trash2,
  ShieldAlert,
  X,
  ExternalLink,
  CheckCircle2,
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

export const ProjectsListView: React.FC = () => {
  const {
    projects,
    clients,
    users,
    currentUser,
    canDelete,
    isSuperAdmin,
    setSelectedProjectId,
    setQuickCreateOpen,
    deleteProject,
    updateProject,
    logout,
  } = useApp();

  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [showCeoRequiredModal, setShowCeoRequiredModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [healthFilter, setHealthFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects
    .filter((p) => {
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (healthFilter !== 'All' && p.health.overall !== healthFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const aCompleted = a.status === 'Completed' || a.progress === 100;
      const bCompleted = b.status === 'Completed' || b.progress === 100;
      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;
      return 0;
    });

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Projects
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Active client software delivery projects under engineering, testing, and deployment.
          </p>
        </div>

        <button
          onClick={() => {
            if (isSuperAdmin) {
              setQuickCreateOpen(true);
            } else {
              setShowCeoRequiredModal(true);
            }
          }}
          className="btn btn-primary btn-sm"
          title={isSuperAdmin ? 'Create New Project' : 'Only CEO (Super Admin) can create projects'}
        >
          <Plus size={14} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          {['All', 'Active', 'Planning', 'On Hold', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`btn btn-sm ${statusFilter === tab ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {tab}
            </button>
          ))}

          <span style={{ color: 'var(--border-subtle)', margin: '0 4px' }}>|</span>

          {['All', 'Healthy', 'At Risk', 'Critical'].map((h) => (
            <button
              key={h}
              onClick={() => setHealthFilter(h)}
              className={`btn btn-sm ${healthFilter === h ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {h === 'All' ? 'All Health' : h}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="input-field"
            style={{ paddingLeft: '26px', height: '28px', fontSize: '0.78rem' }}
          />
        </div>
      </div>

      {/* Clean Compact Table */}
      <div className="admark-card" style={{ overflow: 'hidden' }}>
        <table className="admark-table">
          <thead>
            <tr>
              <th style={{ width: '26%' }}>Project</th>
              <th style={{ width: '16%' }}>Client</th>
              <th style={{ width: '14%' }}>Assigned Developer</th>
              <th style={{ width: '12%' }}>Progress</th>
              <th style={{ width: '10%' }}>Health</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Deadline</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj) => {
              const client = clients.find((c) => c.id === proj.clientId);
              const devUsers = users.filter(
                (u) =>
                  u.department === 'Engineering' ||
                  (u.department !== 'Leadership' && !['CEO', 'COO', 'CFO'].includes(u.title || '') && u.role !== 'SUPERADMIN' && u.role !== 'ADMIN')
              );
              const assignedDev =
                devUsers.find((u) => u.id === proj.projectManagerId) ||
                devUsers.find((u) => proj.teamMemberIds?.includes(u.id)) ||
                devUsers[0];
              const deadlineUrgent =
                proj.status !== 'Completed' && isDeadlineWithin15Days(proj.deadline);

              return (
                <tr
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="flex items-center gap-2.5">
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
                          {proj.techStack.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {client?.name || 'Enterprise'}
                  </td>

                  <td>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={assignedDev?.avatar}
                        alt={assignedDev?.name}
                        style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{assignedDev?.name}</span>
                    </div>
                  </td>

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

                  <td style={{ textAlign: 'center' }}>
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {proj.status !== 'Completed' ? (
                        isSuperAdmin ? (
                          <button
                            onClick={() => updateProject(proj.id, { status: 'Completed', progress: 100 })}
                            className="btn btn-secondary btn-sm"
                            style={{
                              height: '24px',
                              padding: '0 8px',
                              fontSize: '0.7rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#38bdf8',
                              borderColor: 'rgba(56, 189, 248, 0.35)',
                              background: 'rgba(56, 189, 248, 0.08)',
                              fontWeight: 600,
                            }}
                            title="Mark project Completed (CEO / Super Admin authority)"
                          >
                            <CheckCircle2 size={11} style={{ color: '#38bdf8' }} />
                            <span>Complete</span>
                          </button>
                        ) : null
                      ) : (
                        isSuperAdmin ? (
                          <button
                            onClick={() => updateProject(proj.id, { status: 'Active' })}
                            className="btn btn-secondary btn-sm"
                            style={{
                              height: '24px',
                              padding: '0 8px',
                              fontSize: '0.7rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(16, 185, 129, 0.16)',
                              color: '#34d399',
                              borderColor: 'rgba(16, 185, 129, 0.5)',
                              fontWeight: 700,
                            }}
                            title="Project is Completed (click to reopen as Active)"
                          >
                            <CheckCircle2 size={11} style={{ color: '#34d399' }} />
                            <span>✓ Done</span>
                          </button>
                        ) : (
                          <span
                            className="badge"
                            style={{
                              background: 'rgba(16, 185, 129, 0.16)',
                              color: '#34d399',
                              borderColor: 'rgba(16, 185, 129, 0.4)',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                            }}
                            title="Project is Completed (Closed by CEO)"
                          >
                            ✓ Done
                          </span>
                        )
                      )}

                      <button
                        onClick={() => {
                          const url = proj.liveUrl || proj.productionUrl || proj.stagingUrl;
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            setSelectedProjectId(proj.id);
                          }
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{
                          height: '24px',
                          padding: '0 8px',
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                        title={
                          proj.liveUrl || proj.productionUrl || proj.stagingUrl
                            ? `Open live hosted project: ${proj.liveUrl || proj.productionUrl || proj.stagingUrl}`
                            : 'Set live URL in Project Settings'
                        }
                      >
                        <ExternalLink size={11} />
                        <span>Preview</span>
                      </button>

                      {canDelete && (
                        <button
                          onClick={() => setProjectToDelete(proj)}
                          className="btn btn-ghost btn-icon"
                          style={{ height: '24px', width: '24px', padding: 0, color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-danger)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          title={`Delete ${proj.code}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setProjectToDelete(null)}>
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
              Are you sure you want to delete <strong>{projectToDelete.code} - {projectToDelete.name}</strong>?
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              This will permanently delete the project and its delivery data. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2" style={{ marginTop: '1.25rem' }}>
              <button onClick={() => setProjectToDelete(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProject(projectToDelete.id);
                  setProjectToDelete(null);
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
              Only <strong>CEO (T Jois)</strong> is authorized to create, delete, or mark projects as completed in the Admark Digitals workspace. Please sign in with the CEO account credentials to perform this action.
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
  );
};
