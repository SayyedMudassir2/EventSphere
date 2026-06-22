# EventSphere

### Enterprise Event Marketplace & Ticketing Ecosystem

<p align="center">
  <strong>Discover. Publish. Book. Attend.</strong><br/>
  Premium event infrastructure built for organizers, attendees, and enterprise-scale event operations.
</p>

---

# Overview

EventSphere is a modern, enterprise-grade event discovery, ticketing, and attendee management platform designed to connect event organizers with experience seekers through a secure, scalable, and high-performance ecosystem.

The platform enables:

* Event discovery and search
* Ticket booking and payment processing
* Organizer event management
* Digital pass wallets
* Administrative operations
* Analytics and reporting
* Automated notifications
* SEO-optimized event indexing

Built on a privacy-first architecture, EventSphere prioritizes:

* Ultra-low latency
* Accessibility
* Search engine visibility
* Operational scalability
* Security by default

---

# Platform Architecture

```text
┌────────────────────────────────────────────┐
│               Edge Network                 │
│                proxy.ts                    │
└─────────────────┬──────────────────────────┘
                  │
      ┌───────────┼────────────┬──────────────┐
      ▼           ▼            ▼              ▼

┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Discovery │ │ Organizer │ │ Attendee  │ │  Admin    │
│  Portal   │ │  Console  │ │  Wallet   │ │ Dashboard │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

---

# Core Product Domains

## 1. Public Discovery Platform

The discovery engine serves as the primary acquisition channel for attendees.

### Features

* Advanced event search
* Category filtering
* SEO-friendly URLs
* Infinite catalog scalability
* Server-side pagination
* Dynamic metadata generation

### Search Engine

Cross-field PostgreSQL querying:

```sql
title ILIKE '%query%'
OR category ILIKE '%query%'
```

### URL State Persistence

```bash
/events?category=technology&q=nextjs
```

Benefits:

* Sharable searches
* Better SEO indexing
* Consistent navigation state

---

## 2. Attendee Wallet System

A centralized dashboard for purchased tickets and event participation history.

### Active Passes

Displays:

* Upcoming events
* Entry QR codes
* Venue information
* Calendar integrations

### Historical Archive

Expired tickets automatically transition into archived mode.

Visual treatment:

```css
opacity: 0.65;
filter: grayscale(20%);
```

### Ticket Printing Engine

Lightweight print subsystem:

```tsx
window.print()
```

Generates:

* Event tickets
* Tax invoices
* Payment receipts

without PDF rendering dependencies.

### Calendar Integrations

One-click exports to:

* Google Calendar
* Outlook Calendar
* Apple Calendar

No third-party scripts required.

---

## 3. Organizer Management Console

Provides creators with complete event lifecycle management.

### Event Operations

* Create events
* Update events
* Publish schedules
* Upload media
* Manage ticket inventory

### Submission Protection

Uses React concurrent features:

```tsx
useActionState()
useTransition()
```

Benefits:

* Duplicate submission prevention
* Race-condition protection
* Improved UX feedback

### Media Upload Security

```tsx
crypto.randomUUID()
```

Advantages:

* Collision-free filenames
* Deterministic uploads
* Concurrent upload safety

---

## 4. Administrative Control Center

Enterprise operations dashboard for platform management.

### Operational Visibility

Administrators can monitor:

* Ticket sales
* User growth
* Revenue metrics
* Event performance
* Verification activity

### Analytics Aggregation

Parallel execution:

```ts
Promise.all()
```

Benefits:

* Reduced API latency
* Faster dashboard loads
* Efficient resource utilization

### Audit Logging

Centralized event ledger enables:

* Ticket tracing
* Payment verification
* Venue auditing
* User activity inspection

---

# Role-Based Access Control (RBAC)

EventSphere enforces strict authorization boundaries.

| Role      | Permissions                 |
| --------- | --------------------------- |
| Guest     | Browse events               |
| Attendee  | Purchase and manage tickets |
| Organizer | Create and manage events    |
| Admin     | Full platform control       |

---

# Design System

## Color Palette

| Token      | Value     | Purpose          |
| ---------- | --------- | ---------------- |
| Background | `#040407` | OLED Midnight    |
| Surface    | `#09090e` | Elevated Panels  |
| Primary    | `#4f46e5` | Brand CTA        |
| Success    | `#10b981` | Positive Actions |
| Warning    | `#f59e0b` | Urgent States    |

---

## Typography

### Headlines

```css
text-4xl
sm:text-7xl
font-extrabold
leading-[1.1]
```

### Metadata Labels

```css
text-[10px]
font-mono
font-bold
tracking-widest
uppercase
```

---

# Technology Stack

## Frontend

* Next.js App Router
* React 19
* TypeScript
* Tailwind CSS
* Server Actions

## Backend

* Supabase
* PostgreSQL
* Edge Middleware
* ISR

## Infrastructure

* Vercel
* Edge Runtime
* CDN Distribution
* Incremental Static Regeneration

## Payments

### Razorpay

Secure transaction processing:

```ts
amount = totalAmount * 100
```

Features:

* Rupee payments
* Server verification
* Fraud protection

## Authentication

### Supabase Auth

Supports:

* Email & Password
* Session Management
* Role Mapping
* Secure JWT Validation

---

# Notification Infrastructure

## Email Delivery

Powered by:

* Nodemailer
* SMTP Providers
* CID Attachments

### Features

* Ticket delivery
* QR pass generation
* Purchase confirmations
* Offline email rendering

### Fault Tolerance

Mail delivery failures never block ticket issuance.

```ts
try {
  await sendEmail();
} catch {}
```

Ticket ownership remains intact even if email delivery temporarily fails.

---

# Performance Engineering

## Caching Strategy

ISR Revalidation:

```ts
export const revalidate = 3600;
```

Benefits:

* Reduced database load
* Faster TTFB
* Improved Core Web Vitals

---

## Performance Targets

| Metric                   | Target |
| ------------------------ | ------ |
| Lighthouse Score         | 95+    |
| First Contentful Paint   | <1.5s  |
| Largest Contentful Paint | <2.5s  |
| Time To Interactive      | <3s    |
| CLS                      | <0.1   |

---

# SEO Architecture

## Dynamic Metadata

```ts
generateMetadata()
```

Example:

```ts
${event.title} Tickets | EventSphere
```

### Benefits

* Higher CTR
* Better indexing
* Rich search visibility

---

## Semantic Structure

```html
<article>
<section>
<header>
<footer>
```

Improves:

* Accessibility
* Search indexing
* Content hierarchy

---

# Security Architecture

## Edge Middleware Protection

```text
proxy.ts
```

Responsibilities:

* Session validation
* Route protection
* Role enforcement
* Redirect handling

---

## Protected Routes

```text
/admin
/organizer
/wallet
/settings
```

Unauthorized users are redirected before page rendering.

---

## Hydration Protection

```tsx
suppressHydrationWarning
```

Prevents rendering mismatches caused by:

* Browser extensions
* Translation overlays
* Third-party DOM modifications

---

# Scalability Roadmap

### Phase 1

* Event marketplace
* Ticketing
* Wallet system

### Phase 2

* Mobile applications
* Push notifications
* Referral engine

### Phase 3

* AI event recommendations
* Dynamic pricing
* Multi-city expansion

### Phase 4

* Enterprise event suites
* White-label deployments
* International ticketing

---

# Project Vision

EventSphere is not merely a ticketing platform.

It is a complete event commerce infrastructure designed to power the next generation of conferences, workshops, sports experiences, entertainment events, and community gatherings through a secure, scalable, and conversion-optimized ecosystem.

---


# Local Development Setup

Follow these instructions to run EventSphere locally on your machine.

---

## Prerequisites

Ensure the following software is installed:

* Node.js 20+
* npm, pnpm, or yarn
* Git
* Supabase Project
* Razorpay Account
* SMTP Email Provider

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# Clone Repository

```bash
git clone https://github.com/your-username/eventsphere.git

cd eventsphere
```

---

# Install Dependencies

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

Using yarn:

```bash
yarn install
```

---

# Environment Configuration

Create a `.env.local` file in the project root.

```bash
touch .env.local
```

Add the following variables:

```env
# ----------------------------------------------------
# SUPABASE
# ----------------------------------------------------

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ----------------------------------------------------
# RAZORPAY
# ----------------------------------------------------

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

NEXT_PUBLIC_RAZORPAY_KEY_ID=

# ----------------------------------------------------
# EMAIL SERVICE
# ----------------------------------------------------

EMAIL_USER=

EMAIL_PASS=
```

---

# Environment Variable Reference

| Variable                             | Description                     |
| ------------------------------------ | ------------------------------- |
| NEXT_PUBLIC_SUPABASE_URL             | Supabase project URL            |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Supabase publishable client key |
| NEXT_PUBLIC_SUPABASE_ANON_KEY        | Supabase anonymous access key   |
| RAZORPAY_KEY_ID                      | Razorpay public key             |
| RAZORPAY_KEY_SECRET                  | Razorpay secret key             |
| NEXT_PUBLIC_RAZORPAY_KEY_ID          | Client-side Razorpay key        |
| EMAIL_USER                           | SMTP email address              |
| EMAIL_PASS                           | SMTP application password       |

---

# Database Setup

Create a new Supabase project.

Copy:

* Project URL
* Publishable Key
* Anonymous Key

Paste them into `.env.local`.

Run all SQL migrations:

```sql
-- Execute migration files from:

supabase/migrations/
```

After migration, verify tables:

* profiles
* events
* bookings
* tickets
* audit_logs

---

# Start Development Server

```bash
npm run dev
```

or

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# Production Build

Generate a production build locally:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

# Deployment

Recommended deployment stack:

| Service       | Purpose          |
| ------------- | ---------------- |
| Vercel        | Frontend Hosting |
| Supabase      | Database + Auth  |
| Razorpay      | Payments         |
| SMTP Provider | Email Delivery   |

Deployment process:

```bash
git push origin main
```

Connect repository to Vercel.

Configure all environment variables inside the Vercel Dashboard.

Deploy.

---

# Project Structure

```text
eventsphere/

├── app/
│
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── verify/
│   │   │   │   └── [bookingId]/
│   │   │   │       └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── TransactionTableLog.tsx
│   │   │
│   │   ├── attendee/
│   │   │   └── page.tsx
│   │   │
│   │   ├── organizer/
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   ├── edit/
│   │   │   │   └── [id]/
│   │   │   │       └── EditEventForm.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── ActiveDesktopLinks.tsx
│   │   ├── MobileNav.tsx
│   │   ├── usePageTransition.ts
│   │   └── layout.tsx
│
│   ├── (main)/
│   │   ├── events/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   │
│   │   ├── page.tsx
│   │   └── layout.tsx
│
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── booking.ts
│   │   ├── createEvent.ts
│   │   ├── email.ts
│   │   ├── events.ts
│   │   ├── payments.ts
│   │   └── updateEvents.ts
│
│   ├── components/
│   │   ├── AuthHeader.tsx
│   │   └── ...
│
│   ├── dashboard/
│   ├── my-bookings/
│   ├── unauthorized/
│
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
│
├── emails/
│
├── hooks/
│
├── lib/
│
├── public/
│
├── proxy.ts
│
├── .env.local
├── .gitignore
│
└── package.json
```

---

# Directory Overview

| Directory         | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `app/(auth)`      | Authentication routes and layouts                          |
| `app/(main)`      | Public-facing pages and event discovery                    |
| `app/(dashboard)` | Protected dashboards for admins, organizers, and attendees |
| `app/actions`     | Server Actions and business logic                          |
| `app/components`  | Shared UI components                                       |
| `emails`          | Email templates and ticket mail layouts                    |
| `hooks`           | Reusable React hooks                                       |
| `lib`             | Database clients, utilities, helpers, and integrations     |
| `public`          | Static assets                                              |
| `proxy.ts`        | Edge middleware, RBAC, and route protection                |
| `.env.local`      | Environment configuration                                  |
| `.gitignore`      | Git exclusions                                             |

---

# Route Architecture

## Public Routes

```text
/
/events
/events/[id]
/sign-in
/sign-up
```

Accessible to all users.

---

## Attendee Routes

```text
/dashboard/attendee
/my-bookings
/profile
```

Requires authentication.

---

## Organizer Routes

```text
/dashboard/organizer
/dashboard/organizer/create
/dashboard/organizer/edit/[id]
```

Restricted to organizer accounts.

---

## Admin Routes

```text
/dashboard/admin
/dashboard/admin/verify/[bookingId]
```

Restricted to administrator accounts.

---

# Application Flow

```text
Visitor
   │
   ▼

Event Discovery
   │
   ▼

Event Details
   │
   ▼

Authentication
   │
   ▼

Booking Checkout
   │
   ▼

Razorpay Payment
   │
   ▼

Ticket Generation
   │
   ▼

QR Pass Issued
   │
   ▼

Email Delivery
   │
   ▼

Attendee Wallet
```

---

# Security Boundaries

```text
Guest
   │
   ▼
Public Pages

Attendee
   │
   ▼
Bookings + Wallet

Organizer
   │
   ▼
Event Management

Admin
   │
   ▼
Verification + Platform Operations
```

All role validation is enforced through:

```ts
proxy.ts
```

before protected routes are rendered.

---

# Troubleshooting

### Supabase Connection Error

Verify:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

### Razorpay Checkout Not Opening

Verify:

```env
RAZORPAY_KEY_ID
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

---

### Email Delivery Failure

Verify:

```env
EMAIL_USER
EMAIL_PASS
```

Ensure SMTP credentials are valid and application passwords are enabled.

---

# Security Notes

Never commit:

```text
.env
.env.local
.env.production
```

Add them to `.gitignore`.

Example:

```gitignore
.env*
```

Keep all secrets private and rotate credentials regularly.

---

# License

MIT License

Copyright (c) 2026 EventSphere

Permission is hereby granted, free of charge, to any person obtaining a copy of this software to use, modify, distribute, and sublicense the software under the terms of the MIT License.
