import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="max-w-3xl text-center py-20">
        <div className="inline-block mb-8">
          {/* Friendly SVG illustration */}
          <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="280" height="180" rx="12" fill="#F3F4F6" />
            <g transform="translate(40,30)">
              <circle cx="40" cy="40" r="28" fill="#60A5FA" />
              <rect x="90" y="18" width="90" height="44" rx="8" fill="#A78BFA" />
              <path d="M10 110 Q60 70 110 110 T210 110" stroke="#34D399" strokeWidth="6" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Sorry — we couldn't find the page you're looking for.</p>

        <div className="flex justify-center gap-4">
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">Go home</Link>
          <Link href="/contact" className="px-4 py-2 border rounded text-gray-700">Contact support</Link>
        </div>
      </div>
    </div>
  );
}
