export default function CookiesPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #05050a 0%, #090912 40%, #07070d 100%)', padding: '60px 24px', color: '#e2e8f0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Cookie Policy</h1>
        <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: June 2026</p>

        {[
          { title: '1. What Are Cookies', body: 'Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login sessions.' },
          { title: '2. How We Use Cookies', body: 'We use cookies to keep you logged in, remember your preferences, and understand how you interact with our platform so we can improve it.' },
          { title: '3. Essential Cookies', body: 'Some cookies are essential for the platform to function correctly, such as session cookies that keep you authenticated while you browse.' },
          { title: '4. Analytics Cookies', body: 'We may use analytics cookies to understand how visitors use our platform. This helps us improve performance and user experience.' },
          { title: '5. Managing Cookies', body: 'You can control and manage cookies through your browser settings. Disabling certain cookies may affect the functionality of our platform.' },
          { title: '6. Contact Us', body: 'If you have questions about our use of cookies, please contact us at support@legalease.com.' },
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
