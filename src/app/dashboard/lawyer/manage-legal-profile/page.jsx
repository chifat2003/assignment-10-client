'use client';

import React, { useState } from 'react';

const ManageLegalProfile = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Contract Review',
      bio: 'Comprehensive review of legal contracts and agreements',
      fee: '$150/hour',
      specialization: 'Corporate Law',
      image: '📋',
    },
    {
      id: 2,
      name: 'Legal Consultation',
      bio: 'General legal advice and consultation services',
      fee: '$100/hour',
      specialization: 'General Practice',
      image: '⚖️',
    },
    {
      id: 3,
      name: 'Document Drafting',
      bio: 'Professional drafting of legal documents',
      fee: '$120/hour',
      specialization: 'Document Preparation',
      image: '📝',
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    bio: '',
    fee: '',
    specialization: '',
    image: '📋',
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices((prev) => prev.filter((service) => service.id !== id));
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const handleSaveEdit = () => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === editingId ? { ...editForm } : service
      )
    );
    setEditingId(null);
  };

  const handleAddService = () => {
    if (newService.name && newService.bio && newService.fee && newService.specialization) {
      setServices((prev) => [
        ...prev,
        { id: Date.now(), ...newService },
      ]);
      setNewService({
        name: '',
        bio: '',
        fee: '',
        specialization: '',
        image: '📋',
      });
      setShowAddForm(false);
    }
  };

  return (
    <div style={{ padding: '24px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
          Manage Legal Services
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          Add, edit, or remove your legal services
        </p>
      </div>

      {/* Add Service Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          background: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '24px',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.background = '#2563eb'}
        onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
      >
        + Add New Service
      </button>

      {/* Add Service Form */}
      {showAddForm && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #3b4256',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Add New Service</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid #3b4256',
                borderRadius: '8px',
                padding: '10px',
                color: '#ffffff',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Fee"
              value={newService.fee}
              onChange={(e) => setNewService({ ...newService, fee: e.target.value })}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid #3b4256',
                borderRadius: '8px',
                padding: '10px',
                color: '#ffffff',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Specialization"
              value={newService.specialization}
              onChange={(e) => setNewService({ ...newService, specialization: e.target.value })}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid #3b4256',
                borderRadius: '8px',
                padding: '10px',
                color: '#ffffff',
                fontSize: '14px',
              }}
            />
          </div>
          <textarea
            placeholder="Service Description"
            value={newService.bio}
            onChange={(e) => setNewService({ ...newService, bio: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid #3b4256',
              borderRadius: '8px',
              padding: '10px',
              color: '#ffffff',
              fontSize: '14px',
              minHeight: '80px',
              fontFamily: 'inherit',
              marginBottom: '16px',
            }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddService}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Save Service
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                background: '#6b7280',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        {services.map((service) =>
          editingId === service.id ? (
            <div
              key={service.id}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{ color: '#ffffff', marginBottom: '12px' }}>Edit Service</h3>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '6px',
                  padding: '8px',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              />
              <input
                type="text"
                value={editForm.fee}
                onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '6px',
                  padding: '8px',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              />
              <input
                type="text"
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '6px',
                  padding: '8px',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              />
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid #3b4256',
                  borderRadius: '6px',
                  padding: '8px',
                  color: '#ffffff',
                  minHeight: '60px',
                  marginBottom: '12px',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    flex: 1,
                    background: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={service.id}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #3b4256',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3b4256';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{service.image}</div>
              <h3 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                {service.name}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 12px 0' }}>
                {service.specialization}
              </p>
              <p style={{ color: '#e5e7eb', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                {service.bio}
              </p>
              <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', margin: '0 0 16px 0' }}>
                {service.fee}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(service)}
                  style={{
                    flex: 1,
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  style={{
                    flex: 1,
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {services.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <p>No services added yet. Click "Add New Service" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ManageLegalProfile;
