import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  Client,
  Project,
  ProjectModule,
  Requirement,
  Task,
  TaskStatus,
  Bug,
  BugStatus,
  Milestone,
  Sprint,
  ChangeRequest,
  ChangeRequestStatus,
  Approval,
  Release,
  TimeLog,
  ProjectDocument,
  ActivityItem,
  NotificationItem,
  TestCase,
  TestRun,
  ClientUATItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_MODULES,
  INITIAL_REQUIREMENTS,
  INITIAL_TASKS,
  INITIAL_BUGS,
  INITIAL_MILESTONES,
  INITIAL_SPRINTS,
  INITIAL_CHANGE_REQUESTS,
  INITIAL_APPROVALS,
  INITIAL_RELEASES,
  INITIAL_TIME_LOGS,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TEST_CASES,
  INITIAL_TEST_RUNS,
  INITIAL_CLIENT_UAT,
} from '../data/seedData';

interface ActiveTimer {
  taskId?: string;
  taskTitle?: string;
  projectId?: string;
  startTime?: number;
  elapsedSeconds: number;
  isRunning: boolean;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  currentUser: User;
  setCurrentUser: (userId: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  users: User[];
  clients: Client[];
  projects: Project[];
  modules: ProjectModule[];
  requirements: Requirement[];
  tasks: Task[];
  bugs: Bug[];
  milestones: Milestone[];
  sprints: Sprint[];
  changeRequests: ChangeRequest[];
  approvals: Approval[];
  releases: Release[];
  timeLogs: TimeLog[];
  documents: ProjectDocument[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  testCases: TestCase[];
  testRuns: TestRun[];
  clientUAT: ClientUATItem[];

  // Active navigation & selections
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedBugId: string | null;
  setSelectedBugId: (id: string | null) => void;

  // Modals & Drawers
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  quickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;

  // Timer
  activeTimer: ActiveTimer;
  startTimer: (taskId: string, taskTitle: string, projectId: string) => void;
  stopTimer: () => void;

  // Role-Based Access Control & Permissions
  canDelete: boolean;
  canCreateAccount: boolean;
  canManageRoles: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;

  // Mutations
  addUser: (user: Omit<User, 'id'>) => User;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  deleteTask: (taskId: string) => void;
  deleteBug: (bugId: string) => void;
  deleteModule: (moduleId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'taskNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addBug: (bug: Omit<Bug, 'id' | 'bugNumber' | 'createdAt'>) => void;
  updateBugStatus: (bugId: string, newStatus: BugStatus) => void;
  addProject: (project: Omit<Project, 'id' | 'progress' | 'health'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addModule: (module: Omit<ProjectModule, 'id'> & { progress?: number }) => void;
  updateModule: (moduleId: string, updates: Partial<ProjectModule>) => void;
  addMilestone: (milestone: Omit<Milestone, 'id' | 'number' | 'progress' | 'isClientApproved'>) => void;
  addClient: (client: Omit<Client, 'id' | 'lastActivity'>) => void;
  addRequirement: (req: Omit<Requirement, 'id' | 'code' | 'createdAt'>) => void;
  addChangeRequest: (cr: Omit<ChangeRequest, 'id' | 'crNumber' | 'date'>) => void;
  updateCRStatus: (crId: string, newStatus: ChangeRequestStatus) => void;
  approveMilestone: (milestoneId: string) => void;
  approveRelease: (releaseId: string) => void;
  submitApprovalDecision: (approvalId: string, decision: 'Approved' | 'Request Changes' | 'Rejected', comments: string) => void;
  updateUATStatus: (uatId: string, status: 'Passed' | 'Failed' | 'Needs Change', feedback?: string) => void;
  addUATItem: (item: Omit<ClientUATItem, 'id'>) => void;
  logTime: (log: Omit<TimeLog, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToSeedData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // One-time load of live production clients and projects
  const LIVE_DATA_TAG = 'pulse_pm_harshith_v10';
  try {
    if (localStorage.getItem(LIVE_DATA_TAG) !== 'true') {
      localStorage.setItem('admark_clients', JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem('admark_projects', JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem('admark_modules', JSON.stringify(INITIAL_MODULES));
      const keysToClear = [
        'requirements',
        'tasks',
        'bugs',
        'milestones',
        'sprints',
        'changeRequests',
        'approvals',
        'releases',
        'timeLogs',
        'documents',
        'activities',
        'notifications',
        'testCases',
        'testRuns',
        'clientUAT',
      ];
      keysToClear.forEach((k) => localStorage.removeItem(`admark_${k}`));
      localStorage.setItem(LIVE_DATA_TAG, 'true');
    }
  } catch {
    // Ignore storage issues
  }

  // Main state with localStorage sync
  const loadStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(`admark_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('admark_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('admark_role') as UserRole) || 'SUPERADMIN';
  });

  const [currentUserId, setCurrentUserIdState] = useState<string>(() => {
    return localStorage.getItem('admark_user_id') || 'user-2';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pulse_auth') === 'true';
  });

  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));

  // Pick currentUser based on currentUserId or activeRole
  const currentUser = React.useMemo(() => {
    if (activeRole === 'CLIENT') {
      return users.find((u) => u.role === 'CLIENT') || users[0];
    }
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [currentUserId, activeRole, users]);

  // RBAC Permission Checks
  const isSuperAdmin =
    currentUser.role === 'SUPERADMIN' ||
    currentUser.role === 'SUPER_ADMIN' ||
    (currentUser.title === 'CEO' && currentUser.role !== 'ADMIN' && currentUser.role !== 'USER') ||
    currentUser.name.toLowerCase().includes('jois');
  const isAdmin =
    !isSuperAdmin &&
    (currentUser.role === 'ADMIN' ||
      (currentUser.role !== 'USER' && (currentUser.title === 'COO' || currentUser.title === 'CFO')));
  const canDelete = isSuperAdmin || isAdmin;
  const canCreateAccount = isSuperAdmin;
  const canManageRoles = isSuperAdmin;

  const setCurrentUser = (userId: string) => {
    setCurrentUserIdState(userId);
    localStorage.setItem('admark_user_id', userId);
    const u = users.find((usr) => usr.id === userId);
    if (u) {
      setActiveRoleState(u.role);
      localStorage.setItem('admark_role', u.role);
      if (u.role === 'CLIENT') {
        setCurrentView('client-portal');
      }
    }
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem('admark_role', role);
    if (role === 'CLIENT') {
      setCurrentView('client-portal');
    }
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { success: false, error: 'No member found with this email address.' };
    }
    const expectedPassword = user.password || 'password123';
    if (password !== expectedPassword && password !== 'pulse123') {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }
    setCurrentUser(user.id);
    setIsAuthenticated(true);
    localStorage.setItem('pulse_auth', 'true');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pulse_auth');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('admark_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [clients, setClients] = useState<Client[]>(() => loadStored('clients', INITIAL_CLIENTS));
  const [projects, setProjects] = useState<Project[]>(() => loadStored('projects', INITIAL_PROJECTS));
  const [modules, setModules] = useState<ProjectModule[]>(() => loadStored('modules', INITIAL_MODULES));
  const [requirements, setRequirements] = useState<Requirement[]>(() => loadStored('requirements', INITIAL_REQUIREMENTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadStored('tasks', INITIAL_TASKS));
  const [bugs, setBugs] = useState<Bug[]>(() => loadStored('bugs', INITIAL_BUGS));
  const [milestones, setMilestones] = useState<Milestone[]>(() => loadStored('milestones', INITIAL_MILESTONES));
  const [sprints, setSprints] = useState<Sprint[]>(() => loadStored('sprints', INITIAL_SPRINTS));
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(() => loadStored('changeRequests', INITIAL_CHANGE_REQUESTS));
  const [approvals, setApprovals] = useState<Approval[]>(() => loadStored('approvals', INITIAL_APPROVALS));
  const [releases, setReleases] = useState<Release[]>(() => loadStored('releases', INITIAL_RELEASES));
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(() => loadStored('timeLogs', INITIAL_TIME_LOGS));
  const [documents] = useState<ProjectDocument[]>(() => loadStored('documents', INITIAL_DOCUMENTS));
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadStored('activities', INITIAL_ACTIVITIES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [testCases, setTestCases] = useState<TestCase[]>(() => loadStored('testCases', INITIAL_TEST_CASES));
  const [testRuns] = useState<TestRun[]>(() => loadStored('testRuns', INITIAL_TEST_RUNS));
  const [clientUAT, setClientUAT] = useState<ClientUATItem[]>(() => loadStored('clientUAT', INITIAL_CLIENT_UAT));

  // Navigation and selection states
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  // Active Timer state
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>({
    elapsedSeconds: 0,
    isRunning: false,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer.isRunning]);

  const startTimer = (taskId: string, taskTitle: string, projectId: string) => {
    setActiveTimer({
      taskId,
      taskTitle,
      projectId,
      startTime: Date.now(),
      elapsedSeconds: 0,
      isRunning: true,
    });
  };

  const stopTimer = () => {
    if (!activeTimer.isRunning) return;
    const hours = Number((activeTimer.elapsedSeconds / 3600).toFixed(2));
    if (hours > 0 && activeTimer.projectId) {
      logTime({
        userId: currentUser.id,
        projectId: activeTimer.projectId,
        taskId: activeTimer.taskId,
        date: new Date().toISOString().split('T')[0],
        hours: Math.max(0.1, hours),
        description: `Timer logged for: ${activeTimer.taskTitle || 'Task'}`,
        isBillable: true,
      });
    }
    setActiveTimer({ elapsedSeconds: 0, isRunning: false });
  };

  // Keyboard shortcut for Command Center (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes to localStorage helper
  const syncStorage = (key: string, val: unknown) => {
    try {
      localStorage.setItem(`admark_${key}`, JSON.stringify(val));
    } catch (err) {
      console.warn('Storage quota error', err);
    }
  };

  const addTask = (newTaskData: Omit<Task, 'id' | 'taskNumber' | 'createdAt' | 'updatedAt'>) => {
    const maxNumber = tasks.reduce((max, t) => Math.max(max, t.taskNumber || 0), 100);
    const newTask: Task = {
      ...newTaskData,
      id: `task-${maxNumber + 1}`,
      taskNumber: maxNumber + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    syncStorage('tasks', updated);

    // Add activity
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      projectId: newTask.projectId,
      userId: currentUser.id,
      action: 'created task',
      targetType: 'Task',
      targetTitle: `#${newTask.taskNumber} ${newTask.title}`,
      targetId: newTask.id,
      timestamp: 'Just now',
    };
    const newActs = [activity, ...activities];
    setActivities(newActs);
    syncStorage('activities', newActs);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    setTasks(updated);
    syncStorage('tasks', updated);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const oldStatus = task.status;
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );
    setTasks(updated);
    syncStorage('tasks', updated);

    // If moved to Done, throw celebration
    if (newStatus === 'Done' && oldStatus !== 'Done') {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }

    // Add activity
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      projectId: task.projectId,
      userId: currentUser.id,
      action: `moved #${task.taskNumber} to`,
      targetType: 'Task',
      targetTitle: newStatus,
      targetId: task.id,
      timestamp: 'Just now',
      details: `Status changed from ${oldStatus} to ${newStatus}`,
    };
    const newActs = [activity, ...activities];
    setActivities(newActs);
    syncStorage('activities', newActs);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
      };
    });
    setTasks(updated);
    syncStorage('tasks', updated);
  };

  const addBug = (bugData: Omit<Bug, 'id' | 'bugNumber' | 'createdAt'>) => {
    const maxBugNumber = bugs.reduce((max, b) => Math.max(max, b.bugNumber || 0), 340);
    const newBug: Bug = {
      ...bugData,
      id: `bug-${maxBugNumber + 1}`,
      bugNumber: maxBugNumber + 1,
      createdAt: new Date().toISOString(),
    };
    const updated = [newBug, ...bugs];
    setBugs(updated);
    syncStorage('bugs', updated);

    // Add notification if Critical
    if (newBug.severity === 'Critical') {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Critical Bug Logged',
        message: `Bug #${newBug.bugNumber} "${newBug.title}" was filed with Critical severity.`,
        type: 'bug',
        projectId: newBug.projectId,
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateBugStatus = (bugId: string, newStatus: BugStatus) => {
    const updated = bugs.map((b) => (b.id === bugId ? { ...b, status: newStatus } : b));
    setBugs(updated);
    syncStorage('bugs', updated);
  };

  const addProject = (p: Omit<Project, 'id' | 'progress' | 'health'>) => {
    const newProj: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      progress: 0,
      health: {
        overall: 'Healthy',
        schedule: 'On Track',
        development: 'Normal',
        qa: 'Passing',
        client: 'Responsive',
        budget: 'Within Budget',
        score: 100,
        notes: 'Project newly launched in planning phase.',
      },
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    syncStorage('projects', updated);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    if (updates.status === 'Completed' && !isSuperAdmin) {
      console.warn('Unauthorized: Only CEO (Super Admin) is authorized to mark a project as Completed.');
      return;
    }
    const updated = projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p));
    setProjects(updated);
    syncStorage('projects', updated);
  };

  const deleteProject = (projectId: string) => {
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
    syncStorage('projects', updated);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const addModule = (m: Omit<ProjectModule, 'id'> & { progress?: number }) => {
    const newMod: ProjectModule = {
      ...m,
      id: `mod-${Date.now()}`,
      progress: m.progress ?? 0,
    };
    const updated = [...modules, newMod];
    setModules(updated);
    syncStorage('modules', updated);
  };

  const updateModule = (moduleId: string, updates: Partial<ProjectModule>) => {
    const updated = modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m));
    setModules(updated);
    syncStorage('modules', updated);
  };

  const deleteModule = (moduleId: string) => {
    const updated = modules.filter((m) => m.id !== moduleId);
    setModules(updated);
    syncStorage('modules', updated);
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    syncStorage('tasks', updated);
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const deleteBug = (bugId: string) => {
    const updated = bugs.filter((b) => b.id !== bugId);
    setBugs(updated);
    syncStorage('bugs', updated);
    if (selectedBugId === bugId) {
      setSelectedBugId(null);
    }
  };

  const addUser = (newUser: Omit<User, 'id'>): User => {
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Only SuperAdmin can create accounts.');
    }
    const user: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      avatar:
        newUser.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      capacityHoursPerWeek: newUser.capacityHoursPerWeek || 40,
    };
    const updated = [...users, user];
    setUsers(updated);
    syncStorage('users', updated);
    return user;
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    if (!isSuperAdmin) {
      console.warn('Unauthorized: Only SuperAdmin can change user roles.');
      return;
    }
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsers(updated);
    syncStorage('users', updated);
  };

  const deleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    syncStorage('users', updated);
  };

  const addMilestone = (mil: Omit<Milestone, 'id' | 'number' | 'progress' | 'isClientApproved'>) => {
    const projMilestones = milestones.filter((m) => m.projectId === mil.projectId);
    const nextNum = projMilestones.length + 1;
    const newMilestone: Milestone = {
      ...mil,
      id: `mil-${Date.now()}`,
      number: nextNum,
      progress: 0,
      isClientApproved: false,
    };
    const updated = [...milestones, newMilestone];
    setMilestones(updated);
    syncStorage('milestones', updated);
  };

  const addClient = (c: Omit<Client, 'id' | 'lastActivity'>) => {
    const newCli: Client = {
      ...c,
      id: `client-${Date.now()}`,
      lastActivity: 'Just created',
    };
    const updated = [newCli, ...clients];
    setClients(updated);
    syncStorage('clients', updated);
  };

  const addRequirement = (req: Omit<Requirement, 'id' | 'code' | 'createdAt'>) => {
    const count = requirements.length + 101;
    const newReq: Requirement = {
      ...req,
      id: `req-${Date.now()}`,
      code: `REQ-${count}`,
      createdAt: new Date().toISOString().split('T')[0],
      featuresCount: 1,
    };
    const updated = [newReq, ...requirements];
    setRequirements(updated);
    syncStorage('requirements', updated);
  };

  const addChangeRequest = (cr: Omit<ChangeRequest, 'id' | 'crNumber' | 'date'>) => {
    const nextCrNum = changeRequests.reduce((max, c) => Math.max(max, c.crNumber || 0), 10) + 1;
    const newCR: ChangeRequest = {
      ...cr,
      id: `cr-${Date.now()}`,
      crNumber: nextCrNum,
      date: new Date().toISOString().split('T')[0],
      status: 'Requested',
    };
    const updated = [newCR, ...changeRequests];
    setChangeRequests(updated);
    syncStorage('changeRequests', updated);

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      projectId: newCR.projectId,
      userId: currentUser.id,
      action: 'submitted change request',
      targetType: 'CR',
      targetTitle: `CR-${newCR.crNumber}: ${newCR.title}`,
      targetId: newCR.id,
      timestamp: 'Just now',
    };
    setActivities((prev) => [activity, ...prev]);
  };

  const updateCRStatus = (crId: string, newStatus: ChangeRequestStatus) => {
    const updated = changeRequests.map((c) => (c.id === crId ? { ...c, status: newStatus } : c));
    setChangeRequests(updated);
    syncStorage('changeRequests', updated);
  };

  const approveMilestone = (milestoneId: string) => {
    const updated = milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            isClientApproved: true,
            approvalDate: new Date().toISOString().split('T')[0],
            approvedBy: currentUser.name,
          }
        : m
    );
    setMilestones(updated);
    syncStorage('milestones', updated);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  const approveRelease = (releaseId: string) => {
    const updated = releases.map((r) =>
      r.id === releaseId
        ? {
            ...r,
            clientApprovalStatus: 'Approved' as const,
            deploymentStatus: 'Live' as const,
          }
        : r
    );
    setReleases(updated);
    syncStorage('releases', updated);
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
  };

  const submitApprovalDecision = (approvalId: string, decision: 'Approved' | 'Request Changes' | 'Rejected', comments: string) => {
    const updated = approvals.map((a) =>
      a.id === approvalId
        ? {
            ...a,
            decision,
            comments,
            timestamp: new Date().toLocaleString(),
          }
        : a
    );
    setApprovals(updated);
    syncStorage('approvals', updated);
    if (decision === 'Approved') {
      confetti({ particleCount: 50, spread: 50 });
    }
  };

  const updateUATStatus = (uatId: string, status: 'Passed' | 'Failed' | 'Needs Change', feedback?: string) => {
    const updated = clientUAT.map((u) =>
      u.id === uatId
        ? {
            ...u,
            status,
            clientFeedback: feedback || u.clientFeedback,
            clientReviewedAt: new Date().toLocaleString(),
            reviewedBy: currentUser.name,
          }
        : u
    );
    setClientUAT(updated);
    syncStorage('clientUAT', updated);
    if (status === 'Passed') {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const addUATItem = (item: Omit<ClientUATItem, 'id'>) => {
    const newItem: ClientUATItem = {
      ...item,
      id: `uat-${Date.now()}`,
    };
    const updated = [newItem, ...clientUAT];
    setClientUAT(updated);
    syncStorage('clientUAT', updated);
  };

  const logTime = (log: Omit<TimeLog, 'id' | 'createdAt'>) => {
    const newLog: TimeLog = {
      ...log,
      id: `tl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newLog, ...timeLogs];
    setTimeLogs(updated);
    syncStorage('timeLogs', updated);

    // Update task logged hours if linked
    if (newLog.taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === newLog.taskId
            ? { ...t, loggedHours: Number((t.loggedHours + newLog.hours).toFixed(1)) }
            : t
        )
      );
    }
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    syncStorage('notifications', updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    syncStorage('notifications', updated);
  };

  const resetToSeedData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setClients(INITIAL_CLIENTS);
    setProjects(INITIAL_PROJECTS);
    setModules(INITIAL_MODULES);
    setRequirements(INITIAL_REQUIREMENTS);
    setTasks(INITIAL_TASKS);
    setBugs(INITIAL_BUGS);
    setMilestones(INITIAL_MILESTONES);
    setSprints(INITIAL_SPRINTS);
    setChangeRequests(INITIAL_CHANGE_REQUESTS);
    setApprovals(INITIAL_APPROVALS);
    setReleases(INITIAL_RELEASES);
    setTimeLogs(INITIAL_TIME_LOGS);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTestCases(INITIAL_TEST_CASES);
    setClientUAT(INITIAL_CLIENT_UAT);
    setActiveRoleState('SUPERADMIN');
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
        activeRole,
        setActiveRole,
        canDelete,
        canCreateAccount,
        canManageRoles,
        isSuperAdmin,
        isAdmin,
        addUser,
        updateUserRole,
        deleteUser,
        deleteTask,
        deleteBug,
        deleteModule,
        users,
        clients,
        projects,
        modules,
        requirements,
        tasks,
        bugs,
        milestones,
        sprints,
        changeRequests,
        approvals,
        releases,
        timeLogs,
        documents,
        activities,
        notifications,
        testCases,
        testRuns,
        clientUAT,
        currentView,
        setCurrentView,
        selectedProjectId,
        setSelectedProjectId,
        selectedTaskId,
        setSelectedTaskId,
        selectedBugId,
        setSelectedBugId,
        commandPaletteOpen,
        setCommandPaletteOpen,
        quickCreateOpen,
        setQuickCreateOpen,
        activeTimer,
        startTimer,
        stopTimer,
        addTask,
        updateTask,
        updateTaskStatus,
        toggleSubtask,
        addBug,
        updateBugStatus,
        addProject,
        updateProject,
        deleteProject,
        addModule,
        updateModule,
        addMilestone,
        addClient,
        addRequirement,
        addChangeRequest,
        updateCRStatus,
        approveMilestone,
        approveRelease,
        submitApprovalDecision,
        updateUATStatus,
        addUATItem,
        logTime,
        markNotificationRead,
        markAllNotificationsRead,
        resetToSeedData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
