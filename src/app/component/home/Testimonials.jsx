'use client';

import React, { useState, useEffect } from 'react';

const testimonialsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Business Owner',
    content: 'The legal expertise I received was outstanding. My case was handled with utmost professionalism and I got the best possible outcome. Highly recommend!',
    rating: 5,
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=Sarah',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Entrepreneur',
    content: 'Found the perfect attorney for my intellectual property case. The consultation was insightful and the follow-up support was exceptional.',
    rating: 5,
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=Michael',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    content: 'Great experience from start to finish. The team was responsive, knowledgeable, and really cared about my case. Worth every penny!',
    rating: 5,
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=Emily',
  },
  {
    id: 4,
    name: 'David Williams',
    role: 'Finance Manager',
    content: 'Exceptional legal services. The attorney understood my needs perfectly and provided strategic advice that saved me significant time and money.',
    rating: 5,
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=David',
  },
  {
    id: 5,
    name: 'Jessica Martinez',
    role: 'Freelance Designer',
    content: 'Quick turnaround, professional guidance, and excellent results. I felt confident throughout the entire legal process.',
    rating: 5,
    avatar: 'https://api.dicebear.com/9.x/personas/svg?seed=Jessica',
  },
];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill={rating >= star ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoplay]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section
      style={{
        position: 'relative',
        padding: '60px 24px',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0b1e 50%, #0a0a0f 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'rgba(59,130,246,0.07)',
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#60a5fa',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              💬 Client Stories
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: '0 0 12px',
            }}
          >
            Trusted by{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Thousands
            </span>
          </h2>

          <p
            style={{
              fontSize: 14,
              color: '#64748b',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Real testimonials from clients who found justice through our network of expert attorneys.
          </p>
        </div>

        {/* Carousel */}
        <div
          style={{
            position: 'relative',
            maxWidth: 700,
            margin: '0 auto',
            perspective: '1000px',
          }}
        >
          {/* Testimonial card */}
          <div
            style={{
              padding: 32,
              borderRadius: 16,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(59,130,246,0.2)',
              backdropFilter: 'blur(10px)',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Quote icon */}
            <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.3 }}>✨</div>

            {/* Testimonial text */}
            <p
              style={{
                margin: '0 0 24px',
                fontSize: 15,
                fontWeight: 500,
                color: '#cbd5e1',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              "{currentTestimonial.content}"
            </p>

            {/* Author info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '2px solid rgba(59,130,246,0.3)',
                  objectFit: 'cover',
                }}
              />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                  {currentTestimonial.name}
                </p>
                <p style={{ margin: '2px 0 6px', fontSize: 12, color: '#64748b' }}>
                  {currentTestimonial.role}
                </p>
                <StarRating rating={currentTestimonial.rating} />
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            style={{
              position: 'absolute',
              left: -50,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#60a5fa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.borderColor = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
            }}
          >
            ←
          </button>

          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: -50,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#60a5fa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.borderColor = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
            }}
          >
            →
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: index === currentIndex ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  background: index === currentIndex ? '#60a5fa' : 'rgba(59,130,246,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.background = 'rgba(59,130,246,0.2)';
                  }
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <p
            style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: 12,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {currentIndex + 1} / {testimonialsData.length}
          </p>
        </div>

        {/* Stats footer */}
        <div
          style={{
            marginTop: 60,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 20,
            textAlign: 'center',
          }}
        >
          {[
            { number: '2.5K+', label: 'Happy Clients' },
            { number: '98%', label: 'Success Rate' },
            { number: '50+', label: 'Expert Lawyers' },
          ].map((stat) => (
            <div key={stat.label}>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#60a5fa', marginBottom: 6 }}>
                {stat.number}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
