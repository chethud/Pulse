// Admark Digitals Project Management Platform Types

export type UserRole =
  | 'SUPER_ADMIN'
  | 'PARTNER'
  | 'INTERN'
  | 'PROJECT_MANAGER'
  | 'TEAM_LEAD'
  | 'DEVELOPER'
  | 'DESIGNER'
  | 'QA'
  | 'SALES_AM'
  | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  clientId?: string; // Set if user is a CLIENT role
  department?: string;
  capacityHoursPerWeek: number;
  password?: string;
}

export interface ClientContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  accountManagerId: string;
  status: 'Active' | 'Inactive' | 'Archived';
  contractDetails?: {
    startDate?: string;
    endDate?: string;
  };
  paymentTerms?: string;
  notes: string;
  contacts: ClientContact[];
  lastActivity: string;
}

export type ProjectStatus =
  | 'Planning'
  | 'Active'
  | 'On Hold'
  | 'Completed'
  | 'Deployed'
  | 'Maintenance'
  | 'Archived';
export type ProjectHealth = 'Healthy' | 'At Risk' | 'Critical';

export interface ProjectHealthMetrics {
  overall: ProjectHealth;
  schedule: 'On Track' | 'Delayed' | 'Critical';
  development: 'Normal' | 'Behind' | 'Blocked';
  qa: 'Passing' | 'Bugs Found' | 'Blocked';
  client: 'Responsive' | 'Pending Approval' | 'Friction';
  budget: 'Within Budget' | 'Tight' | 'Overrun';
  score: number; // 0-100
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  code: string; // e.g. "TRV-CRM"
  clientId: string;
  description: string;
  projectManagerId: string;
  teamMemberIds: string[];
  startDate: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: ProjectStatus;
  health: ProjectHealthMetrics;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  techStack: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  stagingUrl?: string;
  productionUrl?: string;
  figmaUrl?: string;
  progress: number; // calculated dynamically
  pinned?: boolean;
  maintenanceNotes?: string;
}

export interface ProjectModule {
  id: string;
  projectId: string;
  name: string;
  description: string;
  leadId: string;
  progress: number;
  order: number;
  targetDate?: string;
  status?: 'Planned' | 'In Progress' | 'Completed' | 'Delayed';
  deliverables?: string[];
}

export interface ProjectFeature {
  id: string;
  projectId: string;
  moduleId: string;
  requirementId?: string;
  name: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export type RequirementStatus = 'Draft' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented';

export interface Requirement {
  id: string;
  code: string; // e.g. "REQ-101"
  projectId: string;
  moduleId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  source: 'Client Request' | 'Internal' | 'Regulatory';
  requestedBy: string;
  createdAt: string;
  status: RequirementStatus;
  acceptanceCriteria: string[];
  attachments?: string[];
  featuresCount?: number;
}

export type TaskStatus =
  | 'Backlog'
  | 'Ready'
  | 'In Progress'
  | 'Code Review'
  | 'QA'
  | 'Client Review'
  | 'Done'
  | 'Blocked'
  | 'Cancelled';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

export interface GitBranchCommitInfo {
  branchName?: string;
  commitHash?: string;
  commitMessage?: string;
  pullRequestNumber?: number;
  pullRequestUrl?: string;
  pullRequestStatus?: 'open' | 'merged' | 'closed';
}

export interface Task {
  id: string;
  taskNumber: number; // e.g. 102 -> #102
  title: string;
  description: string;
  projectId: string;
  moduleId?: string;
  featureId?: string;
  requirementId?: string;
  sprintId?: string;
  milestoneId?: string;
  assigneeId: string;
  reporterId: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  tags: string[];
  blockedByTaskIds?: string[];
  blocksTaskIds?: string[];
  blockedReason?: string;
  blockedSinceDate?: string;
  blockedByOwner?: string;
  blockedImpact?: string;
  subtasks: Subtask[];
  gitInfo?: GitBranchCommitInfo;
  isClientVisible: boolean;
  isMaintenanceTask?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BugSeverity = 'Critical' | 'Major' | 'Minor' | 'Trivial';
export type BugStatus =
  | 'New'
  | 'Triaged'
  | 'Assigned'
  | 'In Progress'
  | 'Fixed'
  | 'QA Testing'
  | 'Verified'
  | 'Closed'
  | 'Reopened'
  | 'Duplicate'
  | 'Won\'t Fix';

export interface Bug {
  id: string;
  bugNumber: number; // e.g. #342
  title: string;
  description: string;
  projectId: string;
  moduleId?: string;
  taskId?: string;
  releaseId?: string;
  environment: 'Development' | 'Staging' | 'Production';
  severity: BugSeverity;
  priority: TaskPriority;
  reporterId: string;
  assigneeId: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  browser?: string;
  device?: string;
  version?: string;
  status: BugStatus;
  createdAt: string;
  resolvedAt?: string;
}

export type TestCaseResult = 'Pass' | 'Fail' | 'Blocked' | 'Skipped';

export interface TestCase {
  id: string;
  code: string; // e.g. "TC-042"
  projectId: string;
  moduleId?: string;
  requirementId?: string;
  title: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  priority: TaskPriority;
  status: TestCaseResult;
  lastRunDate?: string;
}

export interface TestRun {
  id: string;
  name: string; // e.g. "Release v1.4 Smoke & Regression"
  projectId: string;
  releaseId?: string;
  executedBy: string;
  executedAt: string;
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  status: 'In Progress' | 'Completed';
}

export interface Milestone {
  id: string;
  number: number;
  name: string;
  description: string;
  projectId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed';
  progress: number;
  deliverables: string[];
  isClientApproved: boolean;
  approvalDate?: string;
  approvedBy?: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Completed';
  totalStoryPoints: number;
  completedStoryPoints: number;
  taskIds: string[];
}

export type ChangeRequestStatus =
  | 'Requested'
  | 'Impact Analysis'
  | 'Estimated'
  | 'Sent to Client'
  | 'Pending Approval'
  | 'Approved'
  | 'In Development'
  | 'Completed'
  | 'Rejected';

export interface ChangeRequest {
  id: string;
  crNumber: number; // e.g. CR-08
  projectId: string;
  clientId: string;
  title: string;
  businessReason: string;
  requestedBy: string;
  date: string;
  developmentEffortHours: number;
  designEffortHours: number;
  qaEffortHours: number;
  costImpact: number;
  timelineImpactDays: number;
  priority: TaskPriority;
  status: ChangeRequestStatus;
  approvedByClient?: string;
  clientComments?: string;
  generatedTaskId?: string;
}

export type ApprovalType =
  | 'Requirement'
  | 'Design'
  | 'Milestone'
  | 'UAT'
  | 'Release'
  | 'Change Request';

export type ApprovalDecision = 'Pending' | 'Approved' | 'Request Changes' | 'Rejected';

export interface Approval {
  id: string;
  type: ApprovalType;
  referenceId: string;
  referenceTitle: string;
  projectId: string;
  version: string;
  approverId: string;
  decision: ApprovalDecision;
  comments: string;
  timestamp: string;
  isClientFacing: boolean;
}

export interface Release {
  id: string;
  version: string; // e.g. "v1.4.0"
  name: string;
  projectId: string;
  description: string;
  environment: 'Development' | 'Staging' | 'Production';
  includedTaskIds: string[];
  includedBugIds: string[];
  qaStatus: 'Passed' | 'Failed' | 'In Progress' | 'Pending';
  clientApprovalStatus: 'Approved' | 'Pending' | 'Rejected';
  deploymentDate: string;
  deploymentStatus: 'Scheduled' | 'Deploying' | 'Live' | 'Rolled Back';
  deployedBy: string;
  releaseNotes: string[];
}

export interface TimeLog {
  id: string;
  userId: string;
  projectId: string;
  taskId?: string;
  date: string;
  hours: number;
  description: string;
  isBillable: boolean;
  createdAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  projectId: string;
  folder:
    | 'Requirements'
    | 'Contracts'
    | 'Designs'
    | 'Technical'
    | 'Meeting Notes'
    | 'UAT'
    | 'Deployment'
    | 'Invoices';
  fileType: 'pdf' | 'docx' | 'xlsx' | 'png' | 'figma' | 'zip';
  size: string;
  currentVersion: string; // e.g. "v3"
  versions: {
    version: string;
    uploadedBy: string;
    uploadedAt: string;
    notes: string;
  }[];
  uploadedBy: string;
  updatedAt: string;
  isClientVisible: boolean;
}

export interface Meeting {
  id: string;
  projectId: string;
  name: string;
  date: string;
  time: string;
  participantIds: string[];
  agenda: string;
  notes: string;
  decisions: string[];
  actionItems: {
    id: string;
    text: string;
    assigneeId: string;
    isTaskCreated: boolean;
  }[];
}

export interface ActivityItem {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  targetType: 'Task' | 'Bug' | 'Milestone' | 'Release' | 'Approval' | 'Design' | 'CR' | 'Client';
  targetTitle: string;
  targetId?: string;
  timestamp: string;
  details?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'bug' | 'approval' | 'mention' | 'milestone' | 'alert';
  projectId?: string;
  taskId?: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ClientUATItem {
  id: string;
  projectId: string;
  releaseId: string;
  featureTitle: string;
  description: string;
  testSteps: string[];
  expectedResult: string;
  status: 'Pending' | 'Passed' | 'Failed' | 'Needs Change';
  clientFeedback?: string;
  clientReviewedAt?: string;
  reviewedBy?: string;
}
