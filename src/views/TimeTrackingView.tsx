import React, { useState } from 'react';
import { Clock, Play, Square, Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TimeTrackingView: React.FC = () => {
  const { timeLogs, users, projects, tasks, activeTimer, startTimer, stopTimer, setQuickCreateOpen } = useApp();

  const [filterUser, setFilterUser] = useState('All');
  const [filterProject, setFilterProject] = useState('All');

  const filteredLogs = timeLogs.filter((l) => {
    if (filterUser !== 'All' && l.userId !== filterUser) return false;
    if (filterProject !== 'All' && l.projectId !== filterProject) return false;
    return true;
  });

  const todayHours = filteredLogs
    .filter((l) => l.date === '2025-02-27' || l.date === '2025-02-26')
    .reduce((acc, l) => acc + l.hours, 0);

  const weeklyHours = filteredLogs.reduce((acc, l) => acc + l.hours, 0);

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
            Time Tracking
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Record developer working sessions, timesheets, and billable project allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTimer.isRunning ? (
            <button
              onClick={stopTimer}
              className="btn btn-sm"
              style={{ background: 'var(--brand-crimson)', color: '#fff' }}
            >
              <Square size={13} fill="currentColor" />
              <span>Stop Active Timer</span>
            </button>
          ) : (
            <button
              onClick={() => {
                const task = tasks[0];
                if (task) startTimer(task.id, `#${task.taskNumber} ${task.title}`, task.projectId);
              }}
              className="btn btn-secondary btn-sm"
            >
              <Play size={13} />
              <span>Start Timer</span>
            </button>
          )}

          <button onClick={() => setQuickCreateOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Log Time</span>
          </button>
        </div>
      </div>

      {/* 29. Top: Today's Time & Weekly Time in KPI strip */}
      <div className="kpi-strip">
        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Today's Time
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            6h 42m
          </div>
        </div>

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Weekly Logged
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {weeklyHours.toFixed(1)}h / 40h
          </div>
        </div>

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Session
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: activeTimer.isRunning ? 'var(--brand-crimson)' : 'var(--text-muted)', marginTop: '4px' }}>
            {activeTimer.isRunning
              ? `${Math.floor(activeTimer.elapsedSeconds / 60)}m ${activeTimer.elapsedSeconds % 60}s (${activeTimer.taskTitle})`
              : 'Idle (no running timer)'}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '130px', height: '28px', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
          >
            <option value="All">All Team Members</option>
            {users
              .filter((u) => u.role !== 'CLIENT' && u.role !== 'PHOTO_ADMIN')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
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
        </div>
      </div>

      {/* 29. Recent Time Logs Table */}
      <div className="admark-card" style={{ overflow: 'hidden' }}>
        <table className="admark-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Task</th>
              <th style={{ width: '16%' }}>Project</th>
              <th style={{ width: '18%' }}>Team Member</th>
              <th style={{ width: '12%' }}>Duration</th>
              <th style={{ width: '18%' }}>Date</th>
              <th style={{ width: '14%', textAlign: 'right' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
              const user = users.find((u) => u.id === log.userId);
              const project = projects.find((p) => p.id === log.projectId);
              const task = tasks.find((t) => t.id === log.taskId);

              return (
                <tr key={log.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                      {task ? `#${task.taskNumber} ${task.title}` : log.description || 'General engineering'}
                    </div>
                  </td>

                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {project?.code || 'Internal'}
                  </td>

                  <td>
                    <div className="flex items-center gap-1.5">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{user?.name}</span>
                    </div>
                  </td>

                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                    {log.hours.toFixed(1)}h
                  </td>

                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {log.date}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <span className={`badge ${log.isBillable ? 'badge-healthy' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {log.isBillable ? 'Billable' : 'Internal'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
