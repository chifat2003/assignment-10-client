export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)', padding: '60px 24px', color: '#e2e8f0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: June 2026</p>

        {[
          { title: '1. Information We Collect', body: 'We collect information you provide directly to us, such as your name, email address, and profile details when you create an account or use our services.' },
          { title: '2. How We Use Your Information', body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.' },
          { title: '3. Information Sharing', body: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform.' },
          { title: '4. Data Security', body: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
          { title: '5. Cookies', body: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve your experience.' },
          { title: '6. Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at support@legalease.com.' },
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
