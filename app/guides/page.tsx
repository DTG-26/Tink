import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import {
  Store,
  MessageCircle,
  PackageCheck,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nigerian Online Store & Digital Storefront Guides',
  description:
    'Practical guides for Nigerian merchants on creating an online store, setting up a WhatsApp business catalogue, and managing small business inventory with Tink.',
  alternates: {
    canonical: `${SITE_URL}/guides`
  },
  openGraph: {
    title: 'Nigerian Online Store & Digital Storefront Guides | Tink',
    description:
      'Practical guides for Nigerian merchants on creating an online store, setting up a WhatsApp business catalogue, and managing small business inventory with Tink.',
    url: `${SITE_URL}/guides`,
    siteName: 'Tink',
    locale: 'en_NG',
    type: 'website',
    images: [`${SITE_URL}/logo.png`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nigerian Online Store & Digital Storefront Guides | Tink',
    description:
      'Practical guides for Nigerian merchants on creating an online store, setting up a WhatsApp business catalogue, and managing small business inventory with Tink.',
    images: [`${SITE_URL}/logo.png`]
  }
};

const GUIDES = [
  {
    slug: 'online-store-nigeria',
    badge: 'Store Setup & Payments',
    title: 'How to Create an Online Store & Digital Storefront in Nigeria',
    summary:
      'A step-by-step blueprint for Nigerian vendors to launch a branded digital storefront, configure delivery zones across Lagos, Abuja, and Port Harcourt, and accept direct bank transfers without gateway deductions.',
    icon: Store,
    topics: [
      'Choosing a clean storefront URL slug',
      'Setting up Nigerian bank transfer details',
      'Configuring location-based delivery zones & fees',
      'Sharing your storefront across Instagram, TikTok & WhatsApp'
    ]
  },
  {
    slug: 'whatsapp-business-catalogue',
    badge: 'WhatsApp Commerce',
    title: 'WhatsApp Business Catalogue: Turn Chats into Structured Orders',
    summary:
      'Learn how an interactive web-based WhatsApp business catalogue eliminates manual price negotiations in DMs by letting customers build a cart and send pre-formatted order summaries.',
    icon: MessageCircle,
    topics: [
      'Why web-based WhatsApp catalogues convert better than DMs',
      'Automated cart totals + delivery fee calculation',
      'Offering product sizes, portions, and variants',
      'Generating printable QR code posters for walk-in customers'
    ]
  },
  {
    slug: 'small-business-inventory-management',
    badge: 'Catalog & Stock Control',
    title: 'Small Business Inventory & Menu Management for Nigerian Sellers',
    summary:
      'Keep your product catalogue accurate in real time. Organise categories, manage product variants, toggle sold-out items with one tap, and automate your business hours in West Africa Time (WAT).',
    icon: PackageCheck,
    topics: [
      'Structuring menu categories for fast mobile browsing',
      'Real-time 1-tap In-Stock / Sold-Out availability toggles',
      'Managing multi-price product variants and options',
      'Automating Open/Closed store hours in WAT (Africa/Lagos)'
    ]
  }
];

export default function GuidesHubPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tink Seller Guides — Online Store & Digital Storefront Resources in Nigeria',
    url: `${SITE_URL}/guides`,
    description:
      'Practical guides for Nigerian businesses on creating a digital storefront, running a WhatsApp business catalogue, and managing small business inventory.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tink',
      url: SITE_URL
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Tink" className="h-9 w-auto object-contain" />
            <span className="font-extrabold text-sm text-slate-900 hidden sm:inline">
              Tink Guides
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              <span>Create Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-4 py-12 sm:py-16 space-y-12 flex-1">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tink Merchant Resource Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Build & Grow Your Digital Storefront in Nigeria
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Actionable guides for Nigerian food vendors, fashion brands, retailers, and social commerce sellers using Tink to power their online store and WhatsApp ordering workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <article
                key={guide.slug}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {guide.badge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
                    <Link href={`/guides/${guide.slug}`} className="hover:text-blue-600 transition-colors">
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {guide.summary}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                    {guide.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-blue-600 text-white p-8 text-center space-y-4">
          <h2 className="text-2xl font-extrabold">
            Launch Your Own Online Store on Tink Today
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Set up your digital storefront in under 60 seconds, showcase your products in Naira (₦), and receive structured WhatsApp orders with direct bank transfer instructions.
          </p>
          <div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-blue-900 font-extrabold text-xs sm:text-sm hover:bg-blue-50 transition-colors shadow-sm"
            >
              <span>Create Your Store Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-bold text-slate-800 hover:text-blue-600">
            ← Back to Tink Home
          </Link>
          <p>© {new Date().getFullYear()} Tink • Made by Tink (Danmari Tech Group). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

