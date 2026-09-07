import React, { useState } from 'react';
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
import { TaskDetailDrawer } from './components/drawers/TaskDetailDrawer';
import { BugDetailDrawer } from './components/drawers/BugDetailDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { QuickCreateModal } from './components/modals/QuickCreateModal';

export function AppContent() {
  const {
    currentView,
    activeRole,
    selectedProjectId,
    setSelectedProjectId,
  } = useApp();

  const [projectTab, setProjectTab] = useState<string>('overview');

  // Determine what view to render
  const renderView = () => {
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
      case 'bugs':
        return <ProjectDetailView currentTab="bugs" setCurrentTab={setProjectTab} />;
      case 'requirements':
        return <ProjectDetailView currentTab="requirements" setCurrentTab={setProjectTab} />;
      case 'change-requests':
        return <ProjectDetailView currentTab="cr" setCurrentTab={setProjectTab} />;
      case 'milestones':
        return <ProjectDetailView currentTab="milestones" setCurrentTab={setProjectTab} />;
      case 'sprints':
        return <ProjectDetailView currentTab="sprints" setCurrentTab={setProjectTab} />;
      case 'testing':
        return <ProjectDetailView currentTab="testing" setCurrentTab={setProjectTab} />;
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
      <BugDetailDrawer />
      <CommandPalette />
      <QuickCreateModal />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
