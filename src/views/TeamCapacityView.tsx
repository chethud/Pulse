import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, isPhotoAdminUser } from '../types';
import { CreateAccountModal } from '../components/modals/CreateAccountModal';

export const TeamCapacityView: React.FC = () => {
  const {
    users,
    tasks,
    projects,
    setSelectedTaskId,
    canCreateAccount,
    canManageRoles,
    updateUserRole,
  } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const internalUsers = users.filter((u) => u.role !== 'CLIENT' && !isPhotoAdminUser(u));
  const inspectUser = internalUsers.find((u) => u.id === selectedUserId);

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
            Engineering team roster, project assignments, and active task commitments.
          </p>
        </div>
        {canCreateAccount && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}
          >
            <UserPlus size={15} />
            <span>+ Create Account</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols or 12 cols): Clean Team Directory Table */}
        <div style={{ gridColumn: selectedUserId ? 'span 8' : 'span 12', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="admark-card" style={{ overflow: 'hidden' }}>
            <table className="admark-table">
              <thead>
                <tr>
                  <th style={{ width: '34%' }}>Team Member</th>
                  <th style={{ width: '28%' }}>Role & Department</th>
                  <th style={{ width: '22%' }}>Active Projects</th>
                  <th style={{ width: '16%' }}>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {internalUsers.map((u) => {
                  const isUserCEO = u.role === 'SUPERADMIN' || u.title === 'CEO' || u.name.toLowerCase().includes('jois');
                  const userTasks = tasks.filter((t) => t.assigneeId === u.id && t.status !== 'Done');
                  const userProjects = projects.filter((p) => p.teamMemberIds.includes(u.id) || p.projectManagerId === u.id);

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id === selectedUserId ? null : u.id)}
                      style={{ cursor: 'pointer', backgroundColor: u.id === selectedUserId ? 'var(--bg-elevated)' : undefined }}
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
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {u.title}
                        </div>
                        <div className="flex items-center gap-1.5" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <span>{u.department || 'Engineering'}</span>
                          <span>•</span>
                          {canManageRoles && !isUserCEO ? (
                            <select
                              value={u.role}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateUserRole(u.id, e.target.value as UserRole);
                              }}
                              className="input-field"
                              style={{
                                padding: '0.1rem 0.4rem',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                height: '23px',
                                width: 'auto',
                                cursor: 'pointer',
                                borderColor:
                                  u.role === 'ADMIN'
                                    ? 'var(--status-warning)'
                                    : u.role === 'SUPERADMIN'
                                    ? 'var(--brand-crimson)'
                                    : 'var(--border-subtle)',
                                color:
                                  u.role === 'ADMIN'
                                    ? 'var(--status-warning)'
                                    : u.role === 'SUPERADMIN'
                                    ? 'var(--brand-crimson)'
                                    : 'var(--text-secondary)',
                                backgroundColor: 'var(--bg-card)',
                              }}
                              title="CEO Authority: Change Role between Admin and Employee"
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="USER">EMPLOYEE</option>
                            </select>
                          ) : (
                            <span
                              className={`badge ${
                                u.role === 'SUPERADMIN' || isUserCEO
                                  ? 'badge-critical'
                                  : u.role === 'ADMIN'
                                  ? 'badge-warning'
                                  : 'badge-neutral'
                              }`}
                              style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}
                            >
                              {isUserCEO ? 'SUPERADMIN' : u.role === 'USER' ? 'EMPLOYEE' : u.role}
                            </span>
                          )}
                        </div>
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

        {/* Right Column (4 cols): User Detail Panel */}
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
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {inspectUser.title}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedUserId(null)} className="btn btn-ghost btn-sm" style={{ padding: '3px' }}>
                  <X size={14} />
                </button>
              </div>

              {/* Security Role & Role Switcher */}
              <div style={{ marginBottom: '0.85rem', padding: '0.65rem 0.75rem', borderRadius: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Access Level
                  </span>
                  <span
                    className={`badge ${
                      inspectUser.role === 'SUPERADMIN'
                        ? 'badge-critical'
                        : inspectUser.role === 'ADMIN'
                        ? 'badge-warning'
                        : 'badge-neutral'
                    }`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {inspectUser.role === 'SUPERADMIN' ? 'Full Access' : inspectUser.role === 'ADMIN' ? 'Can Delete' : 'No Delete'}
                  </span>
                </div>
                {canManageRoles && inspectUser.role !== 'SUPERADMIN' && inspectUser.title !== 'CEO' ? (
                  <div style={{ marginTop: '6px' }}>
                    <label style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Change Role (Admin ↔ Employee):
                    </label>
                    <select
                      value={inspectUser.role}
                      onChange={(e) => updateUserRole(inspectUser.id, e.target.value as UserRole)}
                      className="input-field"
                      style={{
                        width: '100%',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.35rem 0.6rem',
                        borderColor:
                          inspectUser.role === 'ADMIN'
                            ? 'var(--status-warning)'
                            : 'var(--border-subtle)',
                        color:
                          inspectUser.role === 'ADMIN'
                            ? 'var(--status-warning)'
                            : 'var(--text-primary)',
                      }}
                    >
                      <option value="ADMIN">ADMIN (Can Delete Projects/Tasks/Modules)</option>
                      <option value="USER">EMPLOYEE (Standard, No Delete)</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {inspectUser.role === 'SUPERADMIN' || inspectUser.title === 'CEO' ? 'CEO / Superadmin (Full Authority)' : inspectUser.role === 'USER' ? 'Employee (Operational, No Delete)' : inspectUser.role}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Assigned Projects
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {projects
                    .filter((p) => p.teamMemberIds.includes(inspectUser.id) || p.projectManagerId === inspectUser.id)
                    .map((p) => (
                      <span key={p.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {p.code} ({p.name})
                      </span>
                    ))}
                </div>
              </div>

              {/* Active Tasks */}
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Active Tasks ({tasks.filter((t) => t.assigneeId === inspectUser.id && t.status !== 'Done').length})
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
