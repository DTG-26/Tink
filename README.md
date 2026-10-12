# WhatsApp Direct-Cart Catalog

A mobile-first digital menu and product catalog for social commerce sellers. Buyers browse, build a client-side cart, and generate a pre-formatted WhatsApp order message sent directly to the vendor with direct Nigerian bank transfer instructions.

---

## Phase 1 Implementation Summary

Phase 1 establishes the complete database schema, Row Level Security (RLS) policies, storage bucket configurations, phone normalizer routine, system constants, and TypeScript interfaces.

### 1. Database & Security (`supabase/migrations/20261012000000_init_catalog_schema.sql`)
- **`vendors` Table**: Stores vendor profiles, unique store URL slugs, normalized WhatsApp numbers (E.164 without `+`), Nigerian bank account details (for direct customer transfers), open/closed status, and Pro subscription metadata (`is_pro`, `pro_expires_at`).
- **`categories` Table**: Organizes vendor products into sorted categories.
- **`products` Table**: Product catalog items with price, description, images, sort orders, and 1-tap `is_available` toggles.
- **Row Level Security (RLS)**:
  - **Public (SELECT)**: Anyone can read vendor information, categories, and available products (`is_available = true`).
  - **Vendors (INSERT/UPDATE/DELETE)**: Strictly scoped to authenticated vendors matching `auth.uid() = vendor_id` (or `auth.uid() = id`).
- **Storage Bucket**: Configured public `catalog-assets` bucket with RLS allowing authenticated vendors to manage their folder assets.
- **Timestamp Triggers**: `handle_updated_at` automatically updates `updated_at` on records.

### 2. E.164 Phone Sanitizer (`lib/phone.ts`)
Conforms to Specification 4.1:
- Normalizes Nigerian mobile phone numbers into uniform 13-digit format without `+` (`234XXXXXXXXXX`).
- Handles `0803...` -> `234803...`, `+234 803...` -> `234803...`, `803...` -> `234803...`.
- Validates prefixes (`070`, `080`, `081`, `090`, `091`) and enforces exact 13-digit length.
- Provides `formatDisplayPhone()` and `buildWhatsAppLink()`.

### 3. TypeScript Interfaces (`types/database.ts`)
- Entity models: `Vendor`, `Category`, `Product`, and their Insert/Update variants.
- Pro status evaluator: `checkIsActivePro(vendor)` implementing $\text{isActivePro} = (\text{is\_pro} == \text{true}) \land (\text{pro\_expires\_at} > \text{NOW()})$.
- Client cart types: `CartItem`, `CustomerDetails`, and `DirectCartOrder`.
- Full Supabase database schema map (`Database`).

### 4. WhatsApp Template Compiler (`lib/whatsapp.ts`)
- Strict template implementation matching Section 4.4 specifications.
- Formats Nigerian Naira currency (`₦`).
- Synchronous direct link generator avoiding popup-blockers (`window.location.href`).

### 5. Constants & Reserved Slugs (`lib/constants.ts`)
- System route rejection list (`['dashboard', 'api', 'login', 'register', ...]`).
- Freemium tier limits (Max 10 products on free tier, ₦3,000/mo Pro tier).

---

## Phase 2 Implementation Summary: Public Storefront & Local Cart

Phase 2 builds the mobile-first customer storefront experience with client-side cart persistence:

### 1. Dynamic Store Route (`app/[slug]/page.tsx`)
- Queries vendor profile, categories, and active products (`is_available = true`) from Supabase.
- Dynamically generates SEO metadata (`title`, `description`).
- Includes built-in demo catalog (`/bites-by-khalid`) for preview and testing.

### 2. Client-Side Cart Store (`context/CartContext.tsx`)
- Strictly stored in `localStorage` under `directcart_${slug}` (isolated per store).
- Zero buyer accounts or server checkout tables.
- Supports `addItem`, `removeItem`, `updateQuantity`, `getItemQuantity`, `totalCount`, and `totalAmount`.

### 3. Mobile Storefront Components
- **`StoreHeader.tsx`**: Store banner, logo avatar, Verified Store badge (`isActivePro`), WhatsApp chat button, and Open/Closed status indicator.
- **`CategoryPills.tsx`**: Horizontal scrollable category filter pills with live item count per category.
- **`ProductCard.tsx`**: Product image, title, formatted Naira price (`₦`), out-of-stock badge, and inline `[-] [qty] [+]` stepper controls.
- **`StickyCartBar.tsx`**: Floating bottom checkout bar with item count badge and live total.
- **`StoreFooter.tsx`**: "Powered by DirectCart" footer badge on Free Tier, hidden for Pro Tier.

---

## Phase 3 Implementation Summary: Checkout Drawer & WhatsApp Engine

Phase 3 implements the slide-up customer checkout drawer and WhatsApp direct-order compiler:

### 1. Slide-Up Checkout Drawer (`components/CheckoutDrawer.tsx`)
- Slides up from the bottom on mobile screens with backdrop blur and touch dismiss.
- Displays line items with instant `[-] [qty] [+]` steppers and item deletion.
- Customer Delivery Form: Full Name, WhatsApp Number (validated against Nigerian mobile prefixes), Delivery Address, and optional Order Note.
- Persists customer details in `localStorage` (`directcart_customer_info`) so returning buyers don't re-type info.
- Bank Transfer Preview: Shows vendor's bank name, account number, and account name with a 1-tap copy button.

### 2. WhatsApp Message Compiler & URL Engine (`lib/whatsapp.ts`)
- Formats orders strictly to the Blueprint Section 4.4 specification:
  - Header: `🛍️ *NEW ORDER - [Store Name]*`
  - Customer info block: Name, Phone, Delivery Address, and optional Note
  - Order details itemized: `• [Qty]x [Item Title] — ₦[Item Total]`
  - Total amount: `💰 *TOTAL AMOUNT:* ₦[Total Sum]`
  - Bank transfer instructions: Bank, Account Number, Account Name
  - Confirmation notice: `_Please reply to confirm availability and acknowledge payment!_`

### 3. Anti-Popup-Blocker Synchronous Trigger (Rule 4.3)
- WhatsApp URL is generated and triggered **synchronously** via `window.location.href = whatsappUrl`.
- **Zero asynchronous network delays or `await fetch()` calls** preceding the redirect, completely avoiding Safari/Chrome popup-blockers.

---

## Phase 4 Implementation Summary: Vendor Dashboard & Store Management (100% Free / Unlimited)

Per user directive, all features are currently **100% Free and Unlimited** (no paid tier paywalls or product creation caps):

### 1. Store Registration Flow (`app/register/page.tsx`)
- **Real-Time Slug Generator (`lib/slug.ts`)**: Generates store URL slugs as the seller types the store name, with live validation checking format and rejecting reserved routes (`dashboard`, `api`, `login`, `register`, `admin`, etc.).
- **E.164 WhatsApp Normalizer (`lib/phone.ts`)**: Validates Nigerian mobile format and normalizes to 13 digits (`234XXXXXXXXXX`).
- **Bank Transfer Setup**: Collects Bank Name, 10-digit Account Number, and Account Name.

### 2. Vendor Dashboard (`app/dashboard/page.tsx`)
- **Live Catalog Access**: Copyable store URL and direct "View Live Catalog" link.
- **1-Tap Store Controls**: Pause/Resume store ordering status (`is_open`).
- **Product Management (`components/dashboard/ProductList.tsx`)**:
  - **Optimistic 1-Tap `is_available` Toggle**: Instantly toggles stock status in the UI while updating the database in the background.
  - Search and filter by category.
  - Edit and Delete actions.
- **Unlimited Product Creation (`components/dashboard/ProductModal.tsx`)**:
  - Add and Edit products with title, price (₦), category, description, image URL, and initial stock status.
  - Zero paywall restrictions.
- **Category Manager (`components/dashboard/CategoryManager.tsx`)**:
  - Create, view, and delete menu categories.
- **Store & Bank Settings (`components/dashboard/StoreSettingsModal.tsx`)**:
  - Update store name, slug, WhatsApp number, bio, logo, banner, and Nigerian bank details.

---

## Applying the Supabase Migration

1. Navigate to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and click on the **SQL Editor** tab in the sidebar.
3. Copy the contents of [`supabase/migrations/20261012000000_init_catalog_schema.sql`](file:///c:/Users/muham/OneDrive/whatapp%20project/supabase/migrations/20261012000000_init_catalog_schema.sql).
4. Paste and click **Run**.
