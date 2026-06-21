import React from 'react'

const items = [
  { title: 'Criminal Law', icon: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v2H3V3z" fill="#8B6B1B"/><path d="M7 21h10v-2H7v2z" fill="#8B6B1B"/><path d="M6 7l3 6h6l3-6H6z" fill="#D6C6A1" stroke="#8B6B1B" strokeWidth="0.5"/></svg>
  ) },
  { title: 'Corporate Law', icon: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="6" rx="1" fill="#D6C6A1" stroke="#8B6B1B"/><rect x="3" y="12" width="18" height="8" rx="1" fill="#fff" stroke="#8B6B1B"/></svg>
  ) },
  { title: 'Family Law', icon: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="2.5" fill="#D6C6A1" stroke="#8B6B1B"/><path d="M5 20c1.5-3 4.5-5 7-5s5.5 2 7 5" stroke="#8B6B1B" strokeWidth="0.8" fill="none"/></svg>
  ) },
  { title: 'Civil Litigation', icon: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h16" stroke="#8B6B1B" strokeWidth="1.2"/><path d="M7 4h10l-1 8H8L7 4z" fill="#D6C6A1" stroke="#8B6B1B"/></svg>
  ) }
]

export default function AreasOfExpertise () {
  return (
    <section style={{padding: '48px 0', textAlign: 'center'}}>
      <h2 style={{fontSize: 28, margin: 0}}>Areas of Expertise</h2>
      <p style={{color: '#666', marginTop: 8, marginBottom: 28}}>Specialized counsel across major legal domains</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto'}}>
        {items.map((it) => (
          <div key={it.title} className='bg-gray-900' style={{ borderRadius: 8, padding: 20, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginBottom: 12}}>{it.icon}</div>
            <div style={{fontWeight: 700}}>{it.title}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
