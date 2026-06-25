export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)', padding: '60px 24px', color: '#e2e8f0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: June 2026</p>

        {[
          { title: '1. Acceptance of Terms', body: 'By accessing and using LegalEase, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.' },
          { title: '2. Use of Services', body: 'LegalEase provides a platform to connect users with legal professionals. We do not provide legal advice ourselves. All legal services are provided by independent lawyers on our platform.' },
          { title: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
          { title: '4. Payments', body: 'Payments for legal services are processed securely through our platform. All fees are clearly displayed before any transaction is completed.' },
          { title: '5. Intellectual Property', body: 'The content, features, and functionality of LegalEase are owned by us and are protected by copyright, trademark, and other intellectual property laws.' },
          { title: '6. Limitation of Liability', body: 'LegalEase shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our platform.' },
          { title: '7. Contact Us', body: 'For questions about these Terms of Service, please contact us at support@legalease.com.' },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>{title}</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8 }}>{body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
