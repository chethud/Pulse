import { supabase, isSupabaseConfigured } from './supabase';
import { Project, ProjectModule, Task, Bug, Client, User, getModulePhase } from '../types';

// Convert TS Client to DB Client Row
export const clientToDb = (c: Client) => ({
  id: c.id,
  name: c.name,
  logo: c.logo || null,
  industry: c.industry || null,
  website: c.website || null,
  email: c.email || null,
  phone: c.phone || null,
  location: c.location || null,
  account_manager_id: c.accountManagerId || null,
  status: c.status || 'Active',
  payment_terms: c.paymentTerms || null,
  notes: c.notes || null,
  contacts: c.contacts || [],
  last_activity: c.lastActivity || 'Active',
});

// Convert DB Client Row to TS Client
export const dbToClient = (row: any): Client => ({
  id: row.id,
  name: row.name,
  logo: row.logo,
  industry: row.industry || '',
  website: row.website || '',
  email: row.email || '',
  phone: row.phone || '',
  location: row.location || '',
  accountManagerId: row.account_manager_id || 'user-1',
  status: row.status || 'Active',
  paymentTerms: row.payment_terms,
  notes: row.notes || '',
  contacts: Array.isArray(row.contacts) ? row.contacts : [],
  lastActivity: row.last_activity || 'Active',
});

// Convert TS User to DB User Row
export const userToDb = (u: User) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar || null,
  title: u.title || null,
  client_id: u.clientId || null,
  department: u.department || null,
  capacity_hours_per_week: u.capacityHoursPerWeek || 40,
});

// Convert DB User Row to TS User
export const dbToUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role || 'USER',
  avatar: row.avatar || '',
  title: row.title || '',
  clientId: row.client_id,
  department: row.department || '',
  capacityHoursPerWeek: row.capacity_hours_per_week || 40,
});

// Convert TS Project to DB Project Row
export const projectToDb = (p: Project) => ({
  id: p.id,
  name: p.name,
  code: p.code,
  client_id: p.clientId,
  description: p.description,
  project_manager_id: p.projectManagerId,
  team_member_ids: p.teamMemberIds,
  start_date: p.startDate,
  deadline: p.deadline,
  priority: p.priority,
  status: p.status,
  health: p.health,
  budget: p.budget,
  tech_stack: p.techStack,
  live_url: p.liveUrl || null,
  repository_url: p.repositoryUrl || null,
  staging_url: p.stagingUrl || null,
  production_url: p.productionUrl || null,
  figma_url: p.figmaUrl || null,
  git_account: p.gitAccount || null,
  vercel_account: p.vercelAccount || null,
  backend_provider: p.backendProvider || null,
  backend_account: p.backendAccount || null,
  progress: p.progress || 0,
  pinned: Boolean(p.pinned),
  maintenance_notes: p.maintenanceNotes || null,
  uptime_sla: p.uptimeSla || null,
  sla_target: p.slaTarget || null,
  maintenance_start_date: p.maintenanceStartDate || null,
  maintenance_end_date: p.maintenanceEndDate || null,
  maintenance_tasks: p.maintenanceTasks || [],
});

// Convert DB Project Row to TS Project
export const dbToProject = (row: any): Project => ({
  id: row.id,
  name: row.name,
  code: row.code,
  clientId: row.client_id,
  description: row.description || '',
  projectManagerId: row.project_manager_id,
  teamMemberIds: Array.isArray(row.team_member_ids) ? row.team_member_ids : [],
  startDate: row.start_date || '',
  deadline: row.deadline || '',
  priority: row.priority || 'Medium',
  status: row.status || 'Active',
  health: row.health || {
    overall: 'Healthy',
    schedule: 'On Track',
    development: 'Normal',
    qa: 'Passing',
    client: 'Responsive',
    budget: 'Within Budget',
    score: 100,
    notes: '',
  },
  budget: row.budget || { total: 0, spent: 0, currency: 'INR' },
  techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
  liveUrl: row.live_url,
  repositoryUrl: row.repository_url,
  stagingUrl: row.staging_url,
  productionUrl: row.production_url,
  figmaUrl: row.figma_url,
  gitAccount: row.git_account,
  vercelAccount: row.vercel_account,
  backendProvider: row.backend_provider,
  backendAccount: row.backend_account,
  progress: typeof row.progress === 'number' ? row.progress : 0,
  pinned: Boolean(row.pinned),
  maintenanceNotes: row.maintenance_notes,
  uptimeSla: row.uptime_sla,
  slaTarget: row.sla_target,
  maintenanceStartDate: row.maintenance_start_date || undefined,
  maintenanceEndDate: row.maintenance_end_date || undefined,
  maintenanceTasks: Array.isArray(row.maintenance_tasks) ? row.maintenance_tasks : [],
});

// Convert TS Module to DB Module Row
export const moduleToDb = (m: ProjectModule) => ({
  id: m.id,
  project_id: m.projectId,
  name: m.name,
  description: m.description,
  lead_id: m.leadId,
  progress: typeof m.progress === 'number' ? m.progress : 0,
  order: m.order || 1,
  target_date: m.targetDate || null,
  status: m.status || 'Planned',
  phase: getModulePhase(m),
  deliverables: m.deliverables || [],
  completed_deliverables: m.completedDeliverables || [],
});

// Convert DB Module Row to TS Module
export const dbToModule = (row: any): ProjectModule => ({
  id: row.id,
  projectId: row.project_id,
  name: row.name,
  description: row.description || '',
  leadId: row.lead_id,
  progress: typeof row.progress === 'number' ? row.progress : 0,
  order: row.order || 1,
  targetDate: row.target_date,
  status: row.status || 'Planned',
  phase: getModulePhase({
    phase: row.phase,
    order: row.order || 1,
  }),
  deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
  completedDeliverables: Array.isArray(row.completed_deliverables) ? row.completed_deliverables : [],
});

// Convert TS Task to DB Task Row
export const taskToDb = (t: Task) => ({
  id: t.id,
  task_number: t.taskNumber,
  project_id: t.projectId,
  module_id: t.moduleId || null,
  title: t.title,
  description: t.description || '',
  status: t.status,
  priority: t.priority,
  assignee_id: t.assigneeId,
  reporter_id: t.reporterId,
  start_date: t.startDate || null,
  due_date: t.dueDate || null,
  estimated_hours: t.estimatedHours || 0,
  logged_hours: t.loggedHours || 0,
  subtasks: t.subtasks || [],
  tags: t.tags || [],
  is_client_visible: Boolean(t.isClientVisible),
});

// Convert DB Task Row to TS Task
export const dbToTask = (row: any): Task => ({
  id: row.id,
  taskNumber: row.task_number || 100,
  projectId: row.project_id,
  moduleId: row.module_id,
  title: row.title,
  description: row.description || '',
  status: row.status || 'Backlog',
  priority: row.priority || 'Medium',
  assigneeId: row.assignee_id || 'user-1',
  reporterId: row.reporter_id || 'user-1',
  startDate: row.start_date || '',
  dueDate: row.due_date || '',
  estimatedHours: row.estimated_hours || 0,
  loggedHours: row.logged_hours || 0,
  subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
  tags: Array.isArray(row.tags) ? row.tags : [],
  isClientVisible: Boolean(row.is_client_visible),
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
});


/**
 * Sync helper: Upsert single entity to Supabase
 */
export async function syncEntityToSupabase(table: string, payload: any) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from(table).upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Supabase Sync] Error syncing to ${table}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase Sync] Network error syncing to ${table}:`, err);
  }
}

/**
 * Delete helper: Remove entity from Supabase
 */
export async function deleteEntityFromSupabase(table: string, id: string) {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`[Supabase Delete] Error deleting from ${table}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase Delete] Network error deleting from ${table}:`, err);
  }
}

/**
 * Initial Bootstrap: Seeds Supabase if table is empty
 */
export async function bootstrapTableIfEmpty(
  table: string,
  seedData: any[],
  converter: (item: any) => any
) {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      // Table might not exist yet in schema cache
      return false;
    }
    if (count === 0 && seedData.length > 0) {
      const rows = seedData.map(converter);
      const { error: insertErr } = await supabase.from(table).insert(rows);
      if (insertErr) {
        console.warn(`[Supabase Bootstrap] Failed to seed ${table}:`, insertErr.message);
      } else {
        console.log(`[Supabase Bootstrap] Seeded ${rows.length} rows into ${table}`);
      }
    }
    return true;
  } catch (err) {
    return false;
  }
}
