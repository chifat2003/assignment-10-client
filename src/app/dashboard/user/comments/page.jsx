'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';

const mockComments = [
  { id: 1, lawyerName: 'Alexandra Chen', lawyerSpecialisation: 'Corporate Law', comment: 'Extremely professional and knowledgeable. Helped me navigate a complex merger deal with confidence.', rating: 5, date: 'Jun 20, 2026' },
  { id: 2, lawyerName: 'Marcus Rivera',  lawyerSpecialisation: 'Criminal Defense', comment: 'Very responsive and handled my case efficiently. Would definitely recommend.', rating: 4, date: 'Jun 10, 2026' },
  { id: 3, lawyerName: 'Priya Sharma',   lawyerSpecialisation: 'Immigration Law', comment: 'Great experience overall. Made the whole immigration process stress-free.', rating: 5, date: 'May 28, 2026' },
];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star} type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 0, fontSize: 20, color: star <= (hovered || value) ? '#facc15' : '#334155' }}
        >★</button>
      ))}
    </div>
  );
}

function EditModal({ comment, onClose, onSave }) {
  const [text, setText]     = useState(comment.comment);
  const [rating, setRating] = useState(comment.rating);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Edit Comment</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{comment.lawyerName} · {comment.lawyerSpecialisation}</p>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div>
          <label htmlFor="edit-comment" style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Comment</label>
          <textarea
            id="edit-comment" value={text} rows={4}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f1f5f9', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave({ ...comment, comment: text, rating })} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ comment, onClose, onConfirm }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)', background: '#0f172a', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxSizing: 'border-box' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Delete Comment</h2>
        <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
          Are you sure you want to delete your comment on{' '}
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{comment.lawyerName}</span>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function UserComments() {
  const { isPending } = useSession();
  const [comments, setComments]       = useState(mockComments);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (isPending) return <div style={{ padding: 24, color: '#94a3b8' }}>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <style>{`
        @media (min-width: 640px) { .cm-wrap { padding: 24px !important; } }
        .cm-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px)  { .cm-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .cm-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>My Comments</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#94a3b8' }}>Reviews and comments you've left on lawyer profiles.</p>
      </div>

      {comments.length === 0 && (
        <div style={{ padding: 40, borderRadius: 14, border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: '#475569', fontSize: 14 }}>
          You haven't left any comments yet.
        </div>
      )}

      <div className="cm-grid">
        {comments.map((c) => (
          <div
            key={c.id}
            style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>{c.lawyerName}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{c.lawyerSpecialisation}</p>
            </div>

            <StarRating value={c.rating} />

            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.6, flexGrow: 1 }}>"{c.comment}"</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 12, color: '#475569' }}>{c.date}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditTarget(c)}
                  style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
                >Edit</button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.18)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                >Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editTarget   && <EditModal   comment={editTarget}   onClose={() => setEditTarget(null)}   onSave={(u) => { setComments((p) => p.map((c) => c.id === u.id ? u : c)); setEditTarget(null); }} />}
      {deleteTarget && <DeleteModal comment={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { setComments((p) => p.filter((c) => c.id !== deleteTarget.id)); setDeleteTarget(null); }} />}
    </div>
  );
}
