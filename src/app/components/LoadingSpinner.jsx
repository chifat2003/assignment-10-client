'use client';

export function LoadingSpinner({ size = 'md' }) {
  const sizeMap = {
    sm: { spinner: 20, container: 24 },
    md: { spinner: 32, container: 40 },
    lg: { spinner: 48, container: 64 },
  };

  const { spinner, container } = sizeMap[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: container }}>
      <div
        style={{
          width: spinner,
          height: spinner,
          borderRadius: '50%',
          border: '3px solid rgba(139,92,246,0.2)',
          borderTopColor: '#8b5cf6',
          animation: 'spin 0.8s linear infinite',
        }}
      >
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)' }}>
      <LoadingSpinner size="lg" />
    </div>
  );
}
