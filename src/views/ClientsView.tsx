import React, { useState } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

export const ClientsView: React.FC = () => {
  const { clients, projects, users, setSelectedProjectId, setCurrentView, addClient } = useApp();

  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Client Form state
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Travel & Hospitality');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('London, UK');
  const [notes, setNotes] = useState('');

  const filteredClients = clients.filter((c) => {
    if (filter !== 'All' && c.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedProjects = selectedClient
    ? projects.filter((p) => p.clientId === selectedClient.id)
    : [];

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name: name.trim(),
      industry,
      website: website || 'https://client-portal.com',
      email: email || 'contact@client.com',
      phone: phone || '+1 555-0100',
      location,
      accountManagerId: users[7]?.id || users[0].id,
      status: 'Active',
      contractDetails: {
        startDate: new Date().toISOString().split('T')[0],
      },
      notes: notes || 'New enterprise client partnership.',
      contacts: [
        {
          id: `ccon-${Date.now()}`,
          name: `${name} Lead Contact`,
          designation: 'VP of Technology',
          email: email || 'contact@client.com',
          phone: phone || '+1 555-0100',
          isPrimary: true,
        },
      ],
    });

    setName('');
    setShowAddModal(false);
  };

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
      <div className="flex items-center justify-between gap-4">
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Clients
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Client company directory, account managers, and delivery projects.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
          <Plus size={14} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          {(['All', 'Active', 'Inactive', 'Archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-sm ${filter === tab ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '240px', maxWidth: '100%' }}>
          <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="input-field"
            style={{ paddingLeft: '26px', height: '28px', fontSize: '0.78rem' }}
          />
        </div>
      </div>

      {/* Main Content: aligned master-detail */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(300px, 0.95fr)',
          gap: '1.25rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* Client List */}
        <div className="admark-card" style={{ minWidth: 0, overflow: 'hidden' }}>
          <table className="admark-table" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '34%' }}>Client</th>
                <th style={{ width: '24%' }}>Industry</th>
                <th style={{ width: '14%' }}>Projects</th>
                <th style={{ width: '14%' }}>Status</th>
                <th style={{ width: '14%', textAlign: 'right' }}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => {
                const clientProjects = projects.filter((p) => p.clientId === client.id);
                const isSelected = selectedClient?.id === client.id;

                return (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--bg-elevated)' : undefined,
                    }}
                  >
                    <td style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }} className="truncate">
                        {client.name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }} className="truncate">
                        {client.location}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', minWidth: 0 }} className="truncate">
                      {client.industry}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {clientProjects.length} active
                      </span>
                    </td>
                    <td>
                      <span className="status-indicator">
                        <span className={`status-dot ${client.status === 'Active' ? 'healthy' : 'neutral'}`} />
                        <span>{client.status}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {client.lastActivity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Client Profile Card */}
        {selectedClient ? (
          <div
            className="admark-card"
            style={{
              minWidth: 0,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'sticky',
              top: '1rem',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3" style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--brand-crimson)',
                    flexShrink: 0,
                  }}
                >
                  {selectedClient.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                      wordBreak: 'break-word',
                    }}
                  >
                    {selectedClient.name}
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    <div>{selectedClient.industry}</div>
                    <div>{selectedClient.location}</div>
                    {selectedClient.contractDetails?.startDate && (
                      <div style={{ color: 'var(--text-muted)' }}>
                        Partner since {selectedClient.contractDetails.startDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <span className="badge badge-healthy" style={{ flexShrink: 0 }}>
                {selectedClient.status}
              </span>
            </div>

            {/* Client Contacts */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                Client Contacts ({selectedClient.contacts.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedClient.contacts.map((con) => (
                  <div
                    key={con.id}
                    style={{
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.375rem',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      minWidth: 0,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span style={{ fontWeight: 600, fontSize: '0.8125rem' }} className="truncate">
                        {con.name}
                      </span>
                      {con.isPrimary && <span className="badge badge-purple" style={{ flexShrink: 0 }}>Primary</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-crimson)', marginTop: '2px' }} className="truncate">
                      {con.designation}
                    </div>
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1.5" style={{ minWidth: 0 }}>
                        <Mail size={12} style={{ flexShrink: 0 }} />
                        <span className="truncate">{con.email}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={12} style={{ flexShrink: 0 }} />
                        <span>{con.phone}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                Active Projects Under Delivery
              </div>
              {selectedProjects.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                  No projects linked to this client.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setCurrentView('projects');
                      }}
                      className="admark-card-interactive flex items-center justify-between gap-2"
                      style={{
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.375rem',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        minWidth: 0,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="flex items-center gap-1.5" style={{ minWidth: 0 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-crimson)', flexShrink: 0 }}>
                            {p.code}
                          </span>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }} className="truncate">
                            {p.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Progress: {p.progress}%
                        </div>
                      </div>
                      <ExternalLink size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="admark-card"
            style={{
              minWidth: 0,
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Select a client from the table to view their account profile and contracts.
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div
            className="admark-card"
            style={{ width: '100%', maxWidth: '540px', padding: '1.5rem', borderRadius: '0.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add New Client Account</h2>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="flex flex-col gap-3">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Company Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zenith Global Logistics"
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
