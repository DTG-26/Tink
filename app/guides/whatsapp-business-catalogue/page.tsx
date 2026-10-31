import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import {
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  QrCode,
  Calculator
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'WhatsApp Business Catalogue — Online Ordering Catalog for Nigeria',
  description:
    'Create a fast, interactive WhatsApp business catalogue with Tink. Let customers browse products, select variants, calculate delivery fees, and send structured WhatsApp orders.',
  alternates: {
    canonical: `${SITE_URL}/guides/whatsapp-business-catalogue`
  },
  openGraph: {
    title: 'WhatsApp Business Catalogue — Online Ordering Catalog for Nigeria | Tink',
    description:
      'Create a fast, interactive WhatsApp business catalogue with Tink. Let customers browse products, select variants, calculate delivery fees, and send structured WhatsApp orders.',
    url: `${SITE_URL}/guides/whatsapp-business-catalogue`,
    siteName: 'Tink',
    locale: 'en_NG',
    type: 'article',
    images: [`${SITE_URL}/logo.png`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsApp Business Catalogue — Online Ordering Catalog for Nigeria | Tink',
    description:
      'Create a fast, interactive WhatsApp business catalogue with Tink. Let customers browse products, select variants, calculate delivery fees, and send structured WhatsApp orders.',
    images: [`${SITE_URL}/logo.png`]
  }
};

export default function WhatsappBusinessCatalogueGuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'WhatsApp Business Catalogue: Turn Chats into Structured Orders',
        description:
          'How Nigerian merchants use Tink as a web-based WhatsApp business catalogue with automated cart calculations, delivery zones, and direct bank transfer receipts.',
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
        mainEntityOfPage: `${SITE_URL}/guides/whatsapp-business-catalogue`
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does a Tink WhatsApp business catalogue work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tink gives your business a dedicated web catalogue link. Customers open your link, add items and variants to their shopping cart, choose their delivery zone, and tap "Order on WhatsApp". Tink formats the entire itemised receipt, delivery address, and your Nigerian bank details into a single WhatsApp message.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I add product sizes or options to my WhatsApp catalogue?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. With Tink Pro, you can add multiple variants (such as Small, Medium, Large, or 1 Litre vs 2 Litres) with distinct Naira prices on any product card.'
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
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Business Catalogue
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            WhatsApp Business Catalogue: Turn Chats into Structured Orders
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            WhatsApp is where Nigerian commerce happens, but manually calculating item totals, delivery fees, and sending bank account numbers in every chat slows down your business. Here is how a web-powered WhatsApp catalogue streamlines every order.
          </p>
        </div>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            What Happens When a Customer Orders From Your Tink Catalogue?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Instead of sending ten separate messages back and forth, your customer completes their selection on your Tink storefront and sends a single, structured WhatsApp message containing:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-2">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Itemised Cart Breakdown:</strong> Every product, selected variant/size, quantity, and line-item subtotal in Naira (₦).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Selected Delivery Zone &amp; Fee:</strong> The exact delivery area chosen by the buyer, with subtotal + delivery fee summed automatically.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Customer Delivery Details:</strong> Buyer name, phone number, delivery address, and optional order notes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Your Bank Transfer Instructions:</strong> Your bank name, account number, and account name ready for immediate payment.</span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Key Features Built for High-Volume WhatsApp Sellers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Automatic Delivery Math
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-set delivery fees per location so buyers see their exact grand total before opening WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Product Variants
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Let buyers pick sizes, portions, or colours directly on the product card with automatic price updates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Store QR Code Poster
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download a high-resolution QR poster from your dashboard so offline customers can scan and order on WhatsApp.
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
              href="/guides/small-business-inventory-management"
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors"
            >
              <span className="text-xs font-bold text-blue-600">Inventory Control →</span>
              <p className="text-xs font-bold text-slate-900 mt-1">
                Small Business Inventory &amp; Menu Management for Nigerian Sellers
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

