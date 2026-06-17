import React from 'react';
import Link from 'next/link';
import links from './navlinks';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 mt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Logo */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 inline-flex items-center justify-center bg-blue-600 text-white rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4 7.1v6.9l8 4 8-4V7.1L12 9.5z" />
                </svg>
              </span>
              <span className="text-lg font-semibold">MySite</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Small description or tagline about the site.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-2">Links</h4>
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 dark:text-gray-300 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-semibold mb-2">Policy</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:underline">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row sm:justify-between">
          <div>© {new Date().getFullYear()} MySite. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Built with Next.js</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


