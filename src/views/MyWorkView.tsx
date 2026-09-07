import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers,
  ChevronRight,
  FolderKanban,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';

export const MyWorkView: React.FC = () => {
  const {
    currentUser,
    users,
    tasks,
    projects,
    timeLogs,
    setSelectedTaskId,
    updateTaskStatus,
    setQuickCreateOpen,
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [activeScope, setActiveScope] = useState<'ALL' | 'IN_PROGRESS' | 'REVIEW' | 'READY' | 'BLOCKED' | 'COMPLETED'>('ALL');
  const [timeframe, setTimeframe] = useState<'ALL' | 'THIS_WEEK' | 'TODAY' | 'UPCOMING'>('ALL');

  // Sync selectedUserId if currentUser changes
  React.useEffect(() => {
    setSelectedUserId(currentUser.id);
  }, [currentUser.id]);

  const viewUser = users.find((u) => u.id === selectedUserId) || currentUser;
  const isViewingSelf = viewUser.id === currentUser.id;

  // Base tasks for selected user
  const userTasks = useMemo(() => {
    if (selectedUserId === 'ALL') {
      return tasks;
    }
    return tasks.filter((t) => t.assigneeId === viewUser.id);
  }, [tasks, selectedUserId, viewUser.id]);

  // Apply Timeframe Filter
  const filteredByTimeframe = useMemo(() => {
    if (timeframe === 'ALL') return userTasks;

    // Reference anchor for demo dates (2025-02-28 / 2025-03-01)
    const refDate = new Date('2025-03-01').getTime();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    return userTasks.filter((t) => {
      const taskDue = new Date(t.dueDate).getTime();
      if (isNaN(taskDue)) return true;

      if (timeframe === 'TODAY') {
        // Due today or earlier (overdue + today)
        return taskDue <= refDate;
      }
      if (timeframe === 'THIS_WEEK') {
        // Due within this week
        return taskDue <= refDate + oneWeekMs;
      }
      if (timeframe === 'UPCOMING') {
        // Due beyond this week
        return taskDue > refDate + oneWeekMs;
      }
      return true;
    });
  }, [userTasks, timeframe]);

  // Categorize
  const blockedTasks = useMemo(
    () => filteredByTimeframe.filter((t) => t.status === 'Blocked'),
    [filteredByTimeframe]
  );
  const inProgressTasks = useMemo(
    () => filteredByTimeframe.filter((t) => t.status === 'In Progress'),
    [filteredByTimeframe]
  );
  const reviewTasks = useMemo(
    () =>
      filteredByTimeframe.filter(
        (t) => t.status === 'Code Review' || t.status === 'QA' || t.status === 'Client Review'
      ),
    [filteredByTimeframe]
  );
  const readyTasks = useMemo(
    () => filteredByTimeframe.filter((t) => t.status === 'Ready' || t.status === 'Backlog'),
    [filteredByTimeframe]
  );
  const completedTasks = useMemo(
    () => filteredByTimeframe.filter((t) => t.status === 'Done'),
    [filteredByTimeframe]
  );

  // Remaining tasks with any other status so NO task is ever dropped
  const otherTasks = useMemo(
    () =>
      filteredByTimeframe.filter(
        (t) =>
          t.status !== 'Blocked' &&
          t.status !== 'In Progress' &&
          t.status !== 'Code Review' &&
          t.status !== 'QA' &&
          t.status !== 'Client Review' &&
          t.status !== 'Ready' &&
          t.status !== 'Backlog' &&
          t.status !== 'Done'
      ),
    [filteredByTimeframe]
  );

  // Scoped list based on activeScope
  const activeTasksList = useMemo(() => {
    switch (activeScope) {
      case 'IN_PROGRESS':
        return inProgressTasks;
      case 'REVIEW':
        return reviewTasks;
      case 'READY':
        return readyTasks;
      case 'BLOCKED':
        return blockedTasks;
      case 'COMPLETED':
        return completedTasks;
      case 'ALL':
      default:
        return filteredByTimeframe;
    }
  }, [activeScope, inProgressTasks, reviewTasks, readyTasks, blockedTasks, completedTasks, filteredByTimeframe]);

  const totalEstimatedHours = userTasks
    .filter((t) => t.status !== 'Done')
    .reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  const completedCount = userTasks.filter((t) => t.status === 'Done').length;
  const inFlightCount = userTasks.filter((t) => t.status !== 'Done').length;

  const renderTaskRow = (t: Task) => {
    const project = projects.find((p) => p.id === t.projectId);
    const completedSubs = t.subtasks?.filter((st) => st.completed).length || 0;
    const totalSubs = t.subtasks?.length || 0;
    const isOverdue = t.status !== 'Done' && new Date(t.dueDate) < new Date('2025-03-01');

    return (
      <div
        key={t.id}
        onClick={() => setSelectedTaskId(t.id)}
        className="admark-card-interactive flex items-center justify-between"
        style={{
          padding: '0.65rem 0.95rem',
          borderBottom: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'background 0.1s ease',
        }}
      >
        <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
          {/* Status icon badge */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              minWidth: '45px',
            }}
          >
            #{t.taskNumber}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: t.status === 'Done' ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: t.status === 'Done' ? 'line-through' : 'none',
                }}
                className="truncate"
              >
                {t.title}
              </span>

              {t.status === 'Blocked' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: 'var(--status-danger)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  BLOCKED
                </span>
              )}
            </div>

            <div className="flex items-center gap-2" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{project?.code}</span>
              <span>•</span>
              <span className="truncate">{project?.name}</span>

              {totalSubs > 0 && (
                <>
                  <span>•</span>
                  <span style={{ color: completedSubs === totalSubs ? 'var(--status-healthy)' : 'var(--text-muted)' }}>
                    {completedSubs}/{totalSubs} subtasks
                  </span>
                </>
              )}

              {t.blockedReason && (
                <span style={{ color: 'var(--status-danger)' }}>
                  ({t.blockedReason})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Info & Quick Action */}
        <div className="flex items-center gap-3.5" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'right', minWidth: '70px' }}>
            <div
              style={{
                fontSize: '0.72rem',
                color: isOverdue ? 'var(--status-danger)' : 'var(--text-secondary)',
                fontWeight: isOverdue ? 600 : 400,
              }}
            >
              {isOverdue ? 'Overdue' : 'Due'} {t.dueDate?.replace('2025-', '').replace('-', '/')}
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color:
                  t.priority === 'Urgent'
                    ? 'var(--status-danger)'
                    : t.priority === 'High'
                    ? 'var(--status-warning)'
                    : 'var(--text-muted)',
              }}
            >
              {t.priority}
            </span>
          </div>

          {/* Quick Action Button */}
          <div style={{ minWidth: '85px', textAlign: 'right' }}>
            {t.status === 'Ready' || t.status === 'Backlog' ? (
              <button
                onClick={() => updateTaskStatus(t.id, 'In Progress')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                title="Start working on this task"
              >
                Start
              </button>
            ) : t.status === 'In Progress' ? (
              <button
                onClick={() => updateTaskStatus(t.id, 'Code Review')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                title="Submit for Code Review"
              >
                Review
              </button>
            ) : t.status === 'Code Review' ? (
              <button
                onClick={() => updateTaskStatus(t.id, 'QA')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                title="Move to QA"
              >
                QA
              </button>
            ) : t.status === 'QA' || t.status === 'Client Review' ? (
              <button
                onClick={() => updateTaskStatus(t.id, 'Done')}
                className="btn btn-sm"
                style={{
                  background: 'var(--status-healthy)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  border: 'none',
                }}
                title="Mark Task Completed"
              >
                Pass / Done
              </button>
            ) : t.status === 'Done' ? (
              <span style={{ fontSize: '0.7rem', color: 'var(--status-healthy)', fontWeight: 600 }}>
                Completed
              </span>
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {t.status}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, taskList: Task[], dotClass: string) => {
    if (taskList.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div className="flex items-center justify-between" style={{ padding: '0.2rem 0.25rem' }}>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${dotClass}`} />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {title}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {taskList.length}
          </span>
        </div>
        <div className="admark-card" style={{ overflow: 'hidden' }}>
          {taskList.map((t) => renderTaskRow(t))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Header: Title & Assignee Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {isViewingSelf ? 'My Work' : `${viewUser.name}'s Work`}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Everything currently assigned to {isViewingSelf ? 'you' : viewUser.name} across client deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Member View Switcher */}
          <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Assignee:</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="input-field"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                width: 'auto',
                minWidth: '170px',
                height: '32px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <option value={currentUser.id}>Assigned to Me ({currentUser.name})</option>
              <option value="ALL">All Team Members</option>
              {users
                .filter((u) => u.role !== 'CLIENT' && u.role !== 'PHOTO_ADMIN')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title})
                  </option>
                ))}
            </select>
          </div>

          <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div
        className="admark-card flex items-center justify-between"
        style={{ padding: '0.75rem 1.25rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Tasks
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {inFlightCount}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              In Progress
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--status-warning)' }}>
              {inProgressTasks.length}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Review & QA
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#38BDF8' }}>
              {reviewTasks.length}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Blocked
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: blockedTasks.length > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
              {blockedTasks.length}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Completed
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--status-healthy)' }}>
              {completedCount}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Estimated Workload
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {totalEstimatedHours}h committed
          </div>
        </div>
      </div>

      {/* Scope Navigation Tabs & Timeframe Selector */}
      <div className="flex items-center justify-between border-b border-subtle pb-2 flex-wrap gap-2">
        {/* Scope Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { id: 'ALL', label: 'All Tasks', count: filteredByTimeframe.length },
            { id: 'IN_PROGRESS', label: 'In Progress', count: inProgressTasks.length },
            { id: 'REVIEW', label: 'Review & QA', count: reviewTasks.length },
            { id: 'READY', label: 'Ready', count: readyTasks.length },
            { id: 'BLOCKED', label: 'Blocked', count: blockedTasks.length },
            { id: 'COMPLETED', label: 'Done', count: completedTasks.length },
          ].map((scope) => {
            const active = activeScope === scope.id;
            return (
              <button
                key={scope.id}
                onClick={() => setActiveScope(scope.id as typeof activeScope)}
                className={`btn btn-sm ${active ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: active ? 600 : 450,
                  gap: '5px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span>{scope.label}</span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-elevated)',
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {scope.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1">
          {[
            { id: 'ALL', label: 'All Time' },
            { id: 'THIS_WEEK', label: 'This Week' },
            { id: 'TODAY', label: 'Today' },
            { id: 'UPCOMING', label: 'Upcoming' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as typeof timeframe)}
              className={`btn btn-sm ${timeframe === tf.id ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                fontWeight: timeframe === tf.id ? 600 : 400,
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {activeScope === 'ALL' ? (
          <>
            {renderSection('Blocked & Action Required', blockedTasks, 'danger')}
            {renderSection('In Progress', inProgressTasks, 'warning')}
            {renderSection('Under Review & QA Testing', reviewTasks, 'info')}
            {renderSection('Ready to Pick Up', readyTasks, 'neutral')}
            {renderSection('Other Active Tasks', otherTasks, 'neutral')}
            {renderSection('Completed', completedTasks, 'healthy')}

            {filteredByTimeframe.length === 0 && (
              <div className="admark-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="var(--status-healthy)" style={{ margin: '0 auto 0.75rem auto' }} />
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  No tasks found for this timeframe
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Switch timeframes above or select a different assignee to review team assignments.
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {activeTasksList.length > 0 ? (
              <div className="admark-card" style={{ overflow: 'hidden' }}>
                {activeTasksList.map((t) => renderTaskRow(t))}
              </div>
            ) : (
              <div className="admark-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="var(--status-healthy)" style={{ margin: '0 auto 0.75rem auto' }} />
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  No tasks in this category
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Select "All Tasks" to see everything assigned to {viewUser.name}.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
