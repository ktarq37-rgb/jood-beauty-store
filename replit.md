# JoodBeauty - Korean Beauty E-commerce

## Overview
JoodBeauty is a Korean beauty products e-commerce website built with Next.js 16. The site features product browsing, shopping cart functionality, i18n support (Arabic/English), and an admin panel.

## Project Structure
```
/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── *.tsx             # Feature components
├── lib/                   # Utility libraries
│   ├── i18n/             # Internationalization
│   ├── supabase/         # Supabase client
│   └── *.ts              # Data and utilities
├── public/               # Static assets (images)
├── styles/               # Global styles
└── scripts/              # Utility scripts
```

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Shadcn
- **Database**: Supabase (optional - has fallback data)
- **Package Manager**: pnpm

## Development
The development server runs on port 5000:
```bash
pnpm dev -H 0.0.0.0 -p 5000
```

## Environment Variables (Optional)
For Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Features
- Multi-language support (Arabic/English)
- Product categories: Skincare, Hair Care, Body Care, Personal Care
- Shopping cart with side drawer
- Admin panel for product management
- Responsive design

## Recent Changes
- 2026-01-18: Configured for Replit environment (port 5000, host 0.0.0.0)
