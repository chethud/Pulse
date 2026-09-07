import React from 'react';
import {
  X,
  Bug as BugIcon,
  AlertOctagon,
  CheckCircle,
  Monitor,
  Smartphone,
  Layers,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BugStatus, BugSeverity } from '../../types';

export const BugDetailDrawer: React.FC = () => {
  const {
    selectedBugId,
    setSelectedBugId,
    bugs,
    projects,
    users,
    updateBugStatus,
  } = useApp();

  if (!selectedBugId) return null;

  const bug = bugs.find((b) => b.id === selectedBugId);
  if (!bug) return null;

  const project = projects.find((p) => p.id === bug.projectId);
  const assignee = users.find((u) => u.id === bug.assigneeId);
  const reporter = users.find((u) => u.id === bug.reporterId);

  const statuses: BugStatus[] = [
    'New',
    'Triaged',
    'Assigned',
    'In Progress',
    'Fixed',
    'QA Testing',
    'Verified',
    'Closed',
    'Reopened',
  ];

  return (
    <div className="drawer-backdrop animate-fade-in" onClick={() => setSelectedBugId(null)}>
      <div
        className="animate-slide-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '680px',
          height: '100vh',
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            height: '56px',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-sidebar)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--status-danger)',
              }}
            >
              #{bug.bugNumber}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {project?.code} — {project?.name}
            </span>
          </div>

          <button onClick={() => setSelectedBugId(null)} className="btn btn-ghost btn-icon">
            <X size={17} />
          </button>
        </div>

        {/* Status bar */}
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</label>
            <select
              value={bug.status}
              onChange={(e) => updateBugStatus(bug.id, e.target.value as BugStatus)}
              className="input-field"
              style={{
                width: 'auto',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderColor: bug.status === 'Verified' ? 'var(--status-healthy)' : 'var(--border-strong)',
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`badge ${
                bug.severity === 'Critical'
                  ? 'badge-critical'
                  : bug.severity === 'Major'
                  ? 'badge-at-risk'
                  : 'badge-neutral'
              }`}
            >
              Severity: {bug.severity}
            </span>
            <span className="badge badge-info">{bug.environment}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {bug.title}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Reported on {new Date(bug.createdAt).toLocaleString()} by {reporter?.name || 'QA Tester'}
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Bug Description
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                background: 'var(--bg-app)',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {bug.description}
            </div>
          </div>

          {/* Steps to Reproduce */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Steps to Reproduce
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {bug.stepsToReproduce.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--brand-crimson)',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-2 gap-3">
            <div
              style={{
                padding: '0.875rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--status-healthy)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Expected Result
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{bug.expectedResult}</div>
            </div>

            <div
              style={{
                padding: '0.875rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--status-danger)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Actual Result
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{bug.actualResult}</div>
            </div>
          </div>

          {/* Environment & Hardware details */}
          {(bug.browser || bug.device || bug.version) && (
            <div
              style={{
                padding: '0.875rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Diagnostics & Device Profile
              </div>
              <div className="flex flex-wrap gap-4" style={{ fontSize: '0.8125rem' }}>
                {bug.browser && (
                  <div className="flex items-center gap-1.5">
                    <Monitor size={14} color="var(--text-muted)" />
                    <span>{bug.browser}</span>
                  </div>
                )}
                {bug.device && (
                  <div className="flex items-center gap-1.5">
                    <Smartphone size={14} color="var(--text-muted)" />
                    <span>{bug.device}</span>
                  </div>
                )}
                {bug.version && (
                  <div className="flex items-center gap-1.5">
                    <Layers size={14} color="var(--text-muted)" />
                    <span>Build: {bug.version}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assigned Engineer */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: '0.875rem',
              borderRadius: '0.5rem',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Assigned Fix Engineer
              </div>
              <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                <img
                  src={assignee?.avatar}
                  alt={assignee?.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{assignee?.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({assignee?.title})</span>
              </div>
            </div>

            <button
              onClick={() => updateBugStatus(bug.id, 'Fixed')}
              className="btn btn-sm btn-primary"
              style={{ background: 'var(--status-healthy)' }}
            >
              <CheckCircle size={14} />
              <span>Mark as Fixed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
