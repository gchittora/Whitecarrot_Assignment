# Technical Specification

## Assumptions

I made a few assumptions while building this:

- Companies will provide their own logo/banner URLs rather than uploading files (easier to implement, no storage costs)
- Each company gets one admin user who can manage everything (no complex role system needed)
- Job descriptions use simple markdown-like formatting (##, -, **) instead of a full WYSIWYG editor
- The public careers page is always live - no draft/publish workflow (changes go live immediately)
- Companies are okay with their careers page being at /company-slug/careers instead of a custom domain

## Architecture

### Tech Stack

**Frontend**
- Next.js 16 with App Router (server components where possible, client components only when needed)
- React for UI
- Tailwind CSS for styling
- TypeScript for type safety

**Backend**
- Next.js API Routes
- NextAuth.js v5 for authentication
- Prisma ORM for database access

**Database**
- PostgreSQL (using Neon's free tier)
- Stores companies, users, jobs, and page sections

### Why These Choices

I picked Next.js because it handles both frontend and backend in one place. The App Router is newer but makes server-side rendering really straightforward. 

For auth, NextAuth.js seemed like the standard choice - it handles sessions, password hashing, and all the security stuff I didn't want to mess up.

Prisma made database work much easier than writing raw SQL. The schema file is clear and migrations are automatic.

### Project Structure

```
src/
├── app/
│   ├── [companySlug]/careers/          # Public careers pages
│   │   ├── page.tsx                    # Main careers page
│   │   ├── JobsList.tsx                # Client component for filters
│   │   └── jobs/[jobId]/page.tsx       # Individual job page
│   ├── dashboard/                      # Protected admin area
│   │   ├── page.tsx                    # Dashboard overview
│   │   ├── jobs/                       # Job management
│   │   ├── page-builder/               # Section management
│   │   └── settings/                   # Company settings
│   ├── login/                          # Login page
│   ├── signup/                         # Signup page
│   └── api/                            # API endpoints
│       ├── auth/                       # Auth endpoints
│       ├── jobs/                       # Job CRUD
│       ├── page-sections/              # Section CRUD
│       └── company/                    # Company updates
├── components/                         # Shared components
├── lib/                                # Utilities (Prisma client)
└── types/                              # TypeScript definitions

prisma/
├── schema.prisma                       # Database schema
└── seed.ts                             # Sample data
```

## Database Schema

### Company
Stores company information and branding.

```
- id (uuid, primary key)
- slug (unique, for URL)
- name
- description
- logoUrl
- bannerUrl
- videoUrl (YouTube)
- themeColor (hex code)
- createdAt
```

### User
One admin per company for now.

```
- id (uuid, primary key)
- email (unique)
- name
- passwordHash (bcrypt)
- companyId (foreign key)
- createdAt
```

### Job
Job postings.

```
- id (uuid, primary key)
- title
- description (markdown-like text)
- location
- jobType (Full-time, Part-time, etc.)
- department (optional)
- isActive (boolean, for hiding jobs)
- companyId (foreign key)
- createdAt
```

### PageSection
Customizable content sections.

```
- id (uuid, primary key)
- sectionType (about_us, benefits, values, etc.)
- title
- content (JSON string)
- order (for sorting)
- isVisible (boolean)
- companyId (foreign key)
- createdAt
```

The content field stores JSON because different section types need different data structures. For example, benefits need an array of objects with icons, titles, and descriptions.

### Indexes

Added indexes on:
- Company.slug (for fast lookups by URL)
- User.email (for login)
- Job.companyId (for filtering jobs)
- PageSection.companyId (for filtering sections)

## Multi-Tenancy Approach

Each company's data is completely isolated:

1. Every table has a companyId foreign key
2. All queries filter by companyId from the session
3. Middleware protects dashboard routes
4. API endpoints verify ownership before allowing changes

The session stores the user's companyId, so we always know which company's data to show. This is simpler than having separate databases per company.

## Test Plan

### Manual Testing Checklist

**Authentication**
- [ ] Can sign up with new company
- [ ] Can log in with existing account
- [ ] Can't access dashboard without login
- [ ] Can log out
- [ ] Wrong password shows error
- [ ] Duplicate email shows error

**Job Management**
- [ ] Can create new job
- [ ] Can edit existing job
- [ ] Can delete job
- [ ] Can toggle active/inactive
- [ ] Jobs appear on public page when active
- [ ] Jobs hidden when inactive

**Page Builder**
- [ ] Can create new section
- [ ] Can edit section content
- [ ] Can change section order
- [ ] Can toggle visibility
- [ ] Can delete section
- [ ] Changes appear on public page

**Company Settings**
- [ ] Can update company name
- [ ] Can change slug (URL)
- [ ] Can update logo/banner URLs
- [ ] Can change theme color
- [ ] Theme color applies to public page

**Public Careers Page**
- [ ] Shows company branding
- [ ] Displays all visible sections
- [ ] Lists active jobs
- [ ] Search filters jobs by title
- [ ] Department filter works
- [ ] Location filter works
- [ ] Job type filter works
- [ ] Can clear all filters
- [ ] Job details page shows full description
- [ ] Preview banner shows for logged-in recruiter

**Multi-Tenancy**
- [ ] Different companies see different data
- [ ] Can't access other company's jobs
- [ ] Can't edit other company's settings
- [ ] Each company has unique URL

### Edge Cases Tested

- Empty states (no jobs, no sections)
- Very long job titles/descriptions
- Special characters in company names
- Invalid URLs for logos/banners
- Duplicate company slugs
- Invalid JSON in section content

### What I'd Add With More Time

- Automated tests with Jest/Playwright
- API endpoint tests
- Database transaction tests
- Performance testing with many jobs
- Security penetration testing
- Accessibility audit with axe-core

## Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- Sessions use JWT with secret key
- All dashboard routes protected by middleware
- API endpoints verify user owns the data
- SQL injection prevented by Prisma's parameterized queries
- XSS prevented by React's automatic escaping
- CSRF protection from NextAuth

## Performance Notes

- Server components reduce JavaScript sent to browser
- Database queries include only needed fields
- Indexes on frequently queried columns
- Images lazy load on careers page
- No unnecessary re-renders (React.memo where needed)

Could improve with:
- Redis caching for public pages
- CDN for static assets
- Database connection pooling
- Image optimization service
- Pagination for companies with many jobs

## Known Limitations

- No file upload (companies must host images elsewhere)
- No email verification on signup
- No password reset flow
- No analytics/tracking
- No application form (just displays jobs)
- No role-based access (one admin per company)
- Changes go live immediately (no preview/publish)
- Section content requires JSON knowledge
