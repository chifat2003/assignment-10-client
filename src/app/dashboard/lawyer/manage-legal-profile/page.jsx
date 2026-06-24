'use client';

import React, { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { createService } from '@/lib/action/newservice';

const ManageLegalProfile = () => {
  const { data: session, isPending } = useSession();
  
  const [services, setServices] = useState([
    { id: 1, name: 'Contract Review', bio: 'Comprehensive review of legal contracts and agreements', fee: '$150/hour', specialization: 'Corporate Law', image: '📋' },
    { id: 2, name: 'Legal Consultation', bio: 'General legal advice and consultation services', fee: '$100/hour', specialization: 'General Practice', image: '⚖️' },
    { id: 3, name: 'Document Drafting', bio: 'Professional drafting of legal documents', fee: '$120/hour', specialization: 'Document Preparation', image: '📝' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', bio: '', fee: '', specialization: '', image: '📋' });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const inputStyle = {
    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #3b4256',
    borderRadius: '8px', padding: '10px 12px', color: '#ffffff', fontSize: '14px',
    boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveEdit = () => {
    setServices((prev) => prev.map((s) => (s.id === editingId ? { ...editForm } : s)));
    setEditingId(null);
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.bio || !newService.fee || !newService.specialization) return;

    setAdding(true);
    setAddError('');

    try {
      // Include lawyer data from session along with service data
      const serviceData = {
        ...newService,
        lawyerId: session?.user?.id,
        lawyerName: session?.user?.name,
        lawyerEmail: session?.user?.email,
        lawyerImage: session?.user?.image,
      };

      // POST to /api/add-new-service via the createService server action in src/lib/action/newservice.js
      const result = await createService(serviceData);

      // Use the id returned by the API if available, otherwise fall back to Date.now()
      const serviceToAdd = { ...newService, id: result?.id ?? Date.now() };
      setServices((prev) => [...prev, serviceToAdd]);
      setNewService({ name: '', bio: '', fee: '', specialization: '', image: '📋' });
      setShowAddForm(false);
    } catch (err) {
      setAddError('Failed to save service. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ padding: '16px', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @media (min-width: 640px) { .mlp-wrap { padding: 24px !important; } }

        .mlp-add-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }
        @media (min-width: 640px) {
          .mlp-add-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .mlp-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px)  { .mlp-services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .mlp-services-grid { grid-template-columns: repeat(3, 1fr); } }

        .mlp-btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .mlp-btn-row button { flex: 1; min-width: 100px; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>Manage Legal Services</h1>
        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>Add, edit, or remove your legal services</p>
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#2563eb')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#3b82f6')}
      >
        + Add New Service
      </button>

      {/* Add form */}
      {showAddForm && (
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid #3b4256', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <h3 style={{ color: '#ffffff', margin: '0 0 14px 0', fontSize: 16 }}>Add New Service</h3>

          <div className="mlp-add-grid">
            <input style={inputStyle} type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
            <input style={inputStyle} type="text" placeholder="Fee (e.g. $150/hr)" value={newService.fee} onChange={(e) => setNewService({ ...newService, fee: e.target.value })} />
            <input style={inputStyle} type="text" placeholder="Specialization" value={newService.specialization} onChange={(e) => setNewService({ ...newService, specialization: e.target.value })} />
          </div>

          <textarea
            placeholder="Service Description"
            value={newService.bio}
            onChange={(e) => setNewService({ ...newService, bio: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: '14px' }}
          />

          <div className="mlp-btn-row">
            <button onClick={handleAddService} disabled={adding} style={{ background: adding ? '#059669' : '#10b981', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '7px', cursor: adding ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, opacity: adding ? 0.75 : 1 }}>
              {adding ? 'Saving...' : 'Save Service'}
            </button>
            <button onClick={() => { setShowAddForm(false); setAddError(''); }} style={{ background: '#6b7280', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: 14 }}>
              Cancel
            </button>
          </div>

          {addError && (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#f87171' }}>{addError}</p>
          )}
        </div>
      )}

      {/* Services grid */}
      <div className="mlp-services-grid">
        {services.map((service) =>
          editingId === service.id ? (
            /* Edit card */
            <div key={service.id} style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '2px solid #3b82f6', borderRadius: '12px', padding: '18px' }}>
              <h3 style={{ color: '#ffffff', margin: '0 0 12px 0', fontSize: 15 }}>Edit Service</h3>
              <input style={{ ...inputStyle, marginBottom: 10 }} type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Service Name" />
              <input style={{ ...inputStyle, marginBottom: 10 }} type="text" value={editForm.fee} onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })} placeholder="Fee" />
              <input style={{ ...inputStyle, marginBottom: 10 }} type="text" value={editForm.specialization} onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })} placeholder="Specialization" />
              <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', marginBottom: 12 }} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
              <div className="mlp-btn-row">
                <button onClick={handleSaveEdit} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ flex: 1, background: '#6b7280', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            /* View card */
            <div
              key={service.id}
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid #3b4256', borderRadius: '12px', padding: '18px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 12px rgba(59,130,246,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3b4256'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>{service.image}</div>
              <h3 style={{ color: '#ffffff', margin: '0 0 4px 0', fontSize: 16, fontWeight: 700 }}>{service.name}</h3>
              <p style={{ color: '#9ca3af', fontSize: 12, margin: '0 0 10px 0' }}>{service.specialization}</p>
              <p style={{ color: '#e5e7eb', fontSize: 13, margin: '0 0 10px 0', lineHeight: 1.5 }}>{service.bio}</p>
              <p style={{ color: '#10b981', fontSize: 14, fontWeight: 600, margin: '0 0 14px 0' }}>{service.fee}</p>
              <div className="mlp-btn-row">
                <button onClick={() => { setEditingId(service.id); setEditForm(service); }} style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Edit</button>
                <button onClick={() => handleDelete(service.id)} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          )
        )}
      </div>

      {services.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: 14 }}>
          No services added yet. Click "+ Add New Service" to get started.
        </div>
      )}
    </div>
  );
};

export default ManageLegalProfile;
