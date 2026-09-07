import {
  User,
  Client,
  Project,
  ProjectModule,
  Requirement,
  Task,
  Bug,
  TestCase,
  TestRun,
  Milestone,
  Sprint,
  ChangeRequest,
  Approval,
  Release,
  TimeLog,
  ProjectDocument,
  ActivityItem,
  NotificationItem,
  ClientUATItem,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-2',
    name: 'T Jois',
    email: 't.jois@admarkdigitals.com',
    role: 'SUPERADMIN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'CEO',
    department: 'Leadership',
    capacityHoursPerWeek: 40,
    password: 'password123',
  },
  {
    id: 'user-1',
    name: 'Harshith',
    email: 'harshith@admarkdigitals.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'COO',
    department: 'Leadership',
    capacityHoursPerWeek: 40,
    password: 'password123',
  },
  {
    id: 'user-4',
    name: 'Prajwal',
    email: 'prajwal@admarkdigitals.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    title: 'CFO',
    department: 'Leadership',
    capacityHoursPerWeek: 40,
    password: 'password123',
  },
  {
    id: 'user-3',
    name: 'Revanth',
    email: 'revanth@admarkdigitals.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Developer',
    department: 'Engineering',
    capacityHoursPerWeek: 40,
    password: 'password123',
  },
  {
    id: 'user-5',
    name: 'Chethan',
    email: 'chethan@admarkdigitals.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    title: 'Intern',
    department: 'Engineering',
    capacityHoursPerWeek: 40,
    password: 'password123',
  },
];

// Clean Slate: All project, client, and operational data cleared
export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_MODULES: ProjectModule[] = [];
export const INITIAL_REQUIREMENTS: Requirement[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_BUGS: Bug[] = [];
export const INITIAL_MILESTONES: Milestone[] = [];
export const INITIAL_SPRINTS: Sprint[] = [];
export const INITIAL_CHANGE_REQUESTS: ChangeRequest[] = [];
export const INITIAL_APPROVALS: Approval[] = [];
export const INITIAL_RELEASES: Release[] = [];
export const INITIAL_TIME_LOGS: TimeLog[] = [];
export const INITIAL_DOCUMENTS: ProjectDocument[] = [];
export const INITIAL_ACTIVITIES: ActivityItem[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_TEST_CASES: TestCase[] = [];
export const INITIAL_TEST_RUNS: TestRun[] = [];
export const INITIAL_CLIENT_UAT: ClientUATItem[] = [];
