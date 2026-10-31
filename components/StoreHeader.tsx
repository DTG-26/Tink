'use client';

import React from 'react';
import { Vendor, checkIsActivePro, checkStoreOpenStatus } from '../types/database';
import { formatDisplayPhone } from '../lib/phone';
import {
  MessageCircle,
  CheckCircle2,
  Store,
  Clock,
  Instagram,
  Twitter,
  Music2
} from 'lucide-react';

interface StoreHeaderProps {
  vendor: Vendor;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ vendor }) => {
  const isPro = checkIsActivePro(vendor);
  const accentColor = isPro && vendor.accent_color ? vendor.accent_color : '#2563EB';
  const openStatus = checkStoreOpenStatus(vendor);

  const handleDirectChat = () => {
    const url = `https://wa.me/${vendor.whatsapp_number}?text=${encodeURIComponent(
      `Hello ${vendor.store_name}, I am viewing your direct catalog!`
    )}`;
    window.location.href = url;
  };

  const bioText = vendor.bio || vendor.description;
  const hasSocials =
    isPro &&
    vendor.social_links &&
    Boolean(
      vendor.social_links.instagram ||
      vendor.social_links.twitter ||
      vendor.social_links.tiktok
    );

  return (
    <header className="relative w-full bg-white border-b border-slate-200">
      {/* Banner */}
      <div
        className="relative w-full h-36 md:h-52 overflow-hidden"
        style={{
          background: vendor.banner_url
            ? undefined
            : `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)`
        }}
      >
        {vendor.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.banner_url}
            alt={`${vendor.store_name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      </div>

      {/* Profile Details Container */}
      <div className="max-w-4xl mx-auto px-4 pb-5 sm:px-6">
        {/* Only the avatar overlaps the banner; store name & actions stay cleanly on the white background below */}
        <div className="relative -mt-10 sm:-mt-12 mb-3 flex items-end justify-between gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white ring-4 ring-white shadow-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
            {vendor.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendor.logo_url}
                alt={vendor.store_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="w-10 h-10" style={{ color: accentColor }} />
            )}
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2 flex-wrap pt-12">
            {/* Store Open/Closed Badge */}
            {openStatus.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{openStatus.statusText}</span>
                {openStatus.scheduleBadge && (
                  <span className="hidden sm:inline text-emerald-600/80 font-medium">
                    • {openStatus.scheduleBadge}
                  </span>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{openStatus.statusText}</span>
              </span>
            )}

            {/* Direct WhatsApp Chat button */}
            <button
              onClick={handleDirectChat}
              id="vendor-whatsapp-chat-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba5a] active:scale-95 transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              Chat
            </button>
          </div>
        </div>

        {/* Store Name, Verified Badge & Phone cleanly below the banner */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {vendor.store_name}
            </h1>
            {isPro && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: accentColor }}
                title="Verified Tink Pro Store"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Verified Store
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {formatDisplayPhone(vendor.whatsapp_number, 'international')}
          </p>
        </div>

        {/* Bio / Description */}
        {bioText && (
          <div className="mt-3.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {bioText}
          </div>
        )}

        {/* Social Links (Pro Only) */}
        {hasSocials && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {vendor.social_links?.instagram && (
              <a
                href={
                  vendor.social_links.instagram.startsWith('http')
                    ? vendor.social_links.instagram
                    : `https://instagram.com/${vendor.social_links.instagram.replace('@', '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200/60 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>
                  {vendor.social_links.instagram.startsWith('@')
                    ? vendor.social_links.instagram
                    : `@${vendor.social_links.instagram}`}
                </span>
              </a>
            )}

            {vendor.social_links?.twitter && (
              <a
                href={
                  vendor.social_links.twitter.startsWith('http')
                    ? vendor.social_links.twitter
                    : `https://x.com/${vendor.social_links.twitter.replace('@', '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>
                  {vendor.social_links.twitter.startsWith('@')
                    ? vendor.social_links.twitter
                    : `@${vendor.social_links.twitter}`}
                </span>
              </a>
            )}

            {vendor.social_links?.tiktok && (
              <a
                href={
                  vendor.social_links.tiktok.startsWith('http')
                    ? vendor.social_links.tiktok
                    : `https://tiktok.com/@${vendor.social_links.tiktok.replace('@', '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <Music2 className="w-3.5 h-3.5" />
                <span>
                  {vendor.social_links.tiktok.startsWith('@')
                    ? vendor.social_links.tiktok
                    : `@${vendor.social_links.tiktok}`}
                </span>
              </a>
            )}
          </div>
        )}

        {/* Closed Store Alert Banner */}
        {!openStatus.isOpen && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>
              {openStatus.reason === 'outside_hours'
                ? `We are currently outside our scheduled business hours (${openStatus.scheduleBadge || 'Closed'}). You can still browse the catalog.`
                : 'This store is currently paused. You can still browse the menu and explore items.'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
