import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Bug, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { projects, clients, setSelectedProjectId } = useApp();

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
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Delivery Reports
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Cross-project velocity, milestone on-time performance, and SLA compliance metrics.
        </p>
      </div>

      {/* 30. Clean KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Milestone On-Time SLA
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--status-healthy)', marginTop: '2px' }}>
            91.4%
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            11 of 12 phase milestones signed off on target
          </div>
        </div>

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Defect Resolution
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            1.8 Days
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Average turnaround for Critical QA defects
          </div>
        </div>

        <div className="kpi-strip-item">
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Deployment Frequency
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            2.4 / wk
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Zero-downtime releases to staging & prod
          </div>
        </div>
      </div>

      {/* Project Delivery Health & Performance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
          Portfolio Health & Delivery Status
        </div>

        <div className="admark-card" style={{ overflow: 'hidden' }}>
          <table className="admark-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Project</th>
                <th style={{ width: '18%' }}>Client</th>
                <th style={{ width: '14%' }}>Status</th>
                <th style={{ width: '18%' }}>Health Score</th>
                <th style={{ width: '10%' }}>Progress</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const client = clients.find((c) => c.id === p.clientId);

                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view project details"
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {p.code}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                      </div>
                    </td>

                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      {client?.name || 'Enterprise Client'}
                    </td>

                    <td>
                      <span className="status-indicator">
                        <span className={`status-dot ${p.health.overall === 'Healthy' ? 'healthy' : p.health.overall === 'At Risk' ? 'warning' : 'danger'}`} />
                        <span>{p.health.overall}</span>
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar-track" style={{ flex: 1, height: '3px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${p.health.score}%`,
                              backgroundColor: p.health.overall === 'Healthy' ? 'var(--status-healthy)' : 'var(--text-secondary)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{p.health.score}/100</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {p.progress}%
                      </span>
                    </td>

                    <td style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {p.deadline}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
