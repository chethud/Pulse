import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Globe,
  Bell,
  Key,
  GitBranch,
  Sparkles,
  UserPlus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Users,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import { CreateAccountModal } from '../components/modals/CreateAccountModal';
import { EditProfilePhotoModal } from '../components/modals/EditProfilePhotoModal';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    users,
    updateUserRole,
    deleteUser,
    canCreateAccount,
    canManageRoles,
    isSuperAdmin,
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoTargetUser, setPhotoTargetUser] = useState<User | undefined>(undefined);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleOpenPhotoModal = (user?: User) => {
    setPhotoTargetUser(user || currentUser);
    setPhotoModalOpen(true);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Platform Settings & Role Governance
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Admark Digitals workspace configuration, account credentials, and 3-Tier RBAC access control.
        </p>
      </div>

      {/* My Profile & Personal Avatar Card */}
      <div
        className="admark-card"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.05) 0%, var(--bg-card) 60%)',
          border: '1px solid rgba(230, 57, 70, 0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'inline-block',
            }}
            onClick={() => handleOpenPhotoModal(currentUser)}
            title="Click to change your profile photo"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--brand-crimson)',
                boxShadow: '0 4px 14px rgba(230, 57, 70, 0.25)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'var(--brand-crimson)',
                color: '#fff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-card)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              }}
            >
              <Camera size={12} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {currentUser.name}
              </h2>
              <span
                className={`badge ${
                  currentUser.role === 'SUPERADMIN'
                    ? 'badge-critical'
                    : currentUser.role === 'ADMIN'
                    ? 'badge-warning'
                    : 'badge-neutral'
                }`}
                style={{ fontSize: '0.7rem', fontWeight: 700 }}
              >
                {currentUser.role}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {currentUser.title} • {currentUser.department} • <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{currentUser.email}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Your profile photo is displayed across deliverables, assigned projects, task avatars, and time logs. Changes sync locally and to the cloud database.
            </div>
          </div>
        </div>

        <button
          onClick={() => handleOpenPhotoModal(currentUser)}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            padding: '0.55rem 1rem',
            fontWeight: 600,
          }}
        >
          <Camera size={15} style={{ color: 'var(--brand-crimson)' }} />
          <span>Change Profile Photo</span>
        </button>
      </div>

      {/* Role-Based Access Control & User Provisioning Section */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: '1rem' }}>
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(230, 57, 70, 0.12)',
                color: 'var(--brand-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                User Accounts & Role Permissions
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage account provisioning, credentials, and delete privileges.
              </p>
            </div>
          </div>

          {canCreateAccount ? (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}
            >
              <UserPlus size={15} />
              <span>+ Create Account</span>
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <Lock size={13} />
              <span>Account creation restricted to CEO</span>
            </div>
          )}
        </div>

        {/* Roles explainer cards */}
        <div className="grid grid-cols-3 gap-3" style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-app)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--brand-crimson)' }}>
                SUPERADMIN (CEO)
              </span>
              <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>Full Access</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              • Only role that can create accounts<br />
              • Can assign & modify user roles<br />
              • Full delete authority on projects, modules & tasks
            </p>
          </div>

          <div
            style={{
              padding: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-app)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--status-warning)' }}>
                ADMIN (COO / CFO)
              </span>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Can Delete</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              • Delete privileges for projects, modules & tasks<br />
              • Manage deliverables & team operations<br />
              • <strong>Cannot</strong> create accounts or change roles
            </p>
          </div>

          <div
            style={{
              padding: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-app)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                USER (Developers / Interns)
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>No Delete</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              • Standard operational workflow<br />
              • Log time, complete modules, update tasks<br />
              • <strong>No delete options</strong> anywhere in the system
            </p>
          </div>
        </div>

        {/* User Accounts Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.65rem 0.85rem' }}>Team Member</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Email (Login ID)</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Password</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Department</th>
                <th style={{ padding: '0.65rem 0.85rem' }}>Role Assignment</th>
                {canManageRoles && <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                const isCEO = u.role === 'SUPERADMIN' || u.title === 'CEO' || u.name.toLowerCase().includes('jois');
                const showPwd = showPasswords[u.id];

                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{ position: 'relative', cursor: 'pointer' }}
                          onClick={() => handleOpenPhotoModal(u)}
                          title={`Click to change photo for ${u.name}`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: isCurrent ? '1.5px solid var(--brand-crimson)' : '1px solid var(--border-subtle)',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: -2,
                              right: -2,
                              width: '13px',
                              height: '13px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--brand-crimson)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid var(--bg-card)',
                            }}
                          >
                            <Camera size={7} />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {u.name} {isCurrent && <span style={{ color: 'var(--brand-crimson)', fontSize: '0.7rem' }}>(You)</span>}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.title}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {showPwd ? (u.password || 'password123') : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="btn btn-ghost btn-icon"
                          style={{ padding: '2px', width: '20px', height: '20px' }}
                          title={showPwd ? 'Hide password' : 'Show password'}
                        >
                          {showPwd ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)' }}>
                      {u.department || 'Engineering'}
                    </td>

                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      {canManageRoles && !isCEO ? (
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                          className="input-field"
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            width: 'auto',
                            borderColor:
                              u.role === 'SUPERADMIN'
                                ? 'var(--brand-crimson)'
                                : u.role === 'ADMIN'
                                ? 'var(--status-warning)'
                                : 'var(--border-subtle)',
                          }}
                        >
                          <option value="SUPERADMIN">SUPERADMIN (Full)</option>
                          <option value="ADMIN">ADMIN (Can Delete)</option>
                          <option value="USER">USER (No Delete)</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${
                            u.role === 'SUPERADMIN' || isCEO
                              ? 'badge-critical'
                              : u.role === 'ADMIN'
                              ? 'badge-warning'
                              : 'badge-neutral'
                          }`}
                          style={{ fontSize: '0.7rem', fontWeight: 700 }}
                        >
                          {isCEO ? 'SUPERADMIN (CEO)' : u.role}
                        </span>
                      )}
                    </td>

                    {canManageRoles && (
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                        {!isCEO && !isCurrent && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete account for ${u.name}? This cannot be undone.`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="btn btn-ghost btn-icon"
                            title="Delete Account"
                            style={{ color: 'var(--status-critical)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Settings */}
      <div className="admark-card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={15} color="var(--brand-crimson)" />
          <span>Organization Profile</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Company Brand Name</label>
            <input type="text" readOnly value="Admark Digitals" className="input-field" style={{ marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Default Timezone</label>
            <input type="text" readOnly value="UTC+05:30 (IST) & GMT (London)" className="input-field" style={{ marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Weekly Working Capacity</label>
            <input type="text" readOnly value="40 Hours / Developer" className="input-field" style={{ marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Client Tenant Isolation</label>
            <input type="text" readOnly value="Enabled (Multi-Tenant Secure Partition)" className="input-field" style={{ marginTop: '4px' }} />
          </div>
        </div>
      </div>

      {/* RBAC Role Permissions Matrix Preview */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--brand-crimson)" />
          <span>RBAC Matrix & Scope Guard</span>
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Role Level</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Account Creation</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Delete Permission</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Role Assignment</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Projects & Delivery</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Tasks & Code</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  role: 'SUPERADMIN (CEO)',
                  acc: 'Granted (CEO Exclusive)',
                  del: 'Full Delete Access',
                  assign: 'Granted',
                  proj: 'Create, Edit, Delete',
                  tasks: 'Full Access',
                  isCritical: true,
                },
                {
                  role: 'ADMIN (COO / CFO)',
                  acc: 'Restricted (CEO Only)',
                  del: 'Granted (Can Delete)',
                  assign: 'Restricted',
                  proj: 'Edit, Manage, Delete',
                  tasks: 'Full Access & Delete',
                  isWarning: true,
                },
                {
                  role: 'USER (Developer / Intern)',
                  acc: 'Restricted (CEO Only)',
                  del: 'Strictly Disabled (No Delete)',
                  assign: 'Restricted',
                  proj: 'View & Contribute',
                  tasks: 'View, Update Status, Log Time',
                  isNeutral: true,
                },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.role}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className={`badge ${row.isCritical ? 'badge-healthy' : 'badge-neutral'}`}>
                      {row.acc}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className={`badge ${row.isCritical || row.isWarning ? 'badge-healthy' : 'badge-critical'}`}>
                      {row.del}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span className={`badge ${row.isCritical ? 'badge-healthy' : 'badge-neutral'}`}>
                      {row.assign}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.proj}</td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>{row.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Connections */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch size={18} color="var(--brand-crimson)" />
          <span>Connected Ecosystem Integrations</span>
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'GitHub Enterprise', desc: 'Sync PR status, commits, and automated branch linking', connected: true },
            { name: 'Figma Cloud', desc: 'Embed live design tokens and interactive prototypes', connected: true },
            { name: 'Stripe Webhooks', desc: 'Real-time billing, deposit holding, and currency FX sync', connected: true },
            { name: 'SendGrid & WhatsApp', desc: 'Client automated milestone alerts and itinerary dispatches', connected: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between" style={{ padding: '0.85rem', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <span className="badge badge-healthy">Connected</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Creation Modal */}
      <CreateAccountModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />

      {/* Profile Photo Edit Modal */}
      <EditProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        targetUser={photoTargetUser}
      />
    </div>
  );
};
