'use client';

export function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              height: 16,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              width: '80%',
            }}
          />
          <div
            style={{
              height: 12,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.05)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              width: '60%',
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: 12,
          borderRadius: 6,
          background: 'rgba(255,255,255,0.05)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.05)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          width: '90%',
        }}
      />
    </div>
  );
}

export function LawyerCardSkeleton() {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        background: 'rgba(15, 12, 35, 0.95)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'grid',
        gridTemplateColumns: '72px 1fr',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            height: 18,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: '70%',
          }}
        />
        <div
          style={{
            height: 12,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.05)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: '50%',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.05)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          ))}
        </div>
        <div
          style={{
            height: 12,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.05)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: '100%',
            marginTop: 4,
          }}
        />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            padding: 16,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            height: 80,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 3, columns = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
