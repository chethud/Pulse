import React, { useState, useMemo } from 'react';
import {
  Search,
  FolderKanban,
  CheckSquare,
  Bug,
  Building2,
  Plus,
  Clock,
  ArrowRight,
  Shield,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    projects,
    tasks,
    bugs,
    clients,
    setSelectedProjectId,
    setSelectedTaskId,
    setSelectedBugId,
    setCurrentView,
    setQuickCreateOpen,
    setActiveRole,
  } = useApp();

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return {
        actions: [
          { id: 'act-new-task', label: 'Create New Task', icon: <Plus size={16} />, execute: () => setQuickCreateOpen(true) },
          { id: 'act-new-bug', label: 'Log New Bug / Issue', icon: <Bug size={16} />, execute: () => setQuickCreateOpen(true) },
          { id: 'act-log-time', label: 'Log Work Hours', icon: <Clock size={16} />, execute: () => setQuickCreateOpen(true) },
          { id: 'act-client-portal', label: 'Switch to Client Portal View', icon: <Shield size={16} />, execute: () => setActiveRole('CLIENT') },
        ],
        projects: projects.slice(0, 4),
        tasks: tasks.slice(0, 4),
        bugs: bugs.slice(0, 3),
        clients: clients.slice(0, 3),
      };
    }

    const q = query.toLowerCase();
    return {
      actions: [
        { id: 'act-new-task', label: 'Create New Task', icon: <Plus size={16} />, execute: () => setQuickCreateOpen(true) },
        { id: 'act-new-bug', label: 'Log New Bug', icon: <Bug size={16} />, execute: () => setQuickCreateOpen(true) },
      ].filter((a) => a.label.toLowerCase().includes(q)),
      projects: projects.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)),
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q) || `#${t.taskNumber}`.includes(q)),
      bugs: bugs.filter((b) => b.title.toLowerCase().includes(q) || `#${b.bugNumber}`.includes(q)),
      clients: clients.filter((c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)),
    };
  }, [query, projects, tasks, bugs, clients, setQuickCreateOpen, setActiveRole]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => setCommandPaletteOpen(false)}>
      <div
        className="admark-card"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          borderRadius: '0.75rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={18} color="var(--brand-crimson)" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (projects, tasks, bugs, clients)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="btn btn-ghost btn-icon"
            style={{ padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: '0.5rem', overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Quick Actions */}
          {filtered.actions.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                Quick Actions
              </div>
              {filtered.actions.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    act.execute();
                    setCommandPaletteOpen(false);
                  }}
                  className="admark-card-interactive flex items-center justify-between"
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', margin: '2px 0' }}
                >
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: 'var(--brand-crimson)' }}>{act.icon}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{act.label}</span>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {filtered.projects.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                Projects ({filtered.projects.length})
              </div>
              {filtered.projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setCurrentView('projects');
                    setCommandPaletteOpen(false);
                  }}
                  className="admark-card-interactive flex items-center justify-between"
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', margin: '2px 0' }}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderKanban size={16} color="var(--status-info)" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {proj.code}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{proj.name}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Progress: {proj.progress}% • Health: {proj.health.overall}</div>
                    </div>
                  </div>
                  <span className={`badge ${proj.health.overall === 'Healthy' ? 'badge-healthy' : 'badge-at-risk'}`}>
                    {proj.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {filtered.tasks.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                Tasks ({filtered.tasks.length})
              </div>
              {filtered.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setCommandPaletteOpen(false);
                  }}
                  className="admark-card-interactive flex items-center justify-between"
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', margin: '2px 0' }}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare size={16} color="var(--status-healthy)" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-crimson)' }}>
                          #{task.taskNumber}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{task.title}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Status: {task.status} • Est: {task.estimatedHours}h • Due: {task.dueDate}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-neutral">{task.priority}</span>
                </div>
              ))}
            </div>
          )}

          {/* Bugs */}
          {filtered.bugs.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                Bugs ({filtered.bugs.length})
              </div>
              {filtered.bugs.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBugId(b.id);
                    setCommandPaletteOpen(false);
                  }}
                  className="admark-card-interactive flex items-center justify-between"
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', margin: '2px 0' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Bug size={16} color="var(--status-danger)" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-danger)' }}>
                          #{b.bugNumber}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{b.title}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {b.environment} • Severity: {b.severity} • {b.status}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${b.severity === 'Critical' ? 'badge-critical' : 'badge-neutral'}`}>
                    {b.severity}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Clients */}
          {filtered.clients.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
                Clients ({filtered.clients.length})
              </div>
              {filtered.clients.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setCurrentView('clients');
                    setCommandPaletteOpen(false);
                  }}
                  className="admark-card-interactive flex items-center justify-between"
                  style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', margin: '2px 0' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 size={16} color="var(--text-secondary)" />
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.industry} • {c.location}</div>
                    </div>
                  </div>
                  <span className="badge badge-healthy">{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.6rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Use <strong>Esc</strong> to close</span>
          <span>Press <strong>Enter</strong> to jump</span>
        </div>
      </div>
    </div>
  );
};
