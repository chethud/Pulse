import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, users } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed. Please check your credentials.');
        setLoading(false);
      }
    }, 300);
  };

  const handleQuickSelect = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '1.5rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting effects */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.12) 0%, rgba(225, 29, 72, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="admark-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.25rem',
          borderRadius: '1rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
          border: '1px solid var(--border-strong)',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img
            src="/admark-logo.png"
            alt="Admark Digitals"
            style={{ height: '32px', margin: '0 auto 1rem auto', display: 'block' }}
          />
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            Sign in to Pulse
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Enterprise project delivery & team collaboration platform
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--status-danger)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              Work Email Address
            </label>
            <div style={{ position: 'relative', marginTop: '6px' }}>
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@admarkdigitals.com"
                className="input-field"
                style={{ paddingLeft: '34px', height: '40px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Default: password123
              </span>
            </div>
            <div style={{ position: 'relative', marginTop: '6px' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
                style={{
                  paddingLeft: '34px',
                  paddingRight: '36px',
                  height: '40px',
                  fontSize: '0.875rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              height: '42px',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Member Quick-Fill Roster */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Shield size={12} color="var(--brand-crimson)" />
            <span>Select Member to Quick-Fill</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {users.map((u) => {
              const isSelected = email.toLowerCase() === u.email.toLowerCase();
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelect(u.email)}
                  className="admark-card-interactive flex items-center justify-between"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-app)',
                    border: isSelected ? '1px solid var(--brand-crimson)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {u.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        ({u.title})
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--brand-crimson)' : 'var(--text-secondary)' }}>
                    {isSelected ? 'Selected' : 'Use Account'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
