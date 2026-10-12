/**
 * WhatsApp Order Compiler & URL Generator
 * Conforms to Master Build Blueprint Section 4.3 & Section 4.4
 */

import { DirectCartOrder } from '../types/database';
import { normalizePhoneNumber, buildWhatsAppLink } from './phone';

/**
 * Formats a number into Nigerian Naira display format with commas (e.g., 5,000 or 5,000.00).
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Compiles the exact order string according to Blueprint Section 4.4:
 *
 * 🛍️ *NEW ORDER - [Store Name]*
 * ------------------------------
 * 👤 *Customer:* [Customer Name]
 * 📞 *Phone:* [Customer Phone]
 * 📍 *Delivery Address:* [Customer Address]
 * [📝 *Note:* [Optional Note]]
 *
 * 🛒 *ORDER DETAILS:*
 * • [Qty]x [Item Title] — ₦[Item Total]
 * • [Qty]x [Item Title] — ₦[Item Total]
 *
 * ------------------------------
 * 💰 *TOTAL AMOUNT:* ₦[Total Sum]
 *
 * 💳 *PAYMENT INSTRUCTIONS (DIRECT TRANSFER):*
 * Bank: [Vendor Bank Name]
 * Account: [Vendor Account Number]
 * Name: [Vendor Account Name]
 *
 * _Please reply to confirm availability and acknowledge payment!_
 */
export function compileOrderMessage(order: DirectCartOrder): string {
  const { storeName, customer, items, totalAmount, vendorBank } = order;

  // Header & Customer details
  const header = `🛍️ *NEW ORDER - ${storeName}*\n------------------------------`;
  const customerInfo = [
    `👤 *Customer:* ${customer.name}`,
    `📞 *Phone:* ${customer.phone}`,
    `📍 *Delivery Address:* ${customer.address}`
  ];

  if (customer.note && customer.note.trim()) {
    customerInfo.push(`📝 *Note:* ${customer.note.trim()}`);
  }

  // Order items list
  const itemLines = items.map((item) => {
    const itemTotal = item.price * item.quantity;
    return `• ${item.quantity}x ${item.title} — ₦${formatNaira(itemTotal)}`;
  });

  const orderDetails = `🛒 *ORDER DETAILS:*\n${itemLines.join('\n')}`;

  // Total
  const totalSection = `------------------------------\n💰 *TOTAL AMOUNT:* ₦${formatNaira(totalAmount)}`;

  // Payment instructions
  const bankName = vendorBank.bankName || 'Direct Transfer';
  const accNumber = vendorBank.accountNumber || 'Provided upon confirmation';
  const accName = vendorBank.accountName || storeName;

  const paymentInstructions =
    `💳 *PAYMENT INSTRUCTIONS (DIRECT TRANSFER):*\n` +
    `Bank: ${bankName}\n` +
    `Account: ${accNumber}\n` +
    `Name: ${accName}`;

  const footer = `_Please reply to confirm availability and acknowledge payment!_`;

  return [
    header,
    customerInfo.join('\n'),
    '',
    orderDetails,
    '',
    totalSection,
    '',
    paymentInstructions,
    '',
    footer
  ].join('\n');
}

/**
 * Creates the direct wa.me URL for the order.
 * CRITICAL RULE (Blueprint 4.3): Must be triggered synchronously on user click:
 * window.location.href = generateOrderWhatsAppUrl(order);
 */
export function generateOrderWhatsAppUrl(order: DirectCartOrder): string {
  const normalizedVendorPhone = normalizePhoneNumber(order.vendorWhatsapp);
  const message = compileOrderMessage(order);
  return buildWhatsAppLink(normalizedVendorPhone, message);
}

/**
 * Compiles the Pro Subscription Upgrade Proof message (Blueprint Section 2).
 */
export function compileProUpgradeProofMessage(params: {
  storeName: string;
  slug: string;
}): string {
  return `Hello Support, I have paid ₦3,000 for Pro activation for my store: *${params.storeName}* (URL: ${params.slug}). Attached is my payment receipt.`;
}

/**
 * Creates the wa.me link to the platform admin for Pro upgrade confirmation.
 */
export function generateProUpgradeWhatsAppUrl(params: {
  adminPhone: string;
  storeName: string;
  slug: string;
}): string {
  const normalizedAdminPhone = normalizePhoneNumber(params.adminPhone);
  const message = compileProUpgradeProofMessage({
    storeName: params.storeName,
    slug: params.slug
  });
  return buildWhatsAppLink(normalizedAdminPhone, message);
}
