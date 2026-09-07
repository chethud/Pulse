import React, { useState } from 'react';
import { Camera, Search, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { EditProfilePhotoModal } from '../components/modals/EditProfilePhotoModal';

export const PhotoAdminView: React.FC = () => {
  const { users, currentUser, canManageProfilePhotos } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoTargetUser, setPhotoTargetUser] = useState<User | undefined>(undefined);

  if (!canManageProfilePhotos) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        You do not have permission to manage profile photos.
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.title || '').toLowerCase().includes(q) ||
      (u.department || '').toLowerCase().includes(q)
    );
  });

  const handleOpenPhotoModal = (user: User) => {
    setPhotoTargetUser(user);
    setPhotoModalOpen(true);
  };

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Profile Photo Manager
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Only this account can update profile photos for every team member.
          </p>
        </div>
        <div
          className="badge badge-critical"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700 }}
        >
          <ShieldCheck size={13} />
          <span>Exclusive Photo Access</span>
        </div>
      </div>

      <div
        className="admark-card"
        style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(225, 29, 72, 0.06)',
          borderColor: 'rgba(225, 29, 72, 0.25)',
        }}
      >
        <Camera size={16} style={{ color: 'var(--brand-crimson)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Signed in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong>. Other users cannot
          change their own photos — all avatar updates must be done from this screen.
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: '320px' }}>
        <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team members..."
          className="input-field"
          style={{ paddingLeft: '26px', height: '28px', fontSize: '0.78rem' }}
        />
      </div>

      <div className="admark-card" style={{ overflow: 'hidden' }}>
        <table className="admark-table" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '34%' }}>Team Member</th>
              <th style={{ width: '28%' }}>Email</th>
              <th style={{ width: '18%' }}>Role</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Photo Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const isCurrent = u.id === currentUser.id;
              return (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isCurrent ? '1.5px solid var(--brand-crimson)' : '1px solid var(--border-subtle)',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }} className="truncate">
                          {u.name}
                          {isCurrent && (
                            <span style={{ color: 'var(--brand-crimson)', fontSize: '0.7rem', marginLeft: '6px' }}>(You)</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} className="truncate">
                          {u.title} • {u.department || 'Team'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="truncate">
                    {u.email}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'SUPERADMIN' || u.role === 'PHOTO_ADMIN'
                          ? 'badge-critical'
                          : u.role === 'ADMIN'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                      style={{ fontSize: '0.68rem', fontWeight: 700 }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenPhotoModal(u)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 600,
                      }}
                    >
                      <Camera size={13} style={{ color: 'var(--brand-crimson)' }} />
                      <span>Change Photo</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <EditProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        targetUser={photoTargetUser}
      />
    </div>
  );
};
