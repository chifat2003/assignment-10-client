'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

const ITEMS_PER_PAGE = 12;

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState(() => {
    return searchParams.get('lawyer') || '';
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');

        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const specializations = useMemo(
    () => [...new Set(services.map(s => s.specialization))].sort(),
    [services]
  );

  const lawyers = useMemo(
    () => [...new Set(services.map(s => s.lawyerName))].sort(),
    [services]
  );

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization = !selectedSpecialization || service.specialization === selectedSpecialization;
      const matchesLawyer = !selectedLawyer || service.lawyerName === selectedLawyer;
      return matchesSearch && matchesSpecialization && matchesLawyer;
    });
  }, [services, searchTerm, selectedSpecialization, selectedLawyer]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialization, selectedLawyer]);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Legal Services
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', margin: 0 }}>
            Browse our comprehensive selection of legal services from expert lawyers
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Search Services
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f1f5f9',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f1f5f9',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lawyer
            </label>
            <select
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f1f5f9',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <option value="">All Lawyers</option>
              {lawyers.map(lawyer => (
                <option key={lawyer} value={lawyer}>{lawyer}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24, fontSize: 14, color: '#94a3b8' }}>
          Showing <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{paginatedServices.length}</span> of{' '}
          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{filteredServices.length}</span> services
        </div>

        {paginatedServices.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
              {paginatedServices.map(service => (
                <div
                  key={service.id}
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(15, 12, 35, 0.95)',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{service.image}</div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                      {service.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{service.specialization}</p>
                  </div>

                  <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                    {service.bio}
                  </p>

                  <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}>
                    <p style={{ margin: '0 0 4px', color: '#64748b' }}>Offered by</p>
                    <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700 }}>{service.lawyerName}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#6366f1' }}>{service.fee}</span>
                    <Link
                      href={`/lawyers?service=${service.id}`}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(99,102,241,0.3)',
                    background: currentPage === 1 ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.1)',
                    color: currentPage === 1 ? '#475569' : '#818cf8',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  ← Previous
                </button>

                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        border: page === currentPage ? '1px solid #6366f1' : '1px solid rgba(99,102,241,0.2)',
                        background: page === currentPage ? 'rgba(99,102,241,0.2)' : 'transparent',
                        color: page === currentPage ? '#818cf8' : '#64748b',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(99,102,241,0.3)',
                    background: currentPage === totalPages ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.1)',
                    color: currentPage === totalPages ? '#475569' : '#818cf8',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: 60, textAlign: 'center', color: '#475569' }}>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No services found</p>
            <p style={{ fontSize: 14 }}>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <ServicesPageContent />
    </Suspense>
  );
}
