import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Play,
  GitBranch,
  GitPullRequest,
  Clock,
  Calendar,
  AlertTriangle,
  Send,
  MessageSquare,
  Lock,
  Eye,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskStatus, TaskPriority } from '../../types';

export const TaskDetailDrawer: React.FC = () => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tasks,
    projects,
    users,
    updateTaskStatus,
    updateTask,
    toggleSubtask,
    startTimer,
    currentUser,
    activeRole,
  } = useApp();

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<
    { id: string; author: string; avatar: string; text: string; time: string }[]
  >([
    {
      id: 'c-1',
      author: 'Rahul Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Verified the Redis lock TTL cleanup strategy. Subtasks 1 through 3 are passing all unit tests.',
      time: 'Yesterday at 14:20',
    },
    {
      id: 'c-2',
      author: 'Sarah Jenkins (Client)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: 'Looking forward to testing the reservation hold flow in Friday’s demo call.',
      time: 'Yesterday at 16:45',
    },
  ]);

  if (!selectedTaskId) return null;

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = users.find((u) => u.id === task.assigneeId);
  const reporter = users.find((u) => u.id === task.reporterId);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: currentUser.name,
        avatar: currentUser.avatar,
        text: newComment.trim(),
        time: 'Just now',
      },
    ]);
    setNewComment('');
  };

  const statuses: TaskStatus[] = [
    'Backlog',
    'Ready',
    'In Progress',
    'Code Review',
    'QA',
    'Client Review',
    'Done',
    'Blocked',
    'Cancelled',
  ];

  const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  return (
    <div className="drawer-backdrop animate-fade-in" onClick={() => setSelectedTaskId(null)}>
      <div
        className="animate-slide-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '740px',
          height: '100vh',
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div
          style={{
            height: '56px',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-sidebar)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--brand-crimson)',
              }}
            >
              #{task.taskNumber}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {project?.code} — {project?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedTaskId(null)} className="btn btn-ghost btn-icon">
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Header Controls: Status, Priority, Assignee */}
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</label>
            <select
              value={task.status}
              onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
              className="input-field"
              style={{
                width: 'auto',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderColor: task.status === 'Done' ? 'var(--status-healthy)' : 'var(--border-strong)',
                color: task.status === 'Done' ? 'var(--status-healthy)' : 'var(--text-primary)',
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</label>
            <select
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
              className="input-field"
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8125rem', fontWeight: 600 }}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assignee:</label>
            <select
              value={task.assigneeId}
              onChange={(e) => updateTask(task.id, { assigneeId: e.target.value })}
              className="input-field"
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8125rem' }}
            >
              {users
                .filter((u) => u.role !== 'CLIENT')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', gap: '1.5rem' }}>
          {/* Main Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {task.title}
              </h2>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Description
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-app)',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {task.description}
              </div>
            </div>

            {/* Subtasks Checklist */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Subtasks ({completedSubtasks}/{totalSubtasks})
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--brand-crimson)', fontWeight: 600 }}>
                  {totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0}% Done
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-track" style={{ marginBottom: '0.75rem' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%`,
                    backgroundColor: 'var(--brand-crimson)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(task.id, st.id)}
                    className="flex items-center justify-between"
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      {st.completed ? (
                        <CheckCircle2 size={16} color="var(--status-healthy)" />
                      ) : (
                        <Circle size={16} color="var(--text-muted)" />
                      )}
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: st.completed ? 'line-through' : 'none',
                        }}
                      >
                        {st.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Git / Development Integration Block */}
            {task.gitInfo && (
              <div
                style={{
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-strong)',
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                  <div className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    <GitBranch size={14} />
                    <span>Development Linkage</span>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    PR #{task.gitInfo.pullRequestNumber} {task.gitInfo.pullRequestStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2" style={{ fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Branch:</span>
                  <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-crimson)', background: 'var(--bg-app)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                    {task.gitInfo.branchName}
                  </code>
                </div>

                {task.gitInfo.commitHash && (
                  <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Commit:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{task.gitInfo.commitHash}</span>
                    <span className="truncate">— {task.gitInfo.commitMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Comments Thread */}
            <div style={{ marginTop: '0.5rem' }}>
              <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <MessageSquare size={14} />
                <span>Discussion & Activity ({comments.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.25rem' }}>
                      <div className="flex items-center gap-2">
                        <img
                          src={c.avatar}
                          alt={c.author}
                          style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{c.author}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: '30px' }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Post comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type a comment or mention (@name)..."
                  className="input-field"
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Rail Metadata */}
          <div
            style={{
              width: '240px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderLeft: '1px solid var(--border-subtle)',
              paddingLeft: '1rem',
            }}
          >
            {/* Time Tracking */}
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Clock size={13} />
                <span>Time Tracking</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated:</span>
                <span style={{ fontWeight: 600 }}>{task.estimatedHours}h</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Logged:</span>
                <span style={{ fontWeight: 600, color: 'var(--status-healthy)' }}>{task.loggedHours}h</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.8125rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Remaining:</span>
                <span style={{ fontWeight: 600 }}>
                  {Math.max(0, task.estimatedHours - task.loggedHours)}h
                </span>
              </div>
            </div>

            {/* Dates */}
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Calendar size={13} />
                <span>Schedule</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Start Date:</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{task.startDate}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Date:</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-crimson)' }}>{task.dueDate}</div>
            </div>

            {/* Dependencies */}
            {(task.blockedByTaskIds?.length || task.blocksTaskIds?.length) ? (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={13} color="var(--status-warning)" />
                  <span>Dependencies</span>
                </div>
                {task.blockedByTaskIds?.map((tid) => (
                  <div key={tid} style={{ fontSize: '0.75rem', color: 'var(--status-danger)', marginTop: '2px' }}>
                    Blocked by #{tid.replace('task-', '')}
                  </div>
                ))}
                {task.blocksTaskIds?.map((tid) => (
                  <div key={tid} style={{ fontSize: '0.75rem', color: 'var(--status-warning)', marginTop: '2px' }}>
                    Blocks #{tid.replace('task-', '')}
                  </div>
                ))}
              </div>
            ) : null}

            {/* Client visibility */}
            <div className="flex items-center justify-between" style={{ padding: '0.5rem 0', fontSize: '0.75rem' }}>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Eye size={13} />
                <span>Client Visible</span>
              </span>
              <span className={`badge ${task.isClientVisible ? 'badge-healthy' : 'badge-neutral'}`}>
                {task.isClientVisible ? 'Visible' : 'Internal Only'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
