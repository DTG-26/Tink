'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/auth';
import { MONETIZATION_CONFIG } from '@/lib/constants';
import {
  KeyRound,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Mail
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [phoneResetTarget, setPhoneResetTarget] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailSent(false);
    setPhoneResetTarget(null);

    if (!identifier.trim()) {
      setError('Please enter the email address or Nigerian phone number you registered with.');
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : 'https://tink.com.ng/reset-password';

      const res = await requestPasswordReset(identifier, redirectUrl);
      if (!res.success) {
        setError(res.error || 'Could not process password reset request.');
        setIsLoading(false);
        return;
      }

      if (res.data?.isPhone) {
        setPhoneResetTarget(res.data.normalizedPhone || identifier.trim());
      } else {
        setEmailSent(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const supportPhone = MONETIZATION_CONFIG.SUPPORT_PHONE;
  const whatsappResetUrl = phoneResetTarget
    ? `https://wa.me/${supportPhone}?text=${encodeURIComponent(
        `Hi Tink Support, I need help resetting the password for my Tink seller account registered with phone number +${phoneResetTarget}.`
      )}`
    : '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Tink" className="h-9 w-auto object-contain" />
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log In</span>
            </Link>
          </div>
          <Link
            href="/register"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            Create Store
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Forgot Password?
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Enter your registered email or Nigerian phone number to reset your password
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {emailSent ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password Reset Link Sent!</span>
                </div>
                <p className="leading-relaxed">
                  We have sent a password reset link to <strong>{identifier}</strong>. Open the link in your email to set a new password.
                </p>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Seller Log In</span>
              </Link>
            </div>
          ) : phoneResetTarget ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm space-y-2">
                <p className="font-bold">Phone Number Account Detected</p>
                <p className="leading-relaxed text-slate-700">
                  Because your account uses a Nigerian phone number (+{phoneResetTarget}) instead of an email inbox, tap below to verify ownership on WhatsApp for an instant password reset.
                </p>
              </div>
              <a
                href={whatsappResetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Reset Password via WhatsApp Support</span>
              </a>
              <button
                type="button"
                onClick={() => setPhoneResetTarget(null)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                Try an email address instead
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Registered Email or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@gmail.com or 08012345678"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email accounts receive an instant reset link.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Send Password Reset</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Remembered your password?{' '}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Log in to your store
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        © {new Date().getFullYear()} Tink. All rights reserved.
      </footer>
    </div>
  );
}

