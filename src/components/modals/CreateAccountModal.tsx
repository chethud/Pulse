import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Lock,
  Mail,
  User,
  Briefcase,
  Clock,
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose }) => {
  const { addUser, canCreateAccount } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState('Team Member');
  const [role, setRole] = useState<UserRole>('USER');
  const [department, setDepartment] = useState('Engineering');
  const [capacityHours, setCapacityHours] = useState(40);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canCreateAccount) {
      setError('Permission denied. Only Super Admin can add team members.');
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please provide Name, Email, and Password.');
      return;
    }

    // Default avatars matching style
    const avatarSeeds = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)];

    try {
      addUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        title: title.trim() || 'Team Member',
        role: 'USER',
        department,
        capacityHoursPerWeek: Number(capacityHours) || 40,
        avatar: randomAvatar,
      });

      setSuccessMsg(`${name.trim()} added to the team directory.`);
      setTimeout(() => {
        setSuccessMsg(null);
        setName('');
        setEmail('');
        setPassword('');
        setTitle('Team Member');
        setRole('USER');
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to add person. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="admark-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          borderRadius: '12px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'rgba(230, 57, 70, 0.12)',
                color: 'var(--brand-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UserPlus size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Create User Account</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Only the CEO can provision team credentials and assign security roles.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" style={{ borderRadius: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--status-critical)',
              color: 'var(--status-critical)',
              fontSize: '0.8rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid var(--status-healthy)',
              color: 'var(--status-healthy)',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
              <User
                size={15}
                style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anand Kumar"
                className="input-field"
                style={{ width: '100%', paddingLeft: '38px', height: '38px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Email Address (Login ID) *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                <Mail
                  size={15}
                  style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@pulse.dev"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', height: '38px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Password *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                <Lock
                  size={15}
                  style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', paddingRight: '36px', height: '38px', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-icon"
                  style={{ position: 'absolute', right: '6px', padding: '4px', width: '28px', height: '28px', color: 'var(--text-muted)' }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Role Selection removed — only Tejas (Super Admin) and Harshith (Admin) have roles.
              New people are added as team members for project assignment only. */}
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
            }}
          >
            New people are added as <strong style={{ color: 'var(--text-primary)' }}>team members</strong> only
            (no Admin / Super Admin role). Use them to track who is working on projects.
          </div>

          {/* Job Title & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Job Title
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                <Briefcase
                  size={15}
                  style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Designer, Developer"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', height: '38px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Department
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                <Layers
                  size={15}
                  style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
                />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', height: '38px', boxSizing: 'border-box' }}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">UI / UX Design</option>
                  <option value="QA">Quality Assurance</option>
                  <option value="Management">Management</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weekly Capacity */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Weekly Work Capacity (Hours)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
              <Clock
                size={15}
                style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 2 }}
              />
              <input
                type="number"
                min={10}
                max={60}
                value={capacityHours}
                onChange={(e) => setCapacityHours(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%', paddingLeft: '38px', height: '38px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5" style={{ marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={15} />
              <span>Add Person</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
