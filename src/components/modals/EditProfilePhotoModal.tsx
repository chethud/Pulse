import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Link2,
  Check,
  Sparkles,
  User as UserIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

interface EditProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: User;
}

// Curated professional avatars for instant 1-click selection
const PRESET_AVATARS = [
  {
    name: 'Tech Lead (Male)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Executive (Male)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Developer (Male)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Finance / Admin (Male)',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Engineer (Male)',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Product Lead (Female)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'UI/UX Designer (Female)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Senior Engineer (Female)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Architect (Male)',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Engineering Manager (Male)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  },
];

export const EditProfilePhotoModal: React.FC<EditProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  targetUser,
}) => {
  const { currentUser, updateUserProfile, canManageProfilePhotos } = useApp();
  const user = targetUser || currentUser;

  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  if (!canManageProfilePhotos) {
    return (
      <div className="modal-backdrop animate-fade-in" onClick={onClose}>
        <div
          className="admark-card"
          style={{ width: '100%', maxWidth: '420px', padding: '1.5rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Photo change restricted</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Only the Photo Admin account (<strong>photo@gmail.com</strong>) can update profile photos for team members.
          </p>
          <div className="flex justify-end" style={{ marginTop: '1rem' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle local file selection from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorNotice('Image file must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
        setErrorNotice('');
      }
    };
    reader.onerror = () => {
      setErrorNotice('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setAvatarPreview(customUrl.trim());
    setErrorNotice('');
  };

  const handleSave = () => {
    if (!avatarPreview.trim()) {
      setErrorNotice('Please select or upload a profile photo.');
      return;
    }

    updateUserProfile(user.id, { avatar: avatarPreview.trim() });
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="admark-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '1.5rem',
          borderRadius: '0.85rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(230, 57, 70, 0.12)',
                color: 'var(--brand-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Change Profile Photo
              </h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                {user.name} • {user.title} ({user.department || 'Engineering'})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Live Profile Photo Preview Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1rem',
            background: 'var(--bg-elevated)',
            borderRadius: '0.65rem',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={user.name}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--brand-crimson)',
                boxShadow: '0 4px 14px rgba(230, 57, 70, 0.25)',
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-crimson)',
                color: '#fff',
                border: '2px solid var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Upload new image"
            >
              <Camera size={13} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {user.email}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Accepts JPG, PNG, WebP from your computer, external image links, or preset avatars.
            </div>
          </div>
        </div>

        {/* Source Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
          >
            <Upload size={13} style={{ marginRight: '5px' }} />
            <span>Upload Device Image</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`tab-button ${activeTab === 'presets' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
          >
            <Sparkles size={13} style={{ marginRight: '5px' }} />
            <span>Choose Preset</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`tab-button ${activeTab === 'url' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
          >
            <Link2 size={13} style={{ marginRight: '5px' }} />
            <span>Image URL</span>
          </button>
        </div>

        {/* TAB 1: Upload from Device */}
        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-strong)',
                borderRadius: '8px',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.01)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-crimson)';
                e.currentTarget.style.background = 'rgba(230, 57, 70, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(230, 57, 70, 0.1)',
                  color: 'var(--brand-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem auto',
                }}
              >
                <Upload size={20} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Click to browse and upload photo
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                PNG, JPG, WebP up to 5MB
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Curated Presets */}
        {activeTab === 'presets' && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              Select any profile photo from the professional library:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                maxHeight: '190px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {PRESET_AVATARS.map((preset, idx) => {
                const isSelected = avatarPreview === preset.url;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setAvatarPreview(preset.url);
                      setErrorNotice('');
                    }}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid var(--brand-crimson)' : '2px solid transparent',
                      boxShadow: isSelected ? '0 0 10px rgba(230, 57, 70, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                      aspectRatio: '1',
                    }}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--brand-crimson)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Custom Web URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleApplyUrl} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Direct Image Link (HTTPS URL)
              </label>
              <div className="flex gap-2" style={{ marginTop: '4px' }}>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://github.com/..."
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  Preview
                </button>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Paste any publicly accessible image link from Gravatar, Unsplash, LinkedIn, or GitHub.
              </div>
            </div>
          </form>
        )}

        {/* Error / Success Notifications */}
        {errorNotice && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              color: '#ef4444',
              fontSize: '0.75rem',
            }}
          >
            {errorNotice}
          </div>
        )}

        {successNotice && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              color: '#10b981',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={14} />
            <span>Profile photo updated and synchronized!</span>
          </div>
        )}

        {/* Footer Actions */}
        <div
          className="flex items-center justify-end gap-2"
          style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Check size={14} />
            <span>Save Profile Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
