'use client';

import { useSession } from '@/lib/auth-client';

const mockHiringHistory = [
  { id: 1, lawyerName: 'Alexandra Chen', specialisation: 'Corporate Law', fee: '$250/hr', hiringDate: 'Jun 20, 2026', status: 'accepted' },
  { id: 2, lawyerName: 'David Okonkwo', specialisation: 'Criminal Defense', fee: '$180/hr', hiringDate: 'Jun 18, 2026', status: 'pending' },
  { id: 3, lawyerName: 'Marcus Rivera', specialisation: 'Family Law', fee: '$150/hr', hiringDate: 'Jun 10, 2026', status: 'rejected' },
  { id: 4, lawyerName: 'Priya Sharma', specialisation: 'Immigration Law', fee: '$200/hr', hiringDate: 'May 28, 2026', status: 'accepted' },
];

const statusStyles = {
  pending: { bg: 'rgba(234,179,8,0.12)', color: '#facc15', label: 'Pending' },
  accepted: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', label: 'Accepted' },
  rejected: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', label: 'Rejected' },
};

export default function HiringHistory() {
  const { isPending } = useSession();

  if (isPending) return <div style={{ padding: 24, color: '#94a3b8' }}>Loading...</div>;

  return (
    <div style={{ padding: '16px' }}>
      <style>{`
        @media (min-width: 640px) { .hh-wrap { padding: 24px !important; } }

        /* hide mobile cards on desktop, hide table on mobile */
        .hh-table-wrap { display: none; }
        .hh-cards     { display: flex; flex-direction: column; gap: 12px; }

        @media (min-width: 640px) {
          .hh-table-wrap { display: block; }
          .hh-cards      { display: none; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>Hiring History</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#94a3b8' }}>
          Track all your lawyer hiring requests and their statuses.
        </p>
      </div>

      {/* ── Desktop table ── */}
      <div
        className="hh-table-wrap"
        style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Lawyer Name', 'Specialisation', 'Fee', 'Hiring Date', 'Status', 'Action'].map((col) => (
                  <th key={col} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockHiringHistory.map((row, idx) => {
                const s = statusStyles[row.status];
                return (
                  <tr
                    key={row.id}
                    style={{ borderBottom: idx < mockHiringHistory.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', color: '#f1f5f9', fontWeight: 600 }}>{row.lawyerName}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{row.specialisation}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{row.fee}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{row.hiringDate}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {row.status === 'accepted' ? (
                        <button
                          style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span style={{ color: '#475569', fontSize: 13 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="hh-cards">
        {mockHiringHistory.map((row) => {
          const s = statusStyles[row.status];
          return (
            <div
              key={row.id}
              style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 16 }}
            >
              {/* Top row: name + status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{row.lawyerName}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>{row.specialisation}</p>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {s.label}
                </span>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{row.fee}</span>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{row.hiringDate}</span>
              </div>

              {/* Action */}
              {row.status === 'accepted' && (
                <button
                  style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Pay Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
