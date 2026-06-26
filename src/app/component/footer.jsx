import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import links from './navlinks';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Logo */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex">
              <Image
                src="/Untitled design (4).png"
                alt="LegalEase logo"
                width={140}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your trusted legal partner — expert attorneys, simplified.</p>
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
          <div>© {new Date().getFullYear()} LegalEase. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Built with Next.js</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


