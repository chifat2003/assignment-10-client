'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

const ITEMS_PER_PAGE = 12;

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState(() => {
    // Pre-fill lawyer filter from URL parameter if provided
    return searchParams.get('lawyer') || '';
  });

  // Fetch services from database
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
        // Fallback to mock data if API fails
        const mockServices = [
          {
            id: 1,
            name: 'Contract Review',
            bio: 'Comprehensive review of legal contracts and agreements',
            fee: '$150/hour',
            specialization: 'Corporate Law',
            image: '📋',
            lawyerName: 'Alexandra Chen',
            lawyerEmail: 'alexandra@example.com',
          },
          {
            id: 2,
            name: 'Legal Consultation',
            bio: 'General legal advice and consultation services',
            fee: '$100/hour',
            specialization: 'General Practice',
            image: '⚖️',
            lawyerName: 'Marcus Rivera',
            lawyerEmail: 'marcus@example.com',
          },
          {
            id: 3,
            name: 'Document Drafting',
            bio: 'Professional drafting of legal documents',
            fee: '$120/hour',
            specialization: 'Document Preparation',
            image: '📝',
            lawyerName: 'Priya Sharma',
            lawyerEmail: 'priya@example.com',
          },
          {
            id: 4,
            name: 'Criminal Defense',
            bio: 'Expert representation in criminal cases',
            fee: '$200/hour',
            specialization: 'Criminal Law',
            image: '🔨',
            lawyerName: 'David Okonkwo',
            lawyerEmail: 'david@example.com',
          },
          {
            id: 5,
            name: 'Family Law Mediation',
            bio: 'Mediation services for family law disputes',
            fee: '$180/hour',
            specialization: 'Family Law',
            image: '👨‍👩‍👧‍👦',
            lawyerName: 'Sofia Nguyen',
            lawyerEmail: 'sofia@example.com',
          },
          {
            id: 6,
            name: 'Intellectual Property',
            bio: 'Protection and enforcement of intellectual property rights',
            fee: '$250/hour',
            specialization: 'Intellectual Property',
            image: '💡',
            lawyerName: 'James O\'Brien',
            lawyerEmail: 'james@example.com',
          },
          {
            id: 7,
            name: 'Real Estate Consultation',
            bio: 'Legal guidance on real estate transactions',
            fee: '$140/hour',
            specialization: 'Real Estate',
            image: '🏠',
            lawyerName: 'Alexandra Chen',
            lawyerEmail: 'alexandra@example.com',
          },
          {
            id: 8,
            name: 'Immigration Assistance',
            bio: 'Help with immigration matters and visa processing',
            fee: '$130/hour',
            specialization: 'Immigration Law',
            image: '✈️',
            lawyerName: 'David Okonkwo',
            lawyerEmail: 'david@example.com',
          },
          {
            id: 9,
            name: 'Tax Law Consultation',
            bio: 'Expert tax planning and strategy',
            fee: '$220/hour',
            specialization: 'Tax Law',
            image: '📊',
            lawyerName: 'Marcus Rivera',
            lawyerEmail: 'marcus@example.com',
          },
          {
            id: 10,
            name: 'Wills and Estate Planning',
            bio: 'Comprehensive estate planning services',
            fee: '$160/hour',
            specialization: 'Estate Planning',
            image: '📄',
            lawyerName: 'Priya Sharma',
            lawyerEmail: 'priya@example.com',
          },
          {
            id: 11,
            name: 'Business Formation',
            bio: 'Legal assistance in forming and structuring businesses',
            fee: '$170/hour',
            specialization: 'Corporate Law',
            image: '🏢',
            lawyerName: 'Sofia Nguyen',
            lawyerEmail: 'sofia@example.com',
          },
          {
            id: 12,
            name: 'Labor Law Advisory',
            bio: 'Employment and labor law consultation',
            fee: '$190/hour',
            specialization: 'Labor Law',
            image: '👔',
            lawyerName: 'James O\'Brien',
            lawyerEmail: 'james@example.com',
          },
          {
            id: 13,
            name: 'Intellectual Property Filing',
            bio: 'Patent and trademark filing services',
            fee: '$280/hour',
            specialization: 'Intellectual Property',
            image: '📋',
            lawyerName: 'Sofia Nguyen',
            lawyerEmail: 'sofia@example.com',
          },
          {
            id: 14,
            name: 'Litigation Support',
            bio: 'Full litigation support and representation',
            fee: '$240/hour',
            specialization: 'Civil Litigation',
            image: '⚔️',
            lawyerName: 'Marcus Rivera',
            lawyerEmail: 'marcus@example.com',
          },
          {
            id: 15,
            name: 'Corporate Compliance',
            bio: 'Ensure your business stays compliant with regulations',
            fee: '$210/hour',
            specialization: 'Corporate Law',
            image: '✅',
            lawyerName: 'James O\'Brien',
            lawyerEmail: 'james@example.com',
          },
        ];

        setServices(mockServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique specializations and lawyers for filters
  const specializations = useMemo(
    () => [...new Set(services.map(s => s.specialization))].sort(),
    [services]
  );

  const lawyers = useMemo(
    () => [...new Set(services.map(s => s.lawyerName))].sort(),
    [services]
  );

  // Filter services
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

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialization, selectedLawyer]);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Legal Services
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', margin: 0 }}>
            Browse our comprehensive selection of legal services from expert lawyers
          </p>
        </div>

        {/* Filters Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
          {/* Search */}
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

          {/* Specialization Filter */}
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
                background:'black',
              }}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Lawyer Filter */}
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
                background:'black',
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

        {/* Results info */}
        <div style={{ marginBottom: 24, fontSize: 14, color: '#94a3b8' }}>
          Showing <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{paginatedServices.length}</span> of{' '}
          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{filteredServices.length}</span> services
        </div>

        {/* Services Grid */}
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
                  {/* Icon & Name */}
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{service.image}</div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                      {service.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{service.specialization}</p>
                  </div>

                  {/* Description */}
                  <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                    {service.bio}
                  </p>

                  {/* Lawyer Info */}
                  <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 12 }}>
                    <p style={{ margin: '0 0 4px', color: '#64748b' }}>Offered by</p>
                    <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700 }}>{service.lawyerName}</p>
                  </div>

                  {/* Fee & Button */}
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

            {/* Pagination */}
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

                {/* Page numbers */}
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
