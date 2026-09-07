import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  GitPullRequest,
  Flag,
  TestTube2,
  Users2,
  FolderTree,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  projectTab?: string;
  setProjectTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ projectTab = 'overview', setProjectTab }) => {
  const {
    currentView,
    setCurrentView,
    activeRole,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    tasks,
    bugs,
    currentUser,
  } = useApp();

  const [collapsed, setCollapsed] = React.useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Client Portal sidebar view
  if (activeRole === 'CLIENT') {
    return (
      <aside
        style={{
          width: collapsed ? '60px' : '230px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.15s ease',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', height: '52px' }}>
          <div className="flex items-center gap-2.5">
            <img
              src="/admark-logo.png"
              alt="Admark Digitals"
              style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
            />
            {!collapsed && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Client Portal
              </span>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.5rem 0.4rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {[
            { id: 'client-portal', label: 'My Projects', icon: <LayoutDashboard size={15} /> },
            { id: 'client-deliverables', label: 'Deliverables', icon: <CheckSquare size={15} /> },
            { id: 'client-uat', label: 'UAT Testing', icon: <TestTube2 size={15} /> },
            { id: 'client-approvals', label: 'Sign-offs', icon: <Flag size={15} /> },
            { id: 'client-cr', label: 'Change Requests', icon: <GitPullRequest size={15} /> },
            { id: 'client-docs', label: 'Documents', icon: <FolderTree size={15} /> },
          ].map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`sidebar-btn ${active ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '18%',
                      bottom: '18%',
                      width: '3px',
                      backgroundColor: 'var(--brand-crimson)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <div className="sidebar-icon-wrap">{item.icon}</div>
                {!collapsed && (
                  <span style={{ fontSize: '0.8125rem', fontWeight: active ? 600 : 450, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Global Navigation: DELIVERY, QUALITY, ORGANIZATION
  const deliveryItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} strokeWidth={1.8} /> },
    { id: 'my-work', label: 'My Work', icon: <UserCheck size={15} strokeWidth={1.8} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={15} strokeWidth={1.8} /> },
  ];



  const organizationItems = [
    { id: 'clients', label: 'Clients', icon: <Building2 size={15} strokeWidth={1.8} /> },
    { id: 'team', label: 'Team', icon: <Users2 size={15} strokeWidth={1.8} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={15} strokeWidth={1.8} /> },
  ];

  const renderNavGroup = (title: string, items: typeof deliveryItems) => (
    <div style={{ marginBottom: '0.75rem' }}>
      {!collapsed && (
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0.3rem 0.65rem',
            marginBottom: '2px',
          }}
        >
          {title}
        </div>
      )}
      {items.map((item) => {
        const active = (currentView === item.id && !selectedProjectId) || (selectedProjectId !== null && item.id === 'projects');
        return (
          <button
            key={item.id}
            onClick={() => {
              setSelectedProjectId(null);
              setCurrentView(item.id);
            }}
            className={`sidebar-btn ${active ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {/* Small red indicator bar on active item */}
            {active && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '18%',
                  bottom: '18%',
                  width: '3px',
                  backgroundColor: 'var(--brand-crimson)',
                  borderRadius: '0 2px 2px 0',
                }}
              />
            )}
            <div className="sidebar-icon-wrap">{item.icon}</div>
            {!collapsed && (
              <span style={{ fontSize: '0.8125rem', fontWeight: active ? 600 : 450, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      style={{
        width: collapsed ? '60px' : '230px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.15s ease',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Top: Official Admark Digitals Logo */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          height: '52px',
          boxSizing: 'border-box',
        }}
      >
        <img
          src="/admark-logo.png"
          alt="Admark Digitals"
          style={{
            height: '24px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Navigation Sections */}
      <nav
        style={{
          flex: 1,
          padding: '0.65rem 0.4rem',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {renderNavGroup('Delivery', deliveryItems)}
        {renderNavGroup('Organization', organizationItems)}
      </nav>

      {/* Bottom Controls: Settings, User Profile Snippet, Collapse */}
      <div
        style={{
          padding: '0.5rem 0.6rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <button
          onClick={() => {
            setSelectedProjectId(null);
            setCurrentView('settings');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.4rem 0.6rem',
            borderRadius: '4px',
            background: currentView === 'settings' ? 'var(--bg-elevated)' : 'transparent',
            color: currentView === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Settings size={15} />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User profile snippet */}
        {!collapsed && (
          <div
            className="flex items-center gap-2"
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              marginTop: '2px',
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div className="truncate" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }} className="truncate">
                {currentUser.title}
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', justifyContent: 'center', marginTop: '2px', padding: '3px' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
};
