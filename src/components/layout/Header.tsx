import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  User,
  RotateCcw,
  LogOut,
  Database,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SUPABASE_SCHEMA_SQL } from '../../lib/schemaSql';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    theme,
    toggleTheme,
    currentUser,
    logout,
    activeRole,
    setActiveRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCommandPaletteOpen,
    setQuickCreateOpen,
    resetToSeedData,
    supabaseSyncStatus,
    retrySupabaseSync,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);


  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute clean breadcrumbs
  const getBreadcrumbs = () => {
    if (selectedProject) {
      return (
        <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <button
            onClick={() => setSelectedProjectId(null)}
            className="hover:text-primary"
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
          >
            Projects
          </button>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedProject.code}</span>
        </div>
      );
    }

    const viewNames: Record<string, string> = {
      dashboard: 'Dashboard',
      'my-work': 'My Work',
      projects: 'Projects',
      board: 'Delivery Board',
      tasks: 'All Tasks',
      modules: 'Modules',
      releases: 'Releases',
      clients: 'Clients',
      time: 'Time Tracking',
      team: 'Team Workload',
      documents: 'Documents',
      reports: 'Reports',
      settings: 'Settings',
    };

    return (
      <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <span>Delivery</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {viewNames[currentView] || 'Overview'}
        </span>
      </div>
    );
  };

  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Left: Breadcrumbs / Current Location */}
      <div className="flex items-center gap-3">
        {getBreadcrumbs()}
      </div>

      {/* Center: Global Search Bar */}
      <div style={{ maxWidth: '340px', width: '100%', margin: '0 1rem' }}>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.35rem 0.65rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            transition: 'border-color 0.12s ease',
          }}
          className="hover:border-strong"
        >
          <div className="flex items-center gap-2">
            <Search size={13} color="var(--text-muted)" />
            <span style={{ fontSize: '0.78rem' }}>Search projects, tasks, modules...</span>
          </div>
          <kbd
            style={{
              padding: '0.1rem 0.35rem',
              fontSize: '0.68rem',
              background: 'var(--bg-elevated)',
              borderRadius: '3px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-2">
        {/* Supabase Cloud Sync Status Badge */}
        <div className="flex items-center">
          {supabaseSyncStatus === 'connected' && (
            <div
              className="badge badge-healthy flex items-center gap-1.5"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'default' }}
              title="Realtime cloud database active with Supabase"
            >
              <Database size={12} />
              <span>Supabase Live</span>
            </div>
          )}

          {supabaseSyncStatus === 'schema_needed' && (
            <button
              onClick={() => setShowSchemaModal(true)}
              className="badge flex items-center gap-1.5"
              style={{
                padding: '0.2rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--status-warning)',
                borderColor: 'var(--status-warning)',
              }}
              title="Click to run the 1-click database schema setup"
            >
              <AlertCircle size={12} />
              <span>Setup Supabase Tables</span>
            </button>
          )}

          {supabaseSyncStatus === 'syncing' && (
            <div
              className="badge badge-neutral flex items-center gap-1.5"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 600 }}
            >
              <RefreshCw size={11} className="animate-spin" />
              <span>Syncing...</span>
            </div>
          )}

          {supabaseSyncStatus === 'error' && (
            <button
              onClick={() => setShowSchemaModal(true)}
              className="badge badge-critical flex items-center gap-1.5"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
              title="Click to troubleshoot database connection"
            >
              <AlertCircle size={12} />
              <span>Supabase Error</span>
            </button>
          )}
        </div>

        {/* Primary CTA: + Create */}
        <button
          onClick={() => setQuickCreateOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.3rem' }}
        >
          <Plus size={14} />
          <span>Create</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.4rem', position: 'relative', color: 'var(--text-secondary)' }}
            title="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-crimson)',
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div
              className="admark-card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                zIndex: 100,
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.7rem', padding: '1px 4px' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: n.isRead ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                      }}
                      className="hover:bg-card-hover"
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.73rem' }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-sm"
          style={{ padding: '0.4rem', color: 'var(--text-secondary)' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetToSeedData}
          className="btn btn-ghost btn-sm"
          style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
          title="Reset Seed Data"
        >
          <RotateCcw size={14} />
        </button>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.25rem 0.45rem',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            className="hover:bg-card-hover"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--border-strong)',
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {currentUser.title}
              </div>
            </div>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {/* User Profile Menu */}
          {userMenuOpen && (
            <div
              className="admark-card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '220px',
                zIndex: 100,
                boxShadow: 'var(--shadow-md)',
                padding: '0.4rem',
              }}
            >
              {/* User summary */}
              <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {currentUser.email}
                </div>
              </div>

              {/* Standard Links */}
              <div style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    setCurrentView('my-work');
                    setUserMenuOpen(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.4rem 0.65rem' }}
                >
                  <User size={13} />
                  <span>My Work</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setUserMenuOpen(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.4rem 0.65rem' }}
                >
                  <Settings size={13} />
                  <span>Preferences</span>
                </button>
              </div>

              {/* Sign Out */}
              <div style={{ padding: '0.4rem 0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: 'var(--status-danger)',
                    fontSize: '0.75rem',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '6px',
                  }}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supabase Schema Setup Modal */}
      {showSchemaModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowSchemaModal(false)}>
          <div
            className="admark-card"
            style={{ width: '100%', maxWidth: '620px', padding: '1.5rem', borderRadius: '0.75rem', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <div className="flex items-center gap-2">
                <Database size={18} style={{ color: 'var(--brand-crimson)' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Supabase Database Setup</h2>
              </div>
              <button onClick={() => setShowSchemaModal(false)} className="btn btn-ghost btn-icon">
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Your Supabase credentials are connected! To store projects, modules, and tasks permanently in PostgreSQL, run the schema script in your Supabase SQL Editor once.
            </p>

            <div className="flex flex-col gap-3">
              {/* Step 1: Open SQL Editor */}
              <div style={{ background: 'var(--bg-app)', padding: '0.85rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Step 1: Open Supabase SQL Editor
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Opens the query editor in your Supabase project dashboard
                    </div>
                  </div>
                  <a
                    href="https://supabase.com/dashboard/project/mbimqqllqitjmckybyll/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '5px' }}
                  >
                    <span>Open Editor</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Step 2: Copy SQL Script */}
              <div style={{ background: 'var(--bg-app)', padding: '0.85rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Step 2: Copy Schema SQL Script
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Creates tables (projects, modules, tasks, clients) + RLS permissions
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3000);
                    }}
                    className={`btn btn-sm ${copiedSql ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ gap: '5px' }}
                  >
                    {copiedSql ? <Check size={13} style={{ color: 'var(--status-healthy)' }} /> : <Copy size={13} />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Paste and Run */}
              <div style={{ background: 'var(--bg-app)', padding: '0.85rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Step 3: Paste & Click Run in Supabase
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Then click below to test the connection and sync all data immediately.
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setIsRetrying(true);
                      await retrySupabaseSync();
                      setIsRetrying(false);
                      if (supabaseSyncStatus === 'connected') {
                        setShowSchemaModal(false);
                      }
                    }}
                    disabled={isRetrying}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '5px' }}
                  >
                    <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
                    <span>{isRetrying ? 'Checking...' : 'Check & Sync'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2" style={{ marginTop: '1.25rem' }}>
              <button onClick={() => setShowSchemaModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>

  );
};
