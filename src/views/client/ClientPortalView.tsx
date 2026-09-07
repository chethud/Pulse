import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Send,
  Flag,
  Rocket,
  FileText,
  AlertCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientPortalView: React.FC = () => {
  const {
    currentUser,
    projects,
    milestones,
    releases,
    clientUAT,
    documents,
    changeRequests,
    addChangeRequest,
    approveMilestone,
    approveRelease,
    updateUATStatus,
  } = useApp();

  // Active client: Alliance Travel or ABC Technologies
  const clientProjects = projects.filter((p) => p.clientId === 'client-1' || p.clientId === currentUser.clientId);
  const activeProj = clientProjects[0] || projects[0];

  const clientMilestones = milestones.filter((m) => m.projectId === activeProj.id);
  const clientReleases = releases.filter((r) => r.projectId === activeProj.id);
  const uatItems = clientUAT.filter((u) => u.projectId === activeProj.id);
  const sharedDocs = documents.filter((d) => d.projectId === activeProj.id && d.isClientVisible);

  // Client Request / CR state
  const [requestTitle, setRequestTitle] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestPriority, setRequestPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim() || !requestReason.trim()) return;

    addChangeRequest({
      projectId: activeProj.id,
      clientId: activeProj.clientId,
      title: requestTitle.trim(),
      businessReason: requestReason.trim(),
      requestedBy: `${currentUser.name} (${currentUser.title})`,
      developmentEffortHours: 0,
      designEffortHours: 0,
      qaEffortHours: 0,
      costImpact: 0,
      timelineImpactDays: 0,
      priority: requestPriority,
      status: 'Requested',
    });

    setRequestTitle('');
    setRequestReason('');
    setShowRequestModal(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Client Restricted Banner */}
      <div
        className="admark-card flex items-center justify-between"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderColor: 'var(--brand-crimson)',
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} color="var(--brand-crimson)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--brand-crimson)', textTransform: 'uppercase' }}>
              Client Secure Partner Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            Welcome, {currentUser.name} (Alliance Travel)
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Track project deliverables, review milestone sign-offs, execute UAT acceptance tests, and submit feature requests.
          </p>
        </div>

        <button onClick={() => setShowRequestModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Raise Client Request</span>
        </button>
      </div>

      {/* Project Delivery Status Card */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-crimson)' }}>
              {activeProj.code}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeProj.name}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Target Release Deadline: {activeProj.deadline}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-crimson)' }}>
              {activeProj.progress}% Delivered
            </div>
            <span className="badge badge-healthy">On Schedule for Q2 Launch</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-track" style={{ height: '8px', marginBottom: '1rem' }}>
          <div className="progress-bar-fill" style={{ width: `${activeProj.progress}%`, backgroundColor: 'var(--brand-crimson)' }} />
        </div>

        {activeProj.stagingUrl && (
          <div className="flex items-center justify-between" style={{ background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Interactive Client Staging Environment</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Test the latest candidate build directly in your browser</div>
            </div>
            <a href={activeProj.stagingUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
              <ExternalLink size={14} />
              <span>Launch Staging Preview</span>
            </a>
          </div>
        )}
      </div>

      {/* Milestones & Deliverables Section */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Project Milestones & Deliverables</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Official sign-off checkpoints for development phases
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clientMilestones.map((m) => (
            <div
              key={m.id}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 800, color: 'var(--brand-crimson)', fontSize: '0.85rem' }}>
                    Milestone {m.number}:
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.name}</span>
                  <span className={`badge ${m.status === 'Completed' ? 'badge-healthy' : 'badge-neutral'}`}>
                    {m.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {m.description}
                </div>
                <div className="flex flex-wrap gap-2" style={{ marginTop: '6px' }}>
                  {m.deliverables.map((d, i) => (
                    <span key={i} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      • {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {m.isClientApproved ? (
                  <span className="badge badge-healthy" style={{ padding: '0.4rem 0.75rem' }}>
                    <CheckCircle2 size={14} />
                    <span>Signed-off ({m.approvalDate})</span>
                  </span>
                ) : (
                  <button onClick={() => approveMilestone(m.id)} className="btn btn-primary btn-sm">
                    <CheckCircle2 size={14} />
                    <span>Approve Deliverable</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client UAT Testing Center */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>User Acceptance Testing (UAT) Verification</h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Review core features and confirm whether they meet business requirements
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {uatItems.map((uat) => (
            <div
              key={uat.id}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{uat.featureTitle}</span>
                <div className="flex items-center gap-2">
                  <span className={`badge ${uat.status === 'Passed' ? 'badge-healthy' : uat.status === 'Needs Change' ? 'badge-critical' : 'badge-neutral'}`}>
                    {uat.status}
                  </span>
                  <button onClick={() => updateUATStatus(uat.id, 'Passed')} className="btn btn-sm btn-secondary">
                    Approve Feature
                  </button>
                  <button onClick={() => updateUATStatus(uat.id, 'Needs Change', 'Requested revision from client portal')} className="btn btn-sm btn-danger">
                    Request Adjustment
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {uat.description}
              </p>

              {uat.clientFeedback && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--status-warning)' }}>
                  <strong>Your Feedback:</strong> {uat.clientFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shared Client Deliverable Documents */}
      <div className="admark-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Approved Project Deliverables</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sharedDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between" style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '4px' }}>
              <div className="flex items-center gap-2">
                <FileText size={18} color="var(--brand-crimson)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.name}</span>
                <span className="badge badge-purple">{doc.currentVersion}</span>
              </div>
              <button className="btn btn-secondary btn-sm">Download</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Raise Client Request */}
      {showRequestModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowRequestModal(false)}>
          <div className="admark-card" style={{ width: '100%', maxWidth: '520px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Raise New Request or Enhancement</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Your request will be submitted to the Project Manager for technical impact analysis, effort estimation, and formal quote.
            </p>

            <form onSubmit={handleSubmitRequest} className="flex flex-col gap-3">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Feature / Request Title *</label>
                <input
                  required
                  type="text"
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  placeholder="e.g. Add Apple Pay support to mobile checkout"
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Business Reason & Details *</label>
                <textarea
                  required
                  rows={4}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Explain why this is needed, target audience, and expected outcome..."
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowRequestModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
