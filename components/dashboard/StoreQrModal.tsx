'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Vendor, checkIsActivePro } from '../../types/database';
import { X, Download, Copy, Check, QrCode, Sparkles } from 'lucide-react';

interface StoreQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
}

export const StoreQrModal: React.FC<StoreQrModalProps> = ({
  isOpen,
  onClose,
  vendor
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const isPro = checkIsActivePro(vendor);
  const accentColor = isPro && vendor.accent_color ? vendor.accent_color : '#2563EB';

  const storeUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${vendor.slug}`
      : `https://tink-sepia.vercel.app/${vendor.slug}`;

  useEffect(() => {
    if (!isOpen) return;

    async function renderPoster() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 640;
      const height = 840;
      canvas.width = width;
      canvas.height = height;

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 2. Top Accent Header Block
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, width, 200);

      // Subtle decorative circles in header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(width - 60, 40, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(60, 180, 90, 0, Math.PI * 2);
      ctx.fill();

      // 3. Store Name & Tagline in Header
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      const displayStoreName =
        vendor.store_name.length > 24
          ? vendor.store_name.slice(0, 22) + '…'
          : vendor.store_name;
      ctx.fillText(displayStoreName, width / 2, 95);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '600 18px system-ui, -apple-system, sans-serif';
      ctx.fillText('SCAN TO BROWSE & ORDER ON WHATSAPP', width / 2, 138);

      // 4. White Card Container around QR Code
      const cardSize = 400;
      const cardX = (width - cardSize) / 2;
      const cardY = 230;

      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardSize, cardSize, 32);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardSize, cardSize, 32);
      ctx.stroke();

      // 5. Generate QR Code onto an offscreen canvas and draw inside card
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, storeUrl, {
        width: 340,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });

      ctx.drawImage(qrCanvas, (width - 340) / 2, cardY + 30, 340, 340);

      // 6. Store Link Pill below QR Card
      const pillWidth = 460;
      const pillHeight = 56;
      const pillX = (width - pillWidth) / 2;
      const pillY = 665;

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 16);
      ctx.fill();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 16);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px monospace';
      const cleanUrl = storeUrl.replace(/^https?:\/\//, '');
      const displayUrl =
        cleanUrl.length > 36 ? cleanUrl.slice(0, 34) + '…' : cleanUrl;
      ctx.fillText(displayUrl, width / 2, pillY + 35);

      // 7. Bottom Instructions & Attribution
      ctx.fillStyle = '#475569';
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        'Point your phone camera at the QR code to view our menu',
        width / 2,
        765
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 13px system-ui, -apple-system, sans-serif';
      ctx.fillText('Made by Tink • Danmari Tech Group', width / 2, 808);

      setIsReady(true);
    }

    renderPoster();
  }, [isOpen, vendor, accentColor, storeUrl]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${vendor.slug}-store-qr.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Store QR Code Poster
                </h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  <Sparkles className="w-2.5 h-2.5" /> Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Print for your shop counter, packaging, or share on status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Canvas Preview */}
        <div className="my-4 flex-1 overflow-y-auto flex flex-col items-center justify-center bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[260px] h-auto rounded-xl shadow-md border border-slate-200 bg-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!isReady}
            style={{ backgroundColor: accentColor }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white text-xs font-bold hover:opacity-95 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download QR Poster (PNG)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

