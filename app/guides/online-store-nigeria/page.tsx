import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import {
  Store,
  ArrowRight,
  CheckCircle2,
  Building,
  Truck,
  Share2,
  ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Create an Online Store & Digital Storefront in Nigeria',
  description:
    'Learn how to create an online store in Nigeria with Tink. Set up your branded digital storefront, configure delivery zones, and accept direct Nigerian bank transfers on WhatsApp.',
  alternates: {
    canonical: `${SITE_URL}/guides/online-store-nigeria`
  },
  openGraph: {
    title: 'How to Create an Online Store & Digital Storefront in Nigeria | Tink',
    description:
      'Learn how to create an online store in Nigeria with Tink. Set up your branded digital storefront, configure delivery zones, and accept direct Nigerian bank transfers on WhatsApp.',
    url: `${SITE_URL}/guides/online-store-nigeria`,
    siteName: 'Tink',
    locale: 'en_NG',
    type: 'article',
    images: [`${SITE_URL}/logo.png`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Create an Online Store & Digital Storefront in Nigeria | Tink',
    description:
      'Learn how to create an online store in Nigeria with Tink. Set up your branded digital storefront, configure delivery zones, and accept direct Nigerian bank transfers on WhatsApp.',
    images: [`${SITE_URL}/logo.png`]
  }
};

export default function OnlineStoreNigeriaGuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'How to Create an Online Store & Digital Storefront in Nigeria',
        description:
          'Step-by-step guide for Nigerian businesses to create a branded online store and digital storefront on Tink with direct bank transfers and WhatsApp ordering.',
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
        mainEntityOfPage: `${SITE_URL}/guides/online-store-nigeria`
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does it cost to create an online store in Nigeria with Tink?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Creating an online store on Tink is free for Nigerian sellers (up to 5 products with unlimited WhatsApp orders and zero transaction commissions). Sellers who need unlimited products, custom brand colours, delivery zone selectors, and product variants can upgrade to Tink Pro for ₦3,000 per month.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do customers need to create an account to buy from my Tink digital storefront?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Customers open your storefront link directly in their mobile browser, add items to their cart, select their delivery zone, and send their formatted order straight to your WhatsApp number without creating an account.'
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
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Store className="w-3.5 h-3.5" /> Digital Storefront Guide
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
            How to Create an Online Store &amp; Digital Storefront in Nigeria
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you run a restaurant in Lagos, a fashion brand in Abuja, or a retail business in Port Harcourt, having a dedicated digital storefront lets customers browse your full catalogue, see accurate Naira (₦) pricing, and send structured orders directly to your WhatsApp.
          </p>
        </div>

        {/* Section 1 */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Why Nigerian Sellers Are Moving From DM Threads to a Digital Storefront
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selling solely through Instagram stories or WhatsApp status posts forces buyers to ask <em>&ldquo;How much is this?&rdquo;</em> and <em>&ldquo;Is this still available?&rdquo;</em> for every single item. A dedicated online store on Tink (<code className="text-slate-800 font-mono">tink.com.ng/your-store</code>) solves this by giving your business a permanent, mobile-first web address.
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-2">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Instant Clarity on Prices &amp; Options:</strong> Customers see product photos, descriptions, and variant pricing (such as sizes or portions) upfront.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Zero Buyer Friction:</strong> Shoppers never have to download an app or create an account to place an order.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>100% Direct Bank Payouts:</strong> Unlike third-party marketplaces that hold funds or deduct percentage commissions, buyers transfer directly to your Nigerian bank account.</span>
            </li>
          </ul>
        </section>

        {/* Section 2: Step by step */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Step-by-Step: Launching Your Online Store on Tink
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Register Your Store Name &amp; Custom URL Slug
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Visit the <Link href="/register" className="text-blue-600 font-semibold hover:underline">Tink store registration page</Link> and enter your email or Nigerian phone number, store name, and WhatsApp order number. Tink automatically generates a clean URL slug (for example, <code className="font-mono text-slate-800">tink.com.ng/lagos-treats</code>).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  Add Your Nigerian Bank Account Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Enter your bank name (such as GTBank, Zenith Bank, Access Bank, OPay, or Moniepoint), your 10-digit NUBAN account number, and your account name. These details are automatically displayed at checkout and embedded in the customer&apos;s WhatsApp order summary.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Configure Delivery Zones &amp; Fees
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  With Tink Pro, you can define custom delivery areas and rates (for example, <em>Store Pickup — Free</em>, <em>Mainland Delivery — ₦2,000</em>, <em>Island Delivery — ₦3,500</em>). When a customer checks out, their chosen delivery fee is added to the total automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  Put Your Storefront Link Everywhere
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Paste your storefront URL in your Instagram bio, TikTok profile, and WhatsApp Business profile, or download your branded Tink QR code poster for packaging and walk-in buyers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
            Continue Reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/guides/whatsapp-business-catalogue"
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors"
            >
              <span className="text-xs font-bold text-blue-600">WhatsApp Commerce →</span>
              <p className="text-xs font-bold text-slate-900 mt-1">
                WhatsApp Business Catalogue: Turn Chats into Structured Orders
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

