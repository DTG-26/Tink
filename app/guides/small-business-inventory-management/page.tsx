import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import {
  PackageCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FolderTree,
  Pin
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Small Business Inventory Management & Menu Control in Nigeria',
  description:
    'Manage your small business inventory, product categories, stock availability, and operating hours in Nigeria with Tink.',
  alternates: {
    canonical: `${SITE_URL}/guides/small-business-inventory-management`
  },
  openGraph: {
    title: 'Small Business Inventory Management & Menu Control in Nigeria | Tink',
    description:
      'Manage your small business inventory, product categories, stock availability, and operating hours in Nigeria with Tink.',
    url: `${SITE_URL}/guides/small-business-inventory-management`,
    siteName: 'Tink',
    locale: 'en_NG',
    type: 'article',
    images: [`${SITE_URL}/logo.png`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small Business Inventory Management & Menu Control in Nigeria | Tink',
    description:
      'Manage your small business inventory, product categories, stock availability, and operating hours in Nigeria with Tink.',
    images: [`${SITE_URL}/logo.png`]
  }
};

export default function SmallBusinessInventoryGuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Small Business Inventory & Menu Management for Nigerian Sellers',
        description:
          'How Nigerian small businesses manage product availability, categories, variants, and automatic operating hours on Tink.',
        author: {
          '@type': 'Organization',
          name: 'Tink',
          url: SITE_URL
        },
        publisher: {
          '@type': 'Organization',
          name: 'Tink',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`
          }
        },
        mainEntityOfPage: `${SITE_URL}/guides/small-business-inventory-management`
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I mark an item as sold out on my Tink online store?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Inside your Tink seller dashboard, tap the "In Stock / Sold Out" button next to any product. Your storefront updates immediately so customers only order items you currently have available.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can my Tink storefront open and close automatically based on my business hours?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Tink Pro sellers can configure automatic operating hours and active days of the week in West Africa Time (Africa/Lagos) so the storefront automatically pauses ordering outside business hours.'
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Seller Guides</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
          >
            <span>Create Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 py-10 sm:py-14 space-y-8 flex-1">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
            <PackageCheck className="w-3.5 h-3.5" /> Inventory &amp; Catalog Control
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Small Business Inventory &amp; Menu Management for Nigerian Sellers
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Nothing frustrates a buyer more than paying for an item only to hear that it is out of stock. Tink gives Nigerian small businesses simple, mobile-ready inventory controls that keep your storefront accurate in seconds.
          </p>
        </div>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            4 Inventory &amp; Storefront Controls Every Seller Needs
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                1-Tap In-Stock / Sold-Out Toggle
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instead of deleting a product when you run out of stock for the day, tap the status pill in your Tink dashboard to mark it Sold Out. When you restock, tap once to make it orderable again.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-600" />
                Structured Menu &amp; Product Categories
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Group your products into clean horizontal filter tabs (such as <em>Main Dishes</em>, <em>Drinks</em>, <em>Combos</em>, or <em>New Arrivals</em>) so mobile shoppers can find what they want in seconds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pin className="w-4 h-4 text-blue-600" />
                Pinned Featured Best-Sellers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Highlight up to 3 high-margin or best-selling products at the very top of your digital storefront so every visitor sees your signature items first.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Automatic Business Hours in West Africa Time (WAT)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Set your opening and closing hours and active days of the week in Nigerian time (<code className="font-mono text-slate-800">Africa/Lagos</code>). Outside operating hours, your storefront displays your next opening time and pauses checkout automatically.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
            Continue Reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/guides/online-store-nigeria"
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors"
            >
              <span className="text-xs font-bold text-blue-600">Store Setup →</span>
              <p className="text-xs font-bold text-slate-900 mt-1">
                How to Create an Online Store &amp; Digital Storefront in Nigeria
              </p>
            </Link>
            <Link
              href="/guides/whatsapp-business-catalogue"
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors"
            >
              <span className="text-xs font-bold text-blue-600">WhatsApp Commerce →</span>
              <p className="text-xs font-bold text-slate-900 mt-1">
                WhatsApp Business Catalogue: Turn Chats into Structured Orders
              </p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/guides" className="font-bold text-slate-800 hover:text-blue-600">
            ← Back to Seller Guides
          </Link>
          <p>© {new Date().getFullYear()} Tink • Made by Tink (Danmari Tech Group). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

