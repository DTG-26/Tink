import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MessageCircle,
  Zap,
  Building,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. TOP STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Tink — Your Shop in a Link"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="hidden md:inline-flex text-[11px] font-medium text-slate-400 border-l border-slate-200 pl-2.5">
              A product of Danmari Tech Group
            </span>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="hidden xl:inline-flex text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg">
              Tink is a product of Danmari Tech Group
            </span>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors hidden sm:inline"
            >
              Dashboard
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20"
            >
              <span>Create Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          {/* Catchy Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tink • Your Shop in a Link — 100% Free for Nigerian Social Sellers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl leading-[1.15]">
            Turn your Instagram Bio into an{' '}
            <span className="text-blue-600 relative inline-block">
              Instant WhatsApp
            </span>{' '}
            Ordering Catalog.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Customers browse your menu, build a cart, and send a pre-formatted order directly to your WhatsApp with your Nigerian bank transfer instructions. No third-party gateway deductions, no buyer logins.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full max-w-md justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/25"
            >
              <span>Create Your Store Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-xs"
            >
              <span>Seller Dashboard</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trust Value Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Zero Transaction Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Direct Bank Transfers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>No App Download Needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Unlimited Products</span>
            </div>
          </div>

          {/* 3. INTERACTIVE VISUAL CARD PREVIEW */}
          <div className="mt-12 w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-blue-50 border border-blue-200 flex items-center justify-center p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Tink"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900">Your Store Name</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">tink.ng/your-store</p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                ● Open Now
              </span>
            </div>

            {/* Product Card Snippet */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop"
                      alt="Burger"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Monster Burger</h4>
                    <p className="text-xs font-extrabold text-blue-600">₦6,500</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                  + Add
                </span>
              </div>

              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1585109649139-366815a0d713?w=100&h=100&fit=crop"
                      alt="Fries"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Loaded Suya Fries</h4>
                    <p className="text-xs font-extrabold text-blue-600">₦3,800</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                  + Add
                </span>
              </div>
            </div>

            {/* Sticky Cart Simulation */}
            <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">2 items in cart</p>
                  <p className="text-sm font-extrabold text-slate-950">₦10,300</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Order on WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS IN 3 STEPS */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Simple 3-Step Process
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Tink Works for Sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-lg mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Create Your Menu & Add Bank Info
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  List your products with photos and prices in Naira (₦). Add your GTBank, Zenith, or Access bank details.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <Zap className="w-3.5 h-3.5" />
                <span>Takes less than 2 minutes</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-extrabold text-lg mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Put Link in Your Instagram Bio
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Share your link (<span className="font-mono text-slate-800">tink.ng/your-store</span>) on WhatsApp status, Instagram bio, or TikTok.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-sky-600">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile-friendly for every buyer</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-lg mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Receive WhatsApp Orders & Payments
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buyers send pre-formatted item lists with delivery address and pay straight to your bank account via direct transfer.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                <Building className="w-3.5 h-3.5" />
                <span>Zero gateway deduction fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES & ADVANTAGES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              Why Sellers Love It
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built Specifically for Social Commerce in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3.5">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Direct Bank Wire</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers pay straight to your local Nigerian bank account. No payout waiting times.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3.5">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">1-Tap Out-of-Stock Toggle</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ran out of shawarma or chicken? Tap once in your dashboard to mark it Sold Out in real time.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/70 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Zero Buyer Logins</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers never have to remember passwords or register accounts. Carts live in their browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. READY TO START CTA */}
      <section className="py-14 sm:py-16 bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your WhatsApp sales?
          </h2>
          <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Join hundreds of food spots, bakers, and thrift stores selling directly through WhatsApp with Tink.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-blue-900 font-extrabold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
            >
              Create Free Store Catalog
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-800/60 border border-blue-400/40 text-white font-bold text-sm hover:bg-blue-800 transition-all"
            >
              Seller Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CLEAN FOOTER */}
      <footer className="border-t border-slate-100 py-10 bg-white text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Tink"
              className="h-7 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-5 font-semibold text-slate-600">
            <Link href="/register" className="hover:text-blue-600">Create Store</Link>
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          </div>

          <p>© {new Date().getFullYear()} Tink is a product of Danmari Tech Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
