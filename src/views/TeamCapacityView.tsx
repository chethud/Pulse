import React, { useState } from 'react';
import { X, Lock, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isPhotoAdminUser } from '../types';
import { CreateAccountModal } from '../components/modals/CreateAccountModal';

/** Fixed system operators — only these show Super Admin / Admin, and roles cannot change. */
const OPERATOR_IDS = new Set(['user-1', 'user-2']); // Harshith (Admin), Tejas (Super Admin)

function isOperator(u: { id: string; name: string; role: string }): boolean {
  if (OPERATOR_IDS.has(u.id)) return true;
  const name = u.name.toLowerCase();
  return name.includes('tejas') || name.includes('harshith') || name.includes('jois');
}

function operatorRoleLabel(u: { role: string; name: string }): 'Super Admin' | 'Admin' {
  const name = u.name.toLowerCase();
  if (
    u.role === 'SUPERADMIN' ||
    u.role === 'SUPER_ADMIN' ||
    name.includes('tejas') ||
    name.includes('jois')
  ) {
    return 'Super Admin';
  }
  return 'Admin';
}

export const TeamCapacityView: React.FC = () => {
  const { users, tasks, projects, setSelectedTaskId, canCreateAccount } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const directoryUsers = users
    .filter((u) => u.role !== 'CLIENT' && !isPhotoAdminUser(u))
    .sort((a, b) => {
      const aOp = isOperator(a) ? 0 : 1;
      const bOp = isOperator(b) ? 0 : 1;
      if (aOp !== bOp) return aOp - bOp;
      if (isOperator(a) && isOperator(b)) {
        return operatorRoleLabel(a) === 'Super Admin' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

  const inspectUser = directoryUsers.find((u) => u.id === selectedUserId);

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Team Directory
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Tejas is Super Admin and Harshith is Admin (fixed). Everyone else is listed only as project team members.
          </p>
        </div>
        {canCreateAccount && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}
          >
            <UserPlus size={15} />
            <span>+ Add Person</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-5 items-start">
        <div style={{ gridColumn: selectedUserId ? 'span 8' : 'span 12', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="admark-card" style={{ overflow: 'hidden' }}>
            <table className="admark-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Team Member</th>
                  <th style={{ width: '24%' }}>Role</th>
                  <th style={{ width: '20%' }}>Active Projects</th>
                  <th style={{ width: '16%' }}>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {directoryUsers.map((u) => {
                  const operator = isOperator(u);
                  const roleLabel = operator ? operatorRoleLabel(u) : null;
                  const userTasks = tasks.filter((t) => t.assigneeId === u.id && t.status !== 'Done');
                  const userProjects = projects.filter(
                    (p) => p.teamMemberIds.includes(u.id) || p.projectManagerId === u.id
                  );

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id === selectedUserId ? null : u.id)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: u.id === selectedUserId ? 'var(--bg-elevated)' : undefined,
                      }}
                    >
                      <td>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                              {u.name}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {operator && roleLabel ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`badge ${roleLabel === 'Super Admin' ? 'badge-critical' : 'badge-warning'}`}
                              style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem' }}
                            >
                              {roleLabel}
                            </span>
                            <span title="Role is locked" style={{ display: 'inline-flex' }}>
                              <Lock size={11} style={{ color: 'var(--text-muted)', opacity: 0.7 }} aria-hidden />
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {userProjects.length} active
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {userTasks.length} in flight
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {inspectUser && (
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="admark-card" style={{ padding: '1rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <div className="flex items-center gap-2">
                  <img
                    src={inspectUser.avatar}
                    alt={inspectUser.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {inspectUser.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inspectUser.email}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedUserId(null)} className="btn btn-ghost btn-sm" style={{ padding: '3px' }}>
                  <X size={14} />
                </button>
              </div>

              <div
                style={{
                  marginBottom: '0.85rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '6px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {isOperator(inspectUser) ? (
                  <>
                    <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                        }}
                      >
                        Role
                      </span>
                      <Lock size={12} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {operatorRoleLabel(inspectUser)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Fixed — cannot be changed
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                      }}
                    >
                      Team Member
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      Listed to track who is working on projects. No system role assigned.
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Assigned Projects
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {projects
                    .filter(
                      (p) =>
                        p.teamMemberIds.includes(inspectUser.id) || p.projectManagerId === inspectUser.id
                    )
                    .map((p) => (
                      <span key={p.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {p.code} ({p.name})
                      </span>
                    ))}
                  {projects.filter(
                    (p) => p.teamMemberIds.includes(inspectUser.id) || p.projectManagerId === inspectUser.id
                  ).length === 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No projects assigned</span>
                  )}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Active Tasks (
                  {tasks.filter((t) => t.assigneeId === inspectUser.id && t.status !== 'Done').length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {tasks
                    .filter((t) => t.assigneeId === inspectUser.id && t.status !== 'Done')
                    .slice(0, 5)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTaskId(t.id)}
                        className="admark-card-interactive flex items-center justify-between"
                        style={{ padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }} className="truncate">
                          #{t.taskNumber} {t.title}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateAccountModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
};
