/**
 * Client-Side Image Compression & Upload Utility
 * Handles Gallery / Photos file uploads with automatic compression and fallback
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface CompressResult {
  blob: Blob;
  dataUrl: string;
}

/**
 * Compresses an image file from device gallery/camera using HTML5 Canvas.
 * Keeps file size lightweight (~100-250KB) while preserving crisp visual detail.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context for image processing.'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas to Blob conversion failed.'));
            }
            resolve({ blob, dataUrl });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a product image from the device gallery to Supabase storage.
 * If storage bucket is not yet provisioned, falls back to optimized base64 data URL.
 */
export async function uploadProductImage(file: File, vendorId: string): Promise<string> {
  // 1. Compress image on client
  const { blob, dataUrl } = await compressImageFile(file);

  // 2. Try Supabase storage upload if configured
  if (isSupabaseConfigured) {
    try {
      const cleanVendorId = vendorId || 'anonymous';
      const fileExt = 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${cleanVendorId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('catalog-assets')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('catalog-assets')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // Fall through to compressed dataUrl fallback
    }
  }

  // 3. Fallback to compressed high-efficiency data URL
  return dataUrl;
}

/**
 * Uploads a store banner image (higher width resolution) to Supabase Storage.
 * Falls back to optimized compressed base64 data URL.
 */
export async function uploadStoreBanner(file: File, vendorId: string): Promise<string> {
  // Compress banner with 1600x800 resolution
  const { blob, dataUrl } = await compressImageFile(file, 1600, 800, 0.88);

  if (isSupabaseConfigured) {
    try {
      const cleanVendorId = vendorId || 'anonymous';
      const fileExt = 'jpg';
      const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${cleanVendorId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('catalog-assets')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('catalog-assets')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // Fall through to compressed dataUrl fallback
    }
  }

  return dataUrl;
}

