import React, { useState, useLayoutEffect, useRef } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { MyWorkView } from './views/MyWorkView';
import { ClientsView } from './views/ClientsView';
import { ProjectsListView } from './views/ProjectsListView';
import { ProjectDetailView } from './views/project/ProjectDetailView';
import { ClientPortalView } from './views/client/ClientPortalView';
import { TimeTrackingView } from './views/TimeTrackingView';
import { TeamCapacityView } from './views/TeamCapacityView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { AllTasksView } from './views/AllTasksView';
import { PhotoAdminView } from './views/PhotoAdminView';
import { TaskDetailDrawer } from './components/drawers/TaskDetailDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { QuickCreateModal } from './components/modals/QuickCreateModal';
import { LoginView } from './views/LoginView';

export function AppContent() {
  const {
    isAuthenticated,
    currentView,
    activeRole,
    selectedProjectId,
    setSelectedProjectId,
    isPhotoAdmin,
  } = useApp();

  const [projectTab, setProjectTab] = useState<string>('overview');
  const prevProjectIdRef = useRef<string | null>(null);

  // Land on Overview whenever a different project is opened (e.g. from My Work)
  useLayoutEffect(() => {
    if (selectedProjectId && selectedProjectId !== prevProjectIdRef.current) {
      setProjectTab('overview');
    }
    prevProjectIdRef.current = selectedProjectId;
  }, [selectedProjectId]);

  // If user is not signed in, show the login screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Determine what view to render
  const renderView = () => {
    // Photo Admin: restricted workspace — only profile photo management
    if (isPhotoAdmin || currentView === 'photo-admin' || activeRole === 'PHOTO_ADMIN') {
      return <PhotoAdminView />;
    }

    // If activeRole is CLIENT or viewing client-portal
    if (activeRole === 'CLIENT' || currentView === 'client-portal' || currentView.startsWith('client-')) {
      return <ClientPortalView />;
    }

    // If viewing inside a project
    if (selectedProjectId) {
      return <ProjectDetailView currentTab={projectTab} setCurrentTab={setProjectTab} />;
    }

    // Global views
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'my-work':
        return <MyWorkView />;
      case 'clients':
        return <ClientsView />;
      case 'projects':
        return <ProjectsListView />;
      case 'tasks':
        return <AllTasksView initialMode="table" />;
      case 'board':
        return <AllTasksView initialMode="board" />;
      case 'requirements':
        return <ProjectDetailView currentTab="requirements" setCurrentTab={setProjectTab} />;
      case 'change-requests':
        return <ProjectDetailView currentTab="cr" setCurrentTab={setProjectTab} />;
      case 'modules':
      case 'milestones':
        return <ProjectDetailView currentTab="modules" setCurrentTab={setProjectTab} />;
      case 'sprints':
        return <ProjectDetailView currentTab="sprints" setCurrentTab={setProjectTab} />;

      case 'releases':
      case 'documents':
        return <ProjectDetailView currentTab="overview" setCurrentTab={setProjectTab} />;
      case 'time':
        return <TimeTrackingView />;
      case 'team':
        return <TeamCapacityView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex w-full" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Fixed Left Sidebar */}
      <Sidebar projectTab={projectTab} setProjectTab={setProjectTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0" style={{ minHeight: '100vh' }}>
        {/* Top Header */}
        <Header />

        {/* Scrollable View Content */}
        <main className="flex-1" style={{ minWidth: 0, overflowY: 'auto' }}>
          {renderView()}
        </main>
      </div>

      {/* Drawers and Modals */}
      <TaskDetailDrawer />
      <CommandPalette />
      <QuickCreateModal />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
