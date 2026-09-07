import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Play,
  CheckSquare,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskStatus, TaskPriority } from '../types';

interface AllTasksViewProps {
  initialMode?: 'table' | 'board';
}

export const AllTasksView: React.FC<AllTasksViewProps> = ({ initialMode = 'table' }) => {
  const {
    tasks,
    projects,
    modules,
    users,
    setSelectedTaskId,
    updateTaskStatus,
    startTimer,
    setQuickCreateOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'board'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'taskNumber'>('dueDate');

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'Backlog', label: 'Backlog', color: 'var(--text-muted)' },
    { id: 'Ready', label: 'Ready', color: '#3b82f6' },
    { id: 'In Progress', label: 'In Progress', color: 'var(--brand-crimson)' },
    { id: 'Code Review', label: 'Code Review', color: '#8b5cf6' },
    { id: 'QA', label: 'QA', color: '#f59e0b' },
    { id: 'Client Review', label: 'Client Review', color: '#ec4899' },
    { id: 'Done', label: 'Done', color: '#10b981' },
  ];

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId !== 'All' && t.projectId !== selectedProjectId) return false;
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const project = projects.find((p) => p.id === t.projectId);
      return (
        t.title.toLowerCase().includes(q) ||
        `#${t.taskNumber}`.includes(q) ||
        project?.code.toLowerCase().includes(q) ||
        project?.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'taskNumber') return b.taskNumber - a.taskNumber;
    if (sortBy === 'priority') {
      const pMap: Record<TaskPriority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div
      style={{
        padding: '1.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {viewMode === 'board' ? 'Delivery Board' : 'All Tasks'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {viewMode === 'board'
              ? 'Real-time kanban workflow across development, review, QA, and client sign-off.'
              : 'Enterprise delivery task repository with sorting, assignment, and status filters.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center gap-1" style={{ background: 'var(--bg-card)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '3px 8px' }}
            >
              <CheckSquare size={13} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`btn btn-sm ${viewMode === 'board' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '3px 8px' }}
            >
              <Layers size={13} />
              <span>Board</span>
            </button>
          </div>

          <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '130px', height: '28px', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '110px', height: '28px', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
          >
            <option value="All">All Statuses</option>
            {kanbanColumns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
            <option value="Blocked">Blocked</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '110px', height: '28px', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field"
            style={{ width: 'auto', minWidth: '120px', height: '28px', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="taskNumber">Sort: Task #</option>
          </select>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="input-field"
            style={{ paddingLeft: '26px', height: '28px', fontSize: '0.78rem' }}
          />
        </div>
      </div>

      {/* View Mode 1: Powerful Linear-style Table */}
      {viewMode === 'table' && (
        <div className="admark-card" style={{ overflow: 'hidden' }}>
          <table className="admark-table">
            <thead>
              <tr>
                <th style={{ width: '9%' }}>Task</th>
                <th style={{ width: '33%' }}>Title</th>
                <th style={{ width: '12%' }}>Project</th>
                <th style={{ width: '12%' }}>Assignee</th>
                <th style={{ width: '10%' }}>Priority</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((t) => {
                const project = projects.find((p) => p.id === t.projectId);
                const assignee = users.find((u) => u.id === t.assigneeId);
                const formattedDue = t.dueDate.replace('2025-', '').replace('-', '/');
                const isOverdue = t.status !== 'Done' && new Date(t.dueDate) < new Date('2025-03-01');

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      #{t.taskNumber}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                        {t.title}
                      </div>
                      {t.blockedReason && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--status-danger)', marginTop: '2px' }}>
                          Blocked: {t.blockedReason}
                        </div>
                      )}
                    </td>

                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      {project?.code}
                    </td>

                    <td>
                      <div className="flex items-center gap-1.5">
                        <img
                          src={assignee?.avatar}
                          alt={assignee?.name}
                          style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {assignee?.name?.split(' ')[0]}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: t.priority === 'Urgent' ? 'var(--status-danger)' : t.priority === 'High' ? 'var(--status-warning)' : 'var(--text-muted)',
                        }}
                      >
                        {t.priority}
                      </span>
                    </td>

                    <td>
                      <span className="status-indicator">
                        <span
                          className={`status-dot ${
                            t.status === 'Done'
                              ? 'healthy'
                              : t.status === 'In Progress'
                              ? 'warning'
                              : t.status === 'Blocked'
                              ? 'danger'
                              : 'info'
                          }`}
                        />
                        <span>{t.status}</span>
                      </span>
                    </td>

                    <td style={{ textAlign: 'right', fontSize: '0.78rem', color: isOverdue ? 'var(--status-danger)' : 'var(--text-secondary)', fontWeight: isOverdue ? 600 : 400 }}>
                      {formattedDue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Mode 2: Kanban Delivery Board */}
      {viewMode === 'board' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(220px, 1fr))',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
          }}
        >
          {kanbanColumns.map((col) => {
            const colTasks = sortedTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('text/plain');
                  if (taskId) {
                    updateTaskStatus(taskId, col.id);
                  }
                }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '520px',
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: col.color }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {col.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Tasks */}
                <div style={{ flex: 1, padding: '0.45rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', overflowY: 'auto' }}>
                  {colTasks.map((t) => {
                    const assignee = users.find((u) => u.id === t.assigneeId);
                    const formattedDue = t.dueDate.replace('2025-', '').replace('-', '/');

                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                        onClick={() => setSelectedTaskId(t.id)}
                        className="admark-card-interactive"
                        style={{
                          padding: '0.6rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'grab',
                        }}
                      >
                        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            #{t.taskNumber}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              color: t.priority === 'Urgent' ? 'var(--status-danger)' : t.priority === 'High' ? 'var(--status-warning)' : 'var(--text-muted)',
                            }}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '6px' }}>
                          {t.title}
                        </div>

                        {/* Footer: Assignee Avatar & Due Date */}
                        <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={assignee?.avatar}
                              alt={assignee?.name}
                              style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                              {assignee?.name?.split(' ')[0]}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {formattedDue}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
